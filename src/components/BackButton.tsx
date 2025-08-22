'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BackButton({ 
  fallbackPath = '/', 
  className = "inline-flex items-center text-slate-600 hover:text-indigo-600 mb-4 font-medium transition-colors",
  children = "Back"
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to fallback path
      router.push(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {children}
    </button>
  );
}
