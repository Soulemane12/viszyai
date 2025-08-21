'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Instagram, Linkedin, Twitter, Globe, Plus, X } from 'lucide-react';
import { isHandleAvailable, updateProfile } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export default function CreateProfilePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    phone: '',
    photo: null as File | null,
    bio: ''
  });
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [handle, setHandle] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  // Check handle availability
  const checkHandleAvailability = async (handleValue: string) => {
    if (handleValue.length < 3) {
      setHandleAvailable(null);
      return;
    }
    
    const { available, error } = await isHandleAvailable(handleValue);
    if (error) {
      console.error('Error checking handle:', error);
      return;
    }
    setHandleAvailable(available);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!handle) {
        throw new Error('Please choose a profile handle');
      }

      // Check handle availability
      const { available } = await isHandleAvailable(handle);
      if (!available) {
        throw new Error('This handle is already taken. Please choose another one.');
      }

      // Update profile with handle and additional info
      if (profile) {
        const { error: updateError } = await updateProfile(profile.id, {
          handle,
          title: formData.title,
          phone: formData.phone,
          bio: formData.bio
        });

        if (updateError) {
          throw updateError;
        }

        // Redirect to QR page
        router.push(`/qr/${handle}`);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-slate-600 hover:text-indigo-600 mb-4 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Create Your Digital Business Card</h1>
          <p className="text-slate-600 mt-2">Fill in your information to generate your unique QR code</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Handle *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-indigo-300 bg-indigo-50 text-indigo-600 text-sm font-medium">
                      viszy.ai/u/
                    </span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => {
                        setHandle(e.target.value);
                        checkHandleAvailability(e.target.value);
                      }}
                      className={`flex-1 rounded-r-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-800 ${
                        handleAvailable === null ? 'border-indigo-300' :
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-indigo-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-800"
                    placeholder="Software Engineer, Student, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full border border-indigo-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-800"
                    rows={3}
                    placeholder="Tell people about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-indigo-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-800"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">Profile Photo</h2>
              
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  {formData.photo ? (
                    <Image
                      src={URL.createObjectURL(formData.photo)}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-indigo-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Upload Photo
                  </label>
                  <p className="text-sm text-slate-500 mt-2">Optional but recommended</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Social Media Links</h2>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
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
                      className="flex-1 border border-indigo-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 bg-white"
                    >
                      <option value="" className="text-slate-500">Select platform</option>
                      {socialPlatforms.map((platform) => (
                        <option key={platform.name} value={platform.name} className="text-slate-700">
                          {platform.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                      className="flex-1 border border-indigo-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-800"
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
                  <p className="text-slate-500 text-center py-6">
                    Add your social media links to help people connect with you
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !handleAvailable}
                className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  loading || !handleAvailable
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {loading ? 'Creating...' : 'Create My Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
