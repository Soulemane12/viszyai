'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-high-contrast">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg mb-6 text-medium-contrast">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
          Redirecting to home page...
        </p>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-all"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
}
