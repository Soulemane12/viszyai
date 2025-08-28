'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Globe, 
  User, 
  Download,
  Share2
} from 'lucide-react';
import WalletButton from '@/components/WalletButton';
import { getProfileWithSocialLinks, trackProfileView, trackSocialClick, trackContactDownload } from '@/lib/auth';
import { Profile } from '@/lib/database.types';
import BackButton from '@/components/BackButton';

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}

const socialIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  TikTok: Globe,
  Website: Globe,
  YouTube: Globe,
  Facebook: Globe,
};

export default function ProfilePage() {
  const params = useParams();
  const handle = params.handle as string;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ id: string; platform: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  // Load profile data from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!handle) return;
      
      try {
        const { profile: fetchedProfile, socialLinks: fetchedSocialLinks, error } = await getProfileWithSocialLinks(handle);
        
        if (error) {
          console.error('Error loading profile:', error);
          // Profile not found - show error state
          setProfileData(null);
        } else if (fetchedProfile) {
          const typedProfile = fetchedProfile as Profile;
          setProfile(typedProfile);
          setSocialLinks(fetchedSocialLinks);
          setProfileData({
            name: typedProfile.name,
            title: typedProfile.title || '',
            email: typedProfile.email,
            phone: typedProfile.phone || '',
            bio: typedProfile.bio || '',
            socialLinks: fetchedSocialLinks.map(link => ({
              platform: link.platform,
              url: link.url
            }))
          });

          // Track profile view (location will be automatically detected from IP)
          trackProfileView(typedProfile.id, {
            viewer_user_agent: navigator.userAgent,
          });
        } else {
          // No profile found
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Error occurred - show error state
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [handle]);

  const copyToClipboard = async (text: string) => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateVCard = () => {
    if (!profileData) return '';
    
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profileData.name}`,
      `TITLE:${profileData.title}`,
      `EMAIL:${profileData.email}`,
      `TEL:${profileData.phone}`,
      `NOTE:${profileData.bio}`,
      'END:VCARD'
    ].join('\n');
    
    return vcard;
  };

  const downloadVCard = () => {
    if (typeof window === 'undefined') return;
    const vcard = generateVCard();
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profileData?.name?.toLowerCase().replace(/\s+/g, '-')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Track contact download if we have profile data (location will be automatically detected from IP)
    if (profile) {
      const typedProfile = profile as Profile;
      trackContactDownload(typedProfile.id, {
        downloader_user_agent: navigator.userAgent,
        download_type: 'vcf',
      });
    }
  };

  const shareProfile = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profileData?.name}'s Contact Info`,
          text: `Check out ${profileData?.name}'s digital business card`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else if (typeof window !== 'undefined') {
      copyToClipboard(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">This profile doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-indigo-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BackButton 
                fallbackPath="/"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <span className="hidden sm:inline">Back</span>
              </BackButton>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile?.photo_url ? (
                  <Image
                    src={profile.photo_url}
                    alt={profileData.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base sm:text-lg font-bold text-indigo-600">
                    {profileData.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">{profileData.name}</h1>
                {profileData.title && (
                  <p className="text-xs sm:text-sm text-slate-600 truncate">{profileData.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={shareProfile}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-indigo-100">
            <div className="text-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {profile?.photo_url ? (
                  <Image
                    src={profile.photo_url}
                    alt={profileData.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                    {profileData.name.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                {profileData.name}
              </h2>
              {profileData.title && (
                <p className="text-slate-600 mb-3 text-sm sm:text-base">{profileData.title}</p>
              )}
              {profileData.bio && (
                <p className="text-slate-600 text-sm leading-relaxed px-2 sm:px-0">
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Contact Actions */}
            <div className="space-y-3">
              {profileData.email && (
                <button
                  onClick={() => copyToClipboard(profileData.email)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 border border-indigo-100"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <Mail className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-800 font-medium text-sm sm:text-base truncate">{profileData.email}</span>
                  </div>
                  <span className="text-sm text-indigo-600 font-medium ml-2 flex-shrink-0">Copy</span>
                </button>
              )}

              {profileData.phone && (
                <a
                  href={`tel:${profileData.phone}`}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-100"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <Phone className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-800 font-medium text-sm sm:text-base truncate">{profileData.phone}</span>
                  </div>
                  <span className="text-sm text-purple-600 font-medium ml-2 flex-shrink-0">Call</span>
                </a>
              )}
            </div>
          </div>

          {/* Social Links */}
          {profileData.socialLinks.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Connect</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileData.socialLinks.map((link, index) => {
                  const IconComponent = socialIcons[link.platform] || Globe;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        // Track social click if we have profile data (location will be automatically detected from IP)
                        if (profile) {
                          const typedProfile = profile as Profile;
                          const socialLink = socialLinks.find(sl => sl.platform === link.platform);
                          if (socialLink) {
                            trackSocialClick(typedProfile.id, socialLink.id, {
                              clicker_user_agent: navigator.userAgent,
                            });
                          }
                        }
                      }}
                      className="flex items-center justify-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 border border-indigo-100"
                    >
                      <IconComponent className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-slate-800 font-medium">{link.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Contacts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Save Contact</h3>
            <div className="space-y-3">
              {/* Smart Wallet Button - Primary action */}
              <WalletButton 
                profileData={profileData}
                profileUrl={`https://viszyai.vercel.app/profile/${params.handle}`}
                className="w-full"
                variant="primary"
              />
              
              {/* Fallback vCard Download */}
              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center p-2 sm:p-3 border-2 border-purple-200 text-purple-700 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="text-sm">Download vCard</span>
              </button>
            </div>
            <p className="text-sm text-slate-500 text-center mt-3 px-2 sm:px-0">
              Downloads a .vcf file you can import to your phone
            </p>
          </div>

          {/* Copied Notification */}
          {showCopied && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 mx-4">
              Copied to clipboard!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
