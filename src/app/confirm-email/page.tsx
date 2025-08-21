'use client';

import { Suspense, useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid confirmation link. Please check your email.');
          return;
        }

        // Verify the email confirmation
        const { error } = await supabase.auth.exchangeCodeForSession(token);

        if (error) {
          setStatus('error');
          setMessage(`Email confirmation failed: ${error.message}`);
          return;
        }

        // Email confirmed successfully
        setStatus('success');
        setMessage('Email confirmed successfully! Redirecting to dashboard...');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/create-profile');
        }, 2000);

      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          {status === 'loading' && <Mail className="w-16 h-16 text-indigo-600 animate-pulse" />}
          {status === 'success' && <CheckCircle className="w-16 h-16 text-green-600" />}
          {status === 'error' && <AlertTriangle className="w-16 h-16 text-red-600" />}
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          {status === 'loading' && 'Confirming Email'}
          {status === 'success' && 'Email Confirmed'}
          {status === 'error' && 'Confirmation Error'}
        </h1>
        
        <p className={`text-lg mb-6 ${
          status === 'success' ? 'text-green-700' : 
          status === 'error' ? 'text-red-700' : 
          'text-slate-600'
        }`}>
          {message}
        </p>
        
        {status === 'error' && (
          <button 
            onClick={() => router.push('/signup')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Back to Signup
          </button>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <Mail className="w-16 h-16 text-indigo-600 animate-pulse" />
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}
