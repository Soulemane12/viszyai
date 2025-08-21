'use client';

import Link from 'next/link';
import { Sparkles, Smartphone, Users, Zap, ArrowRight, CheckCircle, Shield, QrCode, Download, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-800">Viszy</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Pricing
                </Link>
                <Link 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Digital Business Cards
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> for Everyone</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan. No printing costs, always up-to-date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link 
                  href="/demo" 
                  className="border-2 border-indigo-200 text-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                >
                  See Demo
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-indigo-100">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Always in Your Pocket</h3>
            <p className="text-slate-600 leading-relaxed">Your digital card is always available on your phone. No more forgetting business cards at home.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-indigo-100">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Instant Sharing</h3>
            <p className="text-slate-600 leading-relaxed">Just show your QR code. Anyone can scan it and instantly get all your contact information.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-indigo-100">
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Professional for Everyone</h3>
            <p className="text-slate-600 leading-relaxed">Whether you&apos;re a student, freelancer, or CEO, make a great first impression without the cost.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Create Profile</h3>
              <p className="text-slate-600">Add your info, photo, and social links</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Get QR Code</h3>
              <p className="text-slate-600">Your unique QR code is generated instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Show & Share</h3>
              <p className="text-slate-600">Display your QR code when meeting people</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">They Connect</h3>
              <p className="text-slate-600">They scan and instantly get your info</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-800">Choose Your Plan</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Start free and upgrade when you need more features</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100 relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Free</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-2">$0</div>
                <p className="text-slate-600">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">1 Digital Business Card</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Basic QR Code</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Social Media Links</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Contact Download (.vcf)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Mobile-Optimized Profile</span>
                </li>
              </ul>
              
              <Link 
                href="/signup" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border-2 border-indigo-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-2">$9<span className="text-lg text-slate-600">/month</span></div>
                <p className="text-slate-600">For professionals and teams</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Everything in Free</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Up to 5 Business Cards</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Custom Branded QR Codes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Analytics & Insights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Photo Upload</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Custom Domain</span>
                </li>
              </ul>
              
              <Link 
                href="/signup?plan=pro" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-center block"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100 relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-2">$29<span className="text-lg text-slate-600">/month</span></div>
                <p className="text-slate-600">For large organizations</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Unlimited Business Cards</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Team Management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Advanced Analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">API Access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">White-label Options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-slate-700">Dedicated Support</span>
                </li>
              </ul>
              
              <Link 
                href="/contact" 
                className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-800">Premium Features</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Unlock powerful features to make your digital business card stand out</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 text-center">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Custom QR Codes</h3>
              <p className="text-sm text-slate-600">Brand your QR codes with your logo and colors</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Analytics Dashboard</h3>
              <p className="text-sm text-slate-600">Track profile views, scans, and engagement</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 text-center">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Multiple Profiles</h3>
              <p className="text-sm text-slate-600">Create different cards for different purposes</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 text-center">
              <div className="bg-gradient-to-br from-rose-100 to-red-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800">Priority Support</h3>
              <p className="text-sm text-slate-600">Get help when you need it most</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-r from-slate-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2024 Viszy. Making networking accessible to everyone.</p>
        </div>
      </footer>
    </div>
  );
}
