'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, Smartphone, Globe, BarChart3, Users, MapPin, Clock } from 'lucide-react';
import { getAnalytics } from '@/lib/auth';
import BackButton from '@/components/BackButton';
import Logo from '@/components/Logo';

interface AnalyticsData {
  totalViews: number;
  totalScans: number;
  uniqueVisitors: number;
  topCountries: Array<{ country: string; views: number }>;
  recentActivity: Array<{ date: string; action: string; location: string }>;
  monthlyViews: Array<{ month: string; views: number }>;
}

export default function AnalyticsPage() {
  const { user, profile, loading: authLoading, profileLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Don't load analytics until auth and profile loading are complete
    if (authLoading || profileLoading) {
      return;
    }

    const loadAnalytics = async () => {
      try {
        if (profile?.handle) {
          console.log('Loading analytics for profile:', profile.handle);
          const analyticsData = await getAnalytics(profile.handle);
          
          console.log('Analytics data received:', analyticsData);
          
          // Transform the data to match our interface
          const transformedData: AnalyticsData = {
            totalViews: analyticsData.totalViews,
            totalScans: analyticsData.totalScans,
            uniqueVisitors: analyticsData.uniqueVisitors,
            topCountries: analyticsData.topCountries || [],
            recentActivity: analyticsData.recentActivity || [],
            monthlyViews: analyticsData.monthlyViews || []
          };
          
          console.log('Transformed analytics data:', transformedData);
          setAnalytics(transformedData);
        } else {
          console.log('No profile found, showing empty analytics');
          // Show empty analytics when no profile exists
          setAnalytics({
            totalViews: 0,
            totalScans: 0,
            uniqueVisitors: 0,
            topCountries: [],
            recentActivity: [],
            monthlyViews: []
          });
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Show empty analytics on error
        setAnalytics({
          totalViews: 0,
          totalScans: 0,
          uniqueVisitors: 0,
          topCountries: [],
          recentActivity: [],
          monthlyViews: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-medium-contrast">
            {authLoading ? 'Loading...' : 'Loading analytics...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <BackButton 
                  fallbackPath="/dashboard"
                  className="text-medium-contrast hover:text-orange-600 transition-colors"
                >
                  Back
                </BackButton>
                <Logo size="sm" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-high-contrast">Analytics</h1>
                  <p className="text-medium-contrast text-sm sm:text-base">Track your profile performance</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <BarChart3 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-high-contrast mb-4">
                {profileLoading ? 'Loading Profile...' : 'No Profile Yet'}
              </h2>
              <p className="text-medium-contrast mb-6">
                {profileLoading 
                  ? 'Please wait while we load your profile data...'
                  : 'Create your profile to start tracking analytics and see how people interact with your digital business card.'
                }
              </p>
              {!profileLoading && (
                <Link
                  href="/create-profile"
                  className="bg-gradient-to-r btn-primary-enhanced text-white px-6 py-3 rounded-lg  transition-all duration-200"
                >
                  Create Profile
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BackButton 
                fallbackPath="/dashboard"
                className="text-medium-contrast hover:text-orange-600 transition-colors"
              >
                Back
              </BackButton>
              <Logo size="sm" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-high-contrast">Analytics</h1>
                <p className="text-medium-contrast text-sm sm:text-base">Track your profile performance</p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-medium-contrast text-xs sm:text-sm font-medium">Total Views</p>
                <p className="text-2xl sm:text-3xl font-bold text-high-contrast">{analytics?.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-medium-contrast text-xs sm:text-sm font-medium">QR Scans</p>
                <p className="text-2xl sm:text-3xl font-bold text-high-contrast">{analytics?.totalScans.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-medium-contrast text-xs sm:text-sm font-medium">Unique Visitors</p>
                <p className="text-2xl sm:text-3xl font-bold text-high-contrast">{analytics?.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Monthly Views Chart */}
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-200/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-high-contrast">Monthly Views</h3>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {analytics?.monthlyViews && analytics.monthlyViews.length > 0 ? (
                analytics.monthlyViews.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-12 text-sm text-medium-contrast">{item.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                          style={{ width: `${(item.views / Math.max(...analytics.monthlyViews.map(m => m.views))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="w-16 text-sm font-medium text-high-contrast">{item.views}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No monthly data available yet</p>
                  <p className="text-slate-400 text-sm">Monthly trends will appear here once you have profile views</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-200/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-high-contrast">Top Countries</h3>
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {analytics?.topCountries && analytics.topCountries.length > 0 ? (
                analytics.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 text-sm font-medium text-medium-contrast">{index + 1}</span>
                      <span className="ml-3 text-slate-700">{country.country}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 bg-slate-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                          style={{ width: `${(country.views / Math.max(...analytics.topCountries.map(c => c.views))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-high-contrast">{country.views}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No location data available yet</p>
                  <p className="text-slate-400 text-sm">Location tracking will appear here once visitors access your profile</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-indigo-200/50">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-high-contrast">Recent Activity</h3>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    <div>
                      <p className="text-high-contrast font-medium">{activity.action}</p>
                      <div className="flex items-center text-sm text-medium-contrast">
                        <MapPin className="h-4 w-4 mr-1" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{activity.date}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent activity</p>
                <p className="text-slate-400 text-sm">Activity will appear here once people interact with your profile</p>
              </div>
            )}
          </div>
        </div>


      </main>
    </div>
  );
}
