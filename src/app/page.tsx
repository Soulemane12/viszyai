'use client';

import Link from 'next/link';
import { Smartphone, Users, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-orange-400 font-medium transition-colors">
                  Dashboard
                </Link>

                <Link 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-orange-400 font-medium transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fadeInUp">
            Digital Business Cards
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-gradient animate-slideInRight stagger-2"> for Everyone</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fadeInUp stagger-2">
            Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan. No printing costs, always up-to-date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp stagger-3">
            {user ? (
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center hover-lift hover-glow-orange group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift hover-glow-orange animate-float"
              >
                Create Your Card
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-700 hover-lift hover-glow-orange animate-fadeInUp stagger-4 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-scale animate-float">
              <Smartphone className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Always in Your Pocket</h3>
            <p className="text-gray-300 leading-relaxed">Your digital card is always available on your phone. No more forgetting business cards at home.</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-700 hover-lift hover-glow-orange animate-fadeInUp stagger-5 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-scale animate-float" style={{animationDelay: '0.5s'}}>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Instant Sharing</h3>
            <p className="text-gray-300 leading-relaxed">Just show your QR code. Anyone can scan it and instantly get all your contact information.</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-700 hover-lift hover-glow-orange animate-fadeInUp stagger-6 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-scale animate-float" style={{animationDelay: '1s'}}>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Professional for Everyone</h3>
            <p className="text-gray-300 leading-relaxed">Whether you&apos;re a student, freelancer, or CEO, make a great first impression without the cost.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white animate-fadeInUp">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-fadeInUp stagger-1">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover-scale animate-bounce-slow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Create Profile</h3>
              <p className="text-gray-300">Add your info, photo, and social links</p>
            </div>
            <div className="text-center animate-fadeInUp stagger-2">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover-scale animate-bounce-slow" style={{animationDelay: '0.5s'}}>
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Get QR Code</h3>
              <p className="text-gray-300">Your unique QR code is generated instantly</p>
            </div>
            <div className="text-center animate-fadeInUp stagger-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover-scale animate-bounce-slow" style={{animationDelay: '1s'}}>
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Show & Share</h3>
              <p className="text-gray-300">Display your QR code when meeting people</p>
            </div>
            <div className="text-center animate-fadeInUp stagger-4">
              <div className="bg-gradient-to-br from-black to-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover-scale animate-bounce-slow" style={{animationDelay: '1.5s'}}>
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">They Connect</h3>
              <p className="text-gray-300">They scan and instantly get your info</p>
            </div>
          </div>
        </div>


      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-r from-gray-800 to-black py-8 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p>&copy; 2025 Viszy. Making networking accessible to everyone.</p>
        </div>
      </footer>
    </div>
  );
}
