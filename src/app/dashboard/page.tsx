'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Edit, Settings, LogOut, User, Mail, Phone, BarChart3 } from 'lucide-react';
import QRCode from 'react-qr-code';
import BackButton from '@/components/BackButton';
import Logo from '@/components/Logo';

export default function DashboardPage() {
  const { user, profile, loading, profileLoading, signOut } = useAuth();
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Handle responsive QR code sizing
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Immediate redirect if no user and not loading
  useEffect(() => {
    if (!loading && !user) {
      console.log('Dashboard: No user detected, immediate redirect to login');
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    console.log('Dashboard useEffect triggered:', { user, profile, loading });
    
    // Only redirect after loading is complete
    if (!loading) {
      if (!user) {
        console.log('No user, redirecting to login');
        router.replace('/login'); // Use replace to prevent back button issues
        return;
      }
      // Don't redirect if user has no profile - let them see the dashboard
      // and choose to create a profile from there
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    console.log('Dashboard current state:', { user, profile, loading });
  }, [user, profile, loading]);

  // Additional debugging effect
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Dashboard status check:', {
        user: user ? 'Present' : 'Null',
        profile: profile ? 'Present' : 'Null',
        loading,
        timestamp: new Date().toISOString()
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [user, profile, loading]);

  // Show loading state only while checking authentication (not profile loading)
  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-readable">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if user is not authenticated
  if (!user) {
    console.log('Dashboard: No user, not rendering dashboard (redirect should happen)');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-readable">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      console.log('Sign out button clicked');
      await signOut();
      console.log('Sign out completed, redirecting to home');
      router.replace('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-gradient">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700 glass-dark animate-slideInLeft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <BackButton 
                fallbackPath="/"
                className="text-medium-contrast hover:text-orange-400 transition-colors"
              >
                <span className="hidden sm:inline">Back</span>
              </BackButton>
              <Logo size="sm" />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-high-contrast">Welcome, {profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}</span>
                {user && !profile && (
                  <div className="flex items-center space-x-1 text-subtle">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-orange-400"></div>
                    <span className="text-xs">Loading profile...</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 sm:space-x-2 text-medium-contrast hover:text-orange-400 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                type="button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="card-enhanced rounded-2xl p-4 sm:p-6 hover-lift animate-fadeInUp stagger-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-high-contrast">Your Profile</h2>
                {profileLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                )}
              </div>
              <Link
                href="/create-profile"
                className="flex items-center justify-center space-x-1 sm:space-x-2 bg-orange-100 text-orange-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors w-full sm:w-auto"
              >
                <Edit size={16} />
                <span className="text-sm sm:text-base">{profile ? 'Edit' : 'Create'}</span>
              </Link>
            </div>

            {profileLoading && !profile ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-readable">Loading profile...</p>
              </div>
            ) : profile ? (
              <div className="space-y-4">
                {/* Profile Photo and Name */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.photo_url ? (
                      <Image
                        src={profile.photo_url}
                        alt={profile.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-orange-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-high-contrast">{profile.name}</p>
                    {profile.title && (
                      <p className="text-medium-contrast text-sm">{profile.title}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-orange-400" size={20} />
                  <p className="text-medium-contrast">{profile.email}</p>
                </div>

                {profile.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="text-orange-400" size={20} />
                    <p className="text-medium-contrast">{profile.phone}</p>
                  </div>
                )}

                {profile.bio && (
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-medium-contrast">{profile.bio}</p>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm text-subtle mb-2">Your profile URL:</p>
                  <p className="font-mono text-orange-400 bg-orange-50 px-3 py-1 rounded-lg inline-block text-xs sm:text-sm break-all">
                    https://viszyai.vercel.app/profile/{profile.handle}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-readable mb-4">No profile found</p>
                <Link
                  href="/create-profile"
                  className="btn-primary-enhanced px-6 py-2 rounded-lg transition-colors"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* QR Code Card */}
          <div className="card-enhanced rounded-2xl p-4 sm:p-6 hover-lift animate-fadeInUp stagger-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-high-contrast">Your QR Code</h2>
              <div className="flex items-center space-x-2">
                <Logo size="sm" />
                <span className="text-orange-500 font-bold text-sm sm:text-base">Viszy</span>
              </div>
            </div>

            {profile ? (
              <div className="text-center">
                <div className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-orange-200 rounded-3xl p-4 sm:p-6 lg:p-8 inline-block mb-4 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-105 animate-float qr-glow">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-3xl opacity-15 blur-sm animate-pulse"></div>
                  
                  {/* QR Code container with rounded corners */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 flex items-center justify-center bg-white rounded-2xl p-3 shadow-inner qr-pulse">
                    <QRCode
                      value={`https://viszyai.vercel.app/profile/${profile.handle}`}
                      size={isSmallScreen ? 112 : 160}
                      level="H"
                      className="max-w-full max-h-full rounded-xl"
                      fgColor="#f97316"
                      bgColor="#ffffff"
                    />
                  </div>
                  
                  {/* Brand watermark */}
                  <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-60">
                    <Logo size="sm" showText={false} />
                    <span className="text-orange-600 font-bold text-xs">Viszy</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-medium-contrast text-xs sm:text-sm lg:text-base">
                    Share this QR code to let people access your digital business card
                  </p>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link
                      href={`/qr/${profile.handle}`}
                      className="flex-1 btn-primary-enhanced py-2 px-4 rounded-lg text-sm sm:text-base"
                    >
                      View QR Code
                    </Link>
                    <Link
                      href={`/profile/${profile.handle}`}
                      className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-2 px-4 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-colors text-sm sm:text-base"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-readable mb-4">Create a profile to generate your QR code</p>
                <Link
                  href="/create-profile"
                  className="btn-primary-enhanced px-6 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 card-enhanced rounded-2xl p-4 sm:p-6 hover-lift animate-fadeInUp stagger-3">
          <h3 className="text-lg sm:text-xl font-bold text-high-contrast mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {!profile && (
              <Link
                href="/create-profile"
                className="btn-primary-enhanced flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg transition-all duration-300 hover-scale"
              >
                <User className="text-white" size={18} />
                <div>
                  <p className="font-semibold text-white text-sm sm:text-base">Create Profile</p>
                  <p className="text-white/80 text-xs sm:text-sm">Set up your digital card</p>
                </div>
              </Link>
            )}

            <Link
              href="/analytics"
              className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 hover-scale hover-glow text-white border border-gray-600 shadow-lg"
            >
              <BarChart3 className="text-orange-400" size={18} />
              <div>
                <p className="font-semibold text-white text-sm sm:text-base">Analytics</p>
                <p className="text-medium-contrast text-xs sm:text-sm">Track your performance</p>
              </div>
            </Link>
            

            
            <Link
              href="/settings"
              className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 hover-scale hover-glow text-white border border-gray-600 shadow-lg"
            >
              <Settings className="text-orange-400" size={18} />
              <div>
                <p className="font-semibold text-white text-sm sm:text-base">Settings</p>
                <p className="text-medium-contrast text-xs sm:text-sm">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
