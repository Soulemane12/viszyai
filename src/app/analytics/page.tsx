'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Eye, Smartphone, Globe, BarChart3, Users, MapPin, Clock } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalScans: number;
  uniqueVisitors: number;
  topCountries: Array<{ country: string; views: number }>;
  recentActivity: Array<{ date: string; action: string; location: string }>;
  monthlyViews: Array<{ month: string; views: number }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        totalViews: 1247,
        totalScans: 892,
        uniqueVisitors: 567,
        topCountries: [
          { country: 'United States', views: 456 },
          { country: 'Canada', views: 234 },
          { country: 'United Kingdom', views: 189 },
          { country: 'Germany', views: 156 },
          { country: 'Australia', views: 123 }
        ],
        recentActivity: [
          { date: '2024-01-15', action: 'Profile viewed', location: 'New York, US' },
          { date: '2024-01-15', action: 'QR code scanned', location: 'Toronto, CA' },
          { date: '2024-01-14', action: 'Contact downloaded', location: 'London, UK' },
          { date: '2024-01-14', action: 'Profile viewed', location: 'Berlin, DE' },
          { date: '2024-01-13', action: 'QR code scanned', location: 'Sydney, AU' }
        ],
        monthlyViews: [
          { month: 'Jan', views: 1247 },
          { month: 'Dec', views: 892 },
          { month: 'Nov', views: 756 },
          { month: 'Oct', views: 634 },
          { month: 'Sep', views: 523 },
          { month: 'Aug', views: 412 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
                <p className="text-slate-600">Track your profile performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Pro Plan
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-slate-800">{analytics?.totalViews.toLocaleString()}</p>
                <p className="text-green-600 text-sm font-medium flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">QR Scans</p>
                <p className="text-3xl font-bold text-slate-800">{analytics?.totalScans.toLocaleString()}</p>
                <p className="text-green-600 text-sm font-medium flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Unique Visitors</p>
                <p className="text-3xl font-bold text-slate-800">{analytics?.uniqueVisitors.toLocaleString()}</p>
                <p className="text-green-600 text-sm font-medium flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15% from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Views Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Monthly Views</h3>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {analytics?.monthlyViews.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-12 text-sm text-slate-600">{item.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(item.views / Math.max(...analytics.monthlyViews.map(m => m.views))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-16 text-sm font-medium text-slate-800">{item.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Top Countries</h3>
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {analytics?.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 text-sm font-medium text-slate-600">{index + 1}</span>
                    <span className="ml-3 text-slate-700">{country.country}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-slate-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(country.views / Math.max(...analytics.topCountries.map(c => c.views))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">{country.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {analytics?.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                  <div>
                    <p className="text-slate-800 font-medium">{activity.action}</p>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {activity.location}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Unlock Advanced Analytics</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Get detailed insights, export data, and track engagement with our Pro plan. 
            Upgrade now to access advanced analytics features.
          </p>
          <Link 
            href="/pricing" 
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 inline-block"
          >
            Upgrade to Pro
          </Link>
        </div>
      </main>
    </div>
  );
}
