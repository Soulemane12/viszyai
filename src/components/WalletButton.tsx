'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download, Plus } from 'lucide-react';
import { getDeviceInfo, addToAppleWallet, downloadVCard } from '@/lib/deviceDetection';

interface WalletButtonProps {
  handle: string;
  variant?: 'primary' | 'secondary' | 'compact';
  className?: string;
}

export default function WalletButton({ handle, variant = 'primary', className = '' }: WalletButtonProps) {
  const [deviceInfo, setDeviceInfo] = useState({
    supportsAppleWallet: false,
    supportsGoogleWallet: false,
    isMobile: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  const handleAddToAppleWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      await addToAppleWallet(handle);
    } catch (error) {
      console.error('Error adding to Apple Wallet:', error);
      setError('Failed to add to Apple Wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadContact = async () => {
    setLoading(true);
    setError('');
    
    try {
      await downloadVCard(handle);
    } catch (error) {
      console.error('Error downloading contact:', error);
      setError('Failed to download contact');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {deviceInfo.supportsAppleWallet && (
          <button
            onClick={handleAddToAppleWallet}
            disabled={loading}
            className="flex items-center space-x-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Add to Apple Wallet"
          >
            <Plus size={16} />
            <Smartphone size={16} />
          </button>
        )}
        
        <button
          onClick={handleDownloadContact}
          disabled={loading}
          className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          title="Download Contact"
        >
          <Download size={16} />
        </button>
        
        {error && (
          <div className="text-red-500 text-xs">{error}</div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Apple Wallet Button */}
      {deviceInfo.supportsAppleWallet && (
        <button
          onClick={handleAddToAppleWallet}
          disabled={loading}
          className={`
            w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg
            transition-all duration-200 disabled:opacity-50
            ${variant === 'primary' 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <Smartphone size={20} />
            <span className="font-medium">Add to Apple Wallet</span>
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          )}
        </button>
      )}

      {/* Google Wallet Button (placeholder for future) */}
      {deviceInfo.supportsGoogleWallet && (
        <button
          disabled
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          <Smartphone size={20} />
          <span className="font-medium">Add to Google Wallet (Coming Soon)</span>
        </button>
      )}

      {/* Fallback: Download vCard */}
      {(!deviceInfo.supportsAppleWallet && !deviceInfo.supportsGoogleWallet) && (
        <button
          onClick={handleDownloadContact}
          disabled={loading}
          className={`
            w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg
            transition-all duration-200 disabled:opacity-50
            ${variant === 'primary' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <Download size={20} />
            <span className="font-medium">Download Contact</span>
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          )}
        </button>
      )}

      {/* Always show download option for iOS/Android users as backup */}
      {(deviceInfo.supportsAppleWallet || deviceInfo.supportsGoogleWallet) && (
        <button
          onClick={handleDownloadContact}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 py-2 px-4 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
        >
          <Download size={16} />
          <span>Download as vCard</span>
        </button>
      )}

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
