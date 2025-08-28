'use client';

import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { getWalletAction, createContactFromProfile, detectDevice } from '@/lib/wallet';

interface ProfileData {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  bio?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

interface WalletButtonProps {
  profileData: ProfileData;
  profileUrl?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact';
}

export default function WalletButton({ 
  profileData, 
  profileUrl, 
  className = '',
  variant = 'primary'
}: WalletButtonProps) {
  const [walletAction, setWalletAction] = useState<{
    label: string;
    icon: string;
    action: () => void | Promise<void>;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState({ isIOS: false, isAndroid: false, isMobile: false });

  useEffect(() => {
    // Detect device and set up wallet action
    const deviceInfo = detectDevice();
    setDevice(deviceInfo);
    
    if (profileData) {
      const contact = createContactFromProfile(profileData, profileUrl);
      const action = getWalletAction(contact);
      setWalletAction(action);
    }
  }, [profileData, profileUrl]);

  const handleWalletAction = async () => {
    if (!walletAction || !profileData) return;
    
    setIsLoading(true);
    try {
      await walletAction.action();
      
      // Show success message based on device
      if (device.isIOS) {
        setTimeout(() => {
          const showPWAHint = !window.matchMedia('(display-mode: standalone)').matches;
          const message = showPWAHint 
            ? 'Contact file ready! Tap to add to your iPhone contacts.\n\n💡 Tip: Add Viszy to your home screen for quick access - tap Share ⬆️ then "Add to Home Screen"'
            : 'Contact file ready! Tap to add to your iPhone contacts.';
          alert(message);
        }, 500);
      } else if (device.isAndroid) {
        // Android will handle the sharing flow
      } else {
        alert('Contact file downloaded successfully!');
      }
    } catch (error) {
      console.error('Error with wallet action:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletAction) return null;

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <button
        onClick={handleWalletAction}
        disabled={isLoading}
        className={`inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          device.isIOS 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
            : device.isAndroid
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
        title={walletAction.description}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Smartphone size={16} />
        )}
        <span className="hidden sm:inline">{walletAction.label}</span>
        <span className="sm:hidden">{walletAction.icon}</span>
      </button>
    );
  }

  // Secondary variant
  if (variant === 'secondary') {
    return (
      <button
        onClick={handleWalletAction}
        disabled={isLoading}
        className={`inline-flex items-center space-x-2 px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
          device.isIOS 
            ? 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300' 
            : device.isAndroid
            ? 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
            : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
        title={walletAction.description}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Smartphone size={20} />
        )}
        <span>{walletAction.label}</span>
      </button>
    );
  }

  // Primary variant (default)
  return (
    <button
      onClick={handleWalletAction}
      disabled={isLoading}
      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
        device.isIOS 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-200' 
          : device.isAndroid
          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-200'
          : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'} ${className}`}
      title={walletAction.description}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Smartphone size={20} />
      )}
      <span>{walletAction.label}</span>
    </button>
  );
}
