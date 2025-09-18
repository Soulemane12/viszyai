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
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden sm:block text-gray-300 hover:text-orange-400 font-medium transition-colors">
                  Dashboard
                </Link>

                <Link 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-6 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">My Profile</span>
                  <span className="sm:hidden">Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-gray-300 hover:text-orange-400 font-medium transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-6 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-high-contrast mb-4 sm:mb-6 animate-fadeInUp leading-tight">
            Digital Business Cards
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-gradient animate-slideInRight stagger-2 drop-shadow-lg block sm:inline"> for Everyone</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-medium-contrast mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-fadeInUp stagger-2 px-2">
            Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan. No printing costs, always up-to-date.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fadeInUp stagger-3 px-4">
            {user ? (
              <Link 
                href="/dashboard" 
                className="btn-primary-enhanced px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center hover-lift group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link 
                href="/signup" 
                className="btn-primary-enhanced px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover-lift animate-float"
              >
                Create Your Card
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="card-enhanced rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift animate-fadeInUp stagger-4 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover-scale animate-float shadow-lg">
              <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-high-contrast">Always in Your Pocket</h3>
            <p className="text-sm sm:text-base text-medium-contrast leading-relaxed">Your digital card is always available on your phone. No more forgetting business cards at home.</p>
          </div>
          
          <div className="card-enhanced rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift animate-fadeInUp stagger-5 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover-scale animate-float shadow-lg" style={{animationDelay: '0.5s'}}>
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-high-contrast">Instant Sharing</h3>
            <p className="text-sm sm:text-base text-medium-contrast leading-relaxed">Just show your QR code. Anyone can scan it and instantly get all your contact information.</p>
          </div>
          
          <div className="card-enhanced rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift animate-fadeInUp stagger-6 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover-scale animate-float shadow-lg" style={{animationDelay: '1s'}}>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-high-contrast">Professional for Everyone</h3>
            <p className="text-sm sm:text-base text-medium-contrast leading-relaxed">Whether you&apos;re a student, freelancer, or CEO, make a great first impression without the cost.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-high-contrast animate-fadeInUp">How It Works</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center animate-fadeInUp stagger-1">
              <div className="bg-gradient-to-br from-orange-300 to-orange-400 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg hover-scale animate-bounce-slow">
                <span className="text-lg sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-high-contrast">Create Profile</h3>
              <p className="text-xs sm:text-sm text-medium-contrast">Add your info, photo, and social links</p>
            </div>
            <div className="text-center animate-fadeInUp stagger-2">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg hover-scale animate-bounce-slow" style={{animationDelay: '0.5s'}}>
                <span className="text-lg sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-high-contrast">Get QR Code</h3>
              <p className="text-xs sm:text-sm text-medium-contrast">Your unique QR code is generated instantly</p>
            </div>
            <div className="text-center animate-fadeInUp stagger-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg hover-scale animate-bounce-slow" style={{animationDelay: '1s'}}>
                <span className="text-lg sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-high-contrast">Show & Share</h3>
              <p className="text-xs sm:text-sm text-medium-contrast">Display your QR code when meeting people</p>
            </div>
            <div className="text-center animate-fadeInUp stagger-4">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg hover-scale animate-bounce-slow" style={{animationDelay: '1.5s'}}>
                <span className="text-lg sm:text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-high-contrast">They Connect</h3>
              <p className="text-xs sm:text-sm text-medium-contrast">They scan and instantly get your info</p>
            </div>
          </div>
        </div>


      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 bg-gradient-to-r from-gray-800 to-black py-6 sm:py-8 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-medium-contrast">
          <p className="text-sm sm:text-base">&copy; 2025 Viszy. Making networking accessible to everyone.</p>
        </div>
      </footer>
    </div>
  );
}
