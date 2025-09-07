'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Share2, Smartphone, QrCode, Edit, BarChart3 } from 'lucide-react';
import WalletButton from '@/components/WalletButton';
import QRCode from 'react-qr-code';
import { getProfileWithSocialLinks, trackQRScan } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
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

export default function QRPage({ params }: { params: { handle: string } }) {
  const { user, profile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if this is the user's own profile
  const isOwnProfile = user && profile && profile.handle === params.handle;

  // Load profile data from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { profile, socialLinks, error } = await getProfileWithSocialLinks(params.handle);
        
        if (error) {
          console.error('Error loading profile:', error);
          // Profile not found - show error state
          setProfileData(null);
        } else if (profile) {
          setProfileData({
            name: profile.name,
            title: profile.title || '',
            email: profile.email,
            phone: profile.phone || '',
            bio: profile.bio || '',
            socialLinks: socialLinks.map(link => ({
              platform: link.platform,
              url: link.url
            }))
          });

          // Track QR scan only if it's not the user's own profile
          if (!isOwnProfile) {
            trackQRScan(profile.id, {
              scanner_user_agent: navigator.userAgent,
              device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            });
          }
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
  }, [params.handle]);

  const profileUrl = typeof window !== 'undefined' ? `https://viszyai.vercel.app/profile/${params.handle}` : `/profile/${params.handle}`;

  const downloadQR = () => {
    if (typeof window === 'undefined') return;
    const svg = document.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-${params.handle}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareQR = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profileData?.name}'s Digital Business Card`,
          text: `Connect with ${profileData?.name} by scanning this QR code`,
          url: profileUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else if (typeof window !== 'undefined') {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(profileUrl);
      alert('Profile URL copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-medium-contrast">Loading your QR code...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-high-contrast mb-2">QR Code Not Available</h1>
          <p className="text-medium-contrast">This profile doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <BackButton 
            fallbackPath="/"
            className="text-medium-contrast hover:text-orange-600 font-medium transition-colors"
          >
            Back
          </BackButton>
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadQR}
              className="flex items-center text-medium-contrast hover:text-orange-600 font-medium transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={shareQR}
              className="flex items-center text-medium-contrast hover:text-orange-600 font-medium transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Profile Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                {profileData?.name?.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {profileData?.name}
            </h1>
            {profileData?.title && (
              <p className="text-medium-contrast mb-2">{profileData.title}</p>
            )}
            <p className="text-sm text-slate-500">
              Scan the QR code below to connect
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100 mb-8">
            <div className="flex justify-center mb-4">
              <QRCode
                value={profileUrl}
                size={256}
                level="H"
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-slate-500">
              Point your camera at this QR code
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center justify-center mb-3">
              <Smartphone className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-900">
                {isOwnProfile ? 'Your QR Code' : 'How to use'}
              </h3>
            </div>
            <div className="text-sm text-orange-800 space-y-2">
              {isOwnProfile ? (
                <>
                  <p>• This is your personal QR code</p>
                  <p>• Share it with people you meet</p>
                  <p>• They can scan it to get your contact info</p>
                  <p>• Track views and scans in your analytics</p>
                </>
              ) : (
                <>
                  <p>1. Show this QR code to someone you meet</p>
                  <p>2. They scan it with their phone camera</p>
                  <p>3. They instantly get all your contact info</p>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            {isOwnProfile ? (
              // Actions for user's own profile
              <>
                <Link
                  href="/dashboard"
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  <Edit className="h-4 w-4 inline mr-2" />
                  Go to Dashboard
                </Link>
                <Link
                  href="/analytics"
                  className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  <BarChart3 className="h-4 w-4 inline mr-2" />
                  View Analytics
                </Link>
                <Link
                  href="/create-profile"
                  className="block w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  <Edit className="h-4 w-4 inline mr-2" />
                  Edit Profile
                </Link>
              </>
            ) : (
              // Actions for other people's profiles
              <>
                <WalletButton 
                  profileData={profileData}
                  profileUrl={profileUrl}
                  className="w-full"
                  variant="primary"
                />
                <Link
                  href={`/profile/${params.handle}`}
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  View Full Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
