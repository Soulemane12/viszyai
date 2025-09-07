'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { signUp } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const signUpData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        handle: '', // Will be set during profile creation
        title: '',
        phone: '',
        bio: '',
        socialLinks: []
      };

      const { user, error, needsEmailConfirmation } = await signUp(signUpData);

      if (error) {
        throw error;
      }

      if (needsEmailConfirmation) {
        // Show email confirmation message
        setError('Please check your email to confirm your account. Check your spam folder if you don\'t see it in your inbox.');
        return;
      }

      if (user) {
        // Redirect to profile creation after successful signup
        router.push('/create-profile');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('401')) {
          setError('Authentication error. Please try again.');
        } else if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-medium-contrast hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-bold text-high-contrast">Create Your Account</h1>
                <p className="text-medium-contrast">Sign up to start creating your digital business cards</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-indigo-200/50">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-high-contrast mb-2">Join Viszy</h2>
            <p className="text-medium-contrast">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-lg bg-gray-800 text-high-contrast placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-indigo-200 rounded-lg bg-gray-800 text-high-contrast placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border-2 border-indigo-200 rounded-lg bg-gray-800 text-high-contrast placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-medium-contrast"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters long</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border-2 border-indigo-200 rounded-lg bg-gray-800 text-high-contrast placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-medium-contrast"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'btn-primary-enhanced text-white  shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-medium-contrast">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
