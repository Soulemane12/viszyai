'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Instagram, Linkedin, Twitter, Globe, Plus, X } from 'lucide-react';
import { isHandleAvailable, updateProfile, createProfile, createSocialLinks, updateSocialLinks, getUserProfile, getProfileWithSocialLinks, uploadProfilePhoto } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import ImageCropper from '@/components/ImageCropper';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export default function CreateProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    phone: '',
    photo: null as File | null,
    bio: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [handle, setHandle] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Load existing profile data
  const loadExistingProfileData = async () => {
    if (profile) {
      console.log('Loading existing profile data:', profile);
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        phone: profile.phone || '',
        photo: null, // We'll handle photo separately
        bio: profile.bio || ''
      });
      setHandle(profile.handle || '');
      setPhotoPreview(profile.photo_url || null);
      
      // Load existing social links
      try {
        const { socialLinks: existingSocialLinks } = await getProfileWithSocialLinks(profile.handle);
        if (existingSocialLinks && existingSocialLinks.length > 0) {
          console.log('Loading existing social links:', existingSocialLinks);
          setSocialLinks(existingSocialLinks.map(link => ({
            id: link.id,
            platform: link.platform,
            url: link.url
          })));
        }
      } catch (error) {
        console.error('Error loading social links:', error);
      }
    }
  };

  // Redirect if not authenticated and load existing profile data
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load existing profile data if available
    loadExistingProfileData();
  }, [user, profile, router]);

  const socialPlatforms = [
    { name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
    { name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
    { name: 'TikTok', icon: Globe, placeholder: 'https://tiktok.com/@username' },
    { name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
    { name: 'YouTube', icon: Globe, placeholder: 'https://youtube.com/@username' },
    { name: 'Facebook', icon: Globe, placeholder: 'https://facebook.com/username' },
  ];

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: '',
      url: ''
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL and show cropper
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setImageToCrop(imageSrc);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    // Convert blob to File
    const file = new File([croppedImageBlob], 'profile-photo.jpg', { type: 'image/jpeg' });
    setFormData({ ...formData, photo: file });
    setPhotoPreview(URL.createObjectURL(croppedImageBlob));
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  // Check handle availability with debouncing
  const checkHandleAvailability = async (handleValue: string) => {
    if (handleValue.length < 3) {
      setHandleAvailable(null);
      return;
    }
    
    try {
      const { available, error } = await isHandleAvailable(handleValue);
      if (error) {
        console.error('Error checking handle:', error);
        // Set to null on error to allow form submission
        setHandleAvailable(null);
        return;
      }
      setHandleAvailable(available);
    } catch (error) {
      console.error('Handle availability check failed:', error);
      // Set to null on error to allow form submission
      setHandleAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Form submission started');
    console.log('Form data:', { handle, formData, user: user?.id });

    try {
      // Validate required fields
      if (!handle) {
        throw new Error('Please choose a profile handle');
      }

      // Clean and validate handle format
      const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (cleanHandle.length < 3) {
        throw new Error('Handle must be at least 3 characters long');
      }

      console.log('Handle validation passed:', handle);
      console.log('Clean handle for submission:', cleanHandle);

      // Check handle availability (always check, but allow if it's the same handle for existing profile)
      console.log('Checking handle availability for:', cleanHandle);
      try {
        const { available, error } = await isHandleAvailable(cleanHandle);
        console.log('Handle availability result:', { available, error });
        
        if (error) {
          console.log('Handle availability check failed, proceeding anyway:', error);
          // Continue with profile creation even if availability check fails
        } else if (!available) {
          // If editing existing profile and handle hasn't changed, allow it
          if (profile && profile.handle === cleanHandle) {
            console.log('Handle unchanged for existing profile, allowing update');
          } else {
            throw new Error('This handle is already taken. Please choose another one.');
          }
        }
      } catch (error) {
        console.log('Handle availability check error, proceeding anyway:', error);
        // Continue with profile creation even if availability check fails
      }

              // Create or update profile with handle and additional info
        if (profile) {
          // Update existing profile
          console.log('Updating existing profile:', profile.id);
          
          let photoUrl = profile.photo_url;
          
          // Upload photo if a new one is selected
          if (formData.photo && user) {
            console.log('Uploading new photo...');
            const { url, error: uploadError } = await uploadProfilePhoto(formData.photo, user.id);
            if (uploadError) {
              console.error('Photo upload error:', uploadError);
              throw new Error('Failed to upload photo. Please try again.');
            }
            photoUrl = url;
            console.log('Photo uploaded successfully:', photoUrl);
          }
          
          const { error: updateError } = await updateProfile(profile.id, {
            name: formData.name,
            handle: cleanHandle,
            title: formData.title,
            phone: formData.phone,
            bio: formData.bio,
            photo_url: photoUrl
          });

          if (updateError) {
            console.error('Profile update error:', updateError);
            throw updateError;
          }

          console.log('Profile updated successfully! Now updating social links...');
          
          // Update social links
          const { error: socialError } = await updateSocialLinks(profile.id, socialLinks);
          if (socialError) {
            console.error('Error updating social links:', socialError);
            // Don't throw error, just log it - profile was updated successfully
          } else {
            console.log('Social links updated successfully');
          }
          
          // Refresh the user's profile data
          if (refreshProfile) {
            await refreshProfile();
          }
          
          // Redirect to QR page
          router.push(`/qr/${cleanHandle}`);
      } else if (user) {
        // Create new profile for new user
        console.log('Creating new profile for user:', user.id);
        
        // Clean the handle - remove spaces and special characters
        const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        console.log('Original handle:', handle);
        console.log('Clean handle:', cleanHandle);
        
        let photoUrl = null;
        
        // Upload photo if one is selected
        if (formData.photo && user) {
          console.log('Uploading photo for new profile...');
          const { url, error: uploadError } = await uploadProfilePhoto(formData.photo, user.id);
          if (uploadError) {
            console.error('Photo upload error:', uploadError);
            throw new Error('Failed to upload photo. Please try again.');
          }
          photoUrl = url;
          console.log('Photo uploaded successfully:', photoUrl);
        }
        
        const profileData = {
          user_id: user.id,
          handle: cleanHandle,
          name: formData.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          title: formData.title,
          phone: formData.phone,
          email: user.email || '',
          bio: formData.bio,
          photo_url: photoUrl || undefined
        };
        console.log('Profile data to create:', profileData);
        
        const { error: createError } = await createProfile(user.id, profileData);
        console.log('Profile creation result:', { createError });

        if (createError) {
          console.error('Profile creation error details:', createError);
          throw createError;
        }

        console.log('Profile created successfully! Now creating social links...');
        
        // Get the created profile to get its ID
        const { profile: createdProfile } = await getUserProfile(user.id);
        
        if (createdProfile) {
          // Create social links
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: socialError } = await createSocialLinks((createdProfile as any).id, socialLinks);
          if (socialError) {
            console.error('Error creating social links:', socialError);
            // Don't throw error, just log it - profile was created successfully
          } else {
            console.log('Social links created successfully');
          }
        }
        
        // Refresh the user's profile data
        if (refreshProfile) {
          await refreshProfile();
        }
        
        // Add a small delay to ensure the profile is fully created
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to QR page
        router.push(`/qr/${cleanHandle}`);
      } else {
        throw new Error('User not authenticated. Please try logging in again.');
      }
    } catch (error: unknown) {
      console.error('Profile creation error:', error);
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('401')) {
          setError('Authentication error. Please log in again.');
          router.push('/login');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton 
            fallbackPath={profile ? "/dashboard" : "/"}
          >
            {profile ? 'Back to Dashboard' : 'Back to Home'}
          </BackButton>
          <h1 className="text-3xl font-bold text-high-contrast">
            {profile ? 'Edit Your Digital Business Card' : 'Create Your Digital Business Card'}
          </h1>
          <p className="text-medium-contrast mt-2">
            {profile ? 'Update your information and regenerate your QR code' : 'Fill in your information to generate your unique QR code'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 card-enhanced p-8 rounded-2xl">
            {/* Basic Information */}
            <div className="bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-high-contrast">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-medium-contrast mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 text-white"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-medium-contrast mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {photoPreview ? (
                        <div className="relative">
                          <Image
                            src={photoPreview}
                            alt="Profile preview"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600">
                          <User className="w-8 h-8 text-indigo-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                      >
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      <p className="text-xs text-subtle mt-1">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-medium-contrast mb-2">
                    Profile Handle *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-indigo-50 text-indigo-600 text-sm font-medium">
                      viszyai.vercel.app/profile/
                    </span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => {
                        setHandle(e.target.value);
                        
                        // Clear previous timer
                        if (debounceTimer) {
                          clearTimeout(debounceTimer);
                        }
                        
                        // Set new timer for debounced check
                        const newTimer = setTimeout(() => {
                          checkHandleAvailability(e.target.value);
                        }, 500);
                        setDebounceTimer(newTimer);
                      }}
                      className={`flex-1 rounded-r-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-subtle text-high-contrast ${
                        handleAvailable === null ? 'border-gray-600' :
                        handleAvailable ? 'border-green-300' : 'border-red-300'
                      }`}
                      placeholder="your-name"
                      required
                    />
                  </div>
                  {handle && handleAvailable !== null && (
                    <p className={`text-sm mt-1 ${
                      handleAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {handleAvailable ? '✓ Handle is available' : '✗ Handle is already taken'}
                    </p>
                  )}
                  {profile && (
                    <p className="text-sm mt-1 text-blue-600">
                      💡 You can change your handle anytime. Your old links will redirect to the new one.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-medium-contrast mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder:text-subtle text-high-contrast"
                    placeholder="Software Engineer, Student, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-medium-contrast mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder:text-subtle text-high-contrast"
                    rows={3}
                    placeholder="Tell people about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-high-contrast">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-medium-contrast mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder:text-subtle text-high-contrast"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>



            {/* Social Media Links */}
            <div className="bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-high-contrast">Social Media Links</h2>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </button>
              </div>
              
              <div className="space-y-4">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center space-x-2">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                      className="flex-1 border border-gray-600 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-medium-contrast bg-gray-800/50"
                    >
                      <option value="" className="text-subtle">Select platform</option>
                      {socialPlatforms.map((platform) => (
                        <option key={platform.name} value={platform.name} className="text-medium-contrast">
                          {platform.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                      className="flex-1 border border-gray-600 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-subtle text-high-contrast"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {socialLinks.length === 0 && (
                  <p className="text-subtle text-center py-6">
                    Add your social media links to help people connect with you
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || handleAvailable === false || !handle}
                className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  loading || handleAvailable === false || !handle
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'btn-primary-enhanced text-white '
                }`}
              >
                {loading 
                  ? (profile ? 'Updating...' : 'Creating...')
                  : !handle 
                    ? 'Enter Handle First'
                    : handleAvailable === false
                      ? 'Handle Unavailable'
                      : (profile ? 'Update My Card' : 'Create My Card')
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
          circularCrop={true}
        />
      )}
    </div>
  );
}
