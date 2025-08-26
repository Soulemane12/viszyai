'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, QrCode, Smartphone, Users, Zap } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAuth } from '@/contexts/AuthContext';

export default function DemoPage() {
  const { user } = useAuth();
  
  console.log('Demo page loaded, user:', user);
  
  // Don't redirect logged-in users - let them see the demo
  // useEffect(() => {
  //   if (user) {
  //     router.push('/dashboard');
  //   }
  // }, [user, router]);
  const [showQR, setShowQR] = useState(false);

  const demoProfileUrl = typeof window !== 'undefined' ? `https://viszyai.vercel.app/profile/demo` : '/profile/demo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-slate-600 hover:text-indigo-600 mb-4 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">See How It Works</h1>
        <p className="text-slate-600 mt-2">Experience the magic of digital business cards</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Demo Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left: QR Code */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200/50">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Jane Doe&apos;s QR Code</h2>
                <div className="mb-6">
                  <QRCode
                    value={demoProfileUrl}
                    size={200}
                    level="H"
                    className="mx-auto"
                  />
                </div>
                <p className="text-slate-600 mb-4">
                  Point your phone camera at this QR code
                </p>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {showQR ? 'Hide' : 'Show'} Full Screen
                </button>
              </div>
            </div>

            {/* Right: What happens */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Scan the QR Code</h3>
                    <p className="text-slate-600 text-sm">Use your phone&apos;s camera to scan the QR code above</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">View Profile</h3>
                    <p className="text-slate-600 text-sm">Instantly see Jane&apos;s contact info and social links</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-pink-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Connect</h3>
                    <p className="text-slate-600 text-sm">Call, email, or follow on social media with one tap</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href={demoProfileUrl}
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  Try It Now
                </Link>
              </div>
            </div>
          </div>

                    {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200/50 text-center">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Instant QR Generation</h3>
              <p className="text-slate-600">Create your unique QR code in seconds, no design skills needed.</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200/50 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Always Up-to-Date</h3>
              <p className="text-slate-600">Update your info anytime - no need to reprint or redistribute.</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200/50 text-center">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Professional for Everyone</h3>
              <p className="text-slate-600">Whether you&apos;re a student or CEO, make a great first impression.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of people who&apos;ve ditched paper business cards for good
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </main>

      {/* Full Screen QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Jane Doe&apos;s QR Code</h3>
              <QRCode
                value={demoProfileUrl}
                size={300}
                level="H"
                className="mx-auto mb-4"
              />
              <p className="text-gray-600 mb-4">
                Point your phone camera at this QR code
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
