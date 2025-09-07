'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Share2, Smartphone, QrCode } from 'lucide-react';
import WalletButton from '@/components/WalletButton';
import QRCode from 'react-qr-code';
import { getProfileWithSocialLinks, trackQRScan } from '@/lib/auth';
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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

          // Track QR scan (location will be automatically detected from IP)
          trackQRScan(profile.id, {
            scanner_user_agent: navigator.userAgent,
            device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          });
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
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center justify-center mb-3">
              <Smartphone className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="font-semibold text-indigo-900">How to use</h3>
            </div>
            <div className="text-sm text-indigo-800 space-y-2">
              <p>1. Show this QR code to someone you meet</p>
              <p>2. They scan it with their phone camera</p>
              <p>3. They instantly get all your contact info</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            {/* Smart Wallet Button for quick contact saving */}
            <WalletButton 
              profileData={profileData}
              profileUrl={profileUrl}
              className="w-full"
              variant="primary"
            />
            
            <Link
              href={`/profile/${params.handle}`}
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              View My Profile
            </Link>
            <Link
              href="/edit"
              className="block w-full border-2 border-indigo-200 text-indigo-700 py-3 rounded-xl font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 text-center"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
