// Device detection utilities for wallet functionality

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  supportsAppleWallet: boolean;
  supportsGoogleWallet: boolean;
  browser: string;
}

export function getDeviceInfo(userAgent?: string): DeviceInfo {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(globalThis as { MSStream?: unknown })?.MSStream;
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid || /Mobile|Tablet/.test(ua);
  
  // Apple Wallet is supported on iOS Safari and iOS Chrome
  const supportsAppleWallet = isIOS && (/Safari/.test(ua) || /Chrome/.test(ua));
  
  // Google Wallet is supported on Android Chrome
  const supportsGoogleWallet = isAndroid && /Chrome/.test(ua);
  
  let browser = 'unknown';
  if (/Chrome/.test(ua)) browser = 'chrome';
  else if (/Safari/.test(ua)) browser = 'safari';
  else if (/Firefox/.test(ua)) browser = 'firefox';
  else if (/Edge/.test(ua)) browser = 'edge';
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    supportsAppleWallet,
    supportsGoogleWallet,
    browser
  };
}

export function canAddToWallet(): { apple: boolean; google: boolean } {
  const device = getDeviceInfo();
  
  return {
    apple: device.supportsAppleWallet,
    google: device.supportsGoogleWallet
  };
}

export async function addToAppleWallet(handle: string): Promise<void> {
  try {
    const response = await fetch('/api/wallet/apple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ handle }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate wallet pass');
    }

    // Get the pass file as a blob
    const blob = await response.blob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${handle}-contact.pkpass`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error adding to Apple Wallet:', error);
    throw error;
  }
}

export async function downloadVCard(handle: string): Promise<void> {
  try {
    const response = await fetch('/api/contact/vcard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ handle }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate vCard');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${handle}-contact.vcf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error downloading vCard:', error);
    throw error;
  }
}
