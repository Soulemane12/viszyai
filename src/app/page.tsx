'use client';

import Link from 'next/link';
import { Smartphone, Users, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
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
                  Create Your Card
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
