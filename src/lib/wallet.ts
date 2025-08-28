// Mobile Wallet Integration Utilities
// Free alternatives to Apple Wallet and Google Wallet

export interface ContactData {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profileUrl?: string;
  avatarUrl?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

// Device detection utilities
export const detectDevice = () => {
  if (typeof window === 'undefined') return { isIOS: false, isAndroid: false, isMobile: false };
  
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMobile = /Mobi|Android/i.test(userAgent);
  
  return { isIOS, isAndroid, isMobile };
};

// Enhanced vCard generation with better iOS compatibility
export const generateEnhancedVCard = (contact: ContactData): string => {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.name}`,
    `N:${contact.name.split(' ').reverse().join(';')}`,
    contact.title ? `TITLE:${contact.title}` : '',
    contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : '',
    contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : '',
    contact.bio ? `NOTE:${contact.bio}` : '',
    contact.profileUrl ? `URL:${contact.profileUrl}` : '',
    // Add social media as URLs for iOS compatibility
    ...(contact.socialLinks?.map(link => `URL;TYPE=${link.platform}:${link.url}`) || []),
    // Add organization info for business cards
    contact.title ? `ORG:Viszy Digital Business Card` : '',
    // Add categories for better organization
    'CATEGORIES:Business,Contact',
    // Add revision date
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(Boolean).join('\r\n');
  
  return vcard;
};

// iOS Contact Integration - Works without Apple Developer Account
export const addToIOSContacts = (contact: ContactData) => {
  const vcard = generateEnhancedVCard(contact);
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  
  // Create download link that iOS will recognize as a contact file
  const link = document.createElement('a');
  link.href = url;
  link.download = `${contact.name.toLowerCase().replace(/\s+/g, '-')}.vcf`;
  
  // For iOS Safari, we need to trigger the download differently
  const { isIOS } = detectDevice();
  
  if (isIOS) {
    // iOS Safari will show "Add to Contacts" when opening a vCard file
    window.open(url, '_blank');
  } else {
    // Standard download for other browsers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Progressive Web App features for iOS
export const canInstallPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const { isIOS, isAndroid } = detectDevice();
  
  // Check if PWA is supported
  if (isIOS) {
    // iOS supports PWA via Safari
    return 'serviceWorker' in navigator && window.matchMedia('(display-mode: browser)').matches;
  }
  
  if (isAndroid) {
    // Android supports PWA installation
    return 'serviceWorker' in navigator;
  }
  
  return false;
};

// Show iOS installation instructions
export const showIOSInstallInstructions = () => {
  const instructions = `
To add this to your home screen:
1. Tap the Share button (⬆️) at the bottom of your screen
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" in the top-right corner
  `;
  
  // Create a modal or alert with instructions
  alert(instructions);
};

// Google Wallet alternative - Web Share API
export const shareToAndroidWallet = async (contact: ContactData) => {
  const { isAndroid } = detectDevice();
  
  if (!isAndroid || !navigator.share) {
    // Fallback to vCard download
    addToIOSContacts(contact);
    return;
  }
  
  try {
    // Create vCard for sharing
    const vcard = generateEnhancedVCard(contact);
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const file = new File([blob], `${contact.name}.vcf`, { type: 'text/vcard' });
    
    // Use Web Share API to share the contact file
    await navigator.share({
      title: `${contact.name}'s Contact`,
      text: `Add ${contact.name} to your contacts`,
      files: [file]
    });
  } catch (error) {
    console.log('Error sharing contact:', error);
    // Fallback to regular vCard download
    addToIOSContacts(contact);
  }
};

// Smart wallet button - shows appropriate option based on device
export const getWalletAction = (contact: ContactData) => {
  const { isIOS, isAndroid, isMobile } = detectDevice();
  
  if (isIOS) {
    return {
      label: '📱 Add to Contacts',
      icon: '📱',
      action: () => addToIOSContacts(contact),
      description: 'Add to iPhone Contacts'
    };
  }
  
  if (isAndroid) {
    return {
      label: '📱 Save Contact',
      icon: '📱',
      action: () => shareToAndroidWallet(contact),
      description: 'Save to Android Contacts'
    };
  }
  
  if (isMobile) {
    return {
      label: '📱 Download Contact',
      icon: '📱',
      action: () => addToIOSContacts(contact),
      description: 'Download contact file'
    };
  }
  
  return {
    label: '💾 Download vCard',
    icon: '💾',
    action: () => addToIOSContacts(contact),
    description: 'Download contact file'
  };
};

// Create contact object from profile data
export const createContactFromProfile = (profileData: {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  bio?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}, profileUrl?: string): ContactData => {
  return {
    name: profileData.name || 'Unknown',
    title: profileData.title,
    email: profileData.email,
    phone: profileData.phone,
    bio: profileData.bio,
    profileUrl: profileUrl,
    socialLinks: profileData.socialLinks || []
  };
};
