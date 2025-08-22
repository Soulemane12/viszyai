'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { QrCode, Edit, Settings, LogOut, User, Mail, Phone, BarChart3, Star } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  // Immediate redirect if no user and not loading
  useEffect(() => {
    if (!loading && !user) {
      console.log('Dashboard: No user detected, immediate redirect to login');
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    console.log('Dashboard useEffect triggered:', { user, loading });
    
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
  }, [user, loading, router]);

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

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    console.log('Dashboard: Still loading, showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if user is not authenticated
  if (!user) {
    console.log('Dashboard: No user, not rendering dashboard (redirect should happen)');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BackButton 
                fallbackPath="/"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Back
              </BackButton>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Viszy
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">Welcome, {profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
              <Link
                href="/create-profile"
                className="flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Edit size={16} />
                <span>{profile ? 'Edit' : 'Create'}</span>
              </Link>
            </div>

            {profile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-slate-400" size={20} />
                  <div>
                    <p className="font-semibold text-slate-800">{profile.name}</p>
                    {profile.title && (
                      <p className="text-slate-600 text-sm">{profile.title}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-slate-400" size={20} />
                  <p className="text-slate-700">{profile.email}</p>
                </div>

                {profile.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="text-slate-400" size={20} />
                    <p className="text-slate-700">{profile.phone}</p>
                  </div>
                )}

                {profile.bio && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-700">{profile.bio}</p>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm text-slate-500 mb-2">Your handle:</p>
                  <p className="font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                    {profile.handle}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">No profile found</p>
                <Link
                  href="/create-profile"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Your QR Code</h2>
              <QrCode className="text-indigo-600" size={24} />
            </div>

            {profile ? (
              <div className="text-center">
                <div className="bg-white border-2 border-indigo-200 rounded-lg p-4 inline-block mb-4">
                  <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500 text-sm">QR Code will be generated here</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Share this QR code to let people access your digital business card
                  </p>
                  
                  <div className="flex space-x-3">
                    <Link
                      href={`/qr/${profile.handle}`}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      View QR Code
                    </Link>
                    <Link
                      href={`/profile/${profile.handle}`}
                      className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">Create a profile to generate your QR code</p>
                <Link
                  href="/create-profile"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!profile && (
              <Link
                href="/create-profile"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border-2 border-green-200"
              >
                <User className="text-green-600" size={20} />
                <div>
                  <p className="font-semibold text-slate-800">Create Profile</p>
                  <p className="text-slate-600 text-sm">Set up your digital card</p>
                </div>
              </Link>
            )}
            <Link
              href="/demo"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
            >
              <QrCode className="text-indigo-600" size={20} />
              <div>
                <p className="font-semibold text-slate-800">See Demo</p>
                <p className="text-slate-600 text-sm">View how it works</p>
              </div>
            </Link>
            
            <Link
              href="/analytics"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
            >
              <BarChart3 className="text-indigo-600" size={20} />
              <div>
                <p className="font-semibold text-slate-800">Analytics</p>
                <p className="text-slate-600 text-sm">Track your performance</p>
              </div>
            </Link>
            
            <Link
              href="/pricing"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
            >
              <Star className="text-indigo-600" size={20} />
              <div>
                <p className="font-semibold text-slate-800">Upgrade</p>
                <p className="text-slate-600 text-sm">Get premium features</p>
              </div>
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
            >
              <Settings className="text-indigo-600" size={20} />
              <div>
                <p className="font-semibold text-slate-800">Settings</p>
                <p className="text-slate-600 text-sm">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
