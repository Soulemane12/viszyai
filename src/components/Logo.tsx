import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

// Custom QR code-like icon component
const QRIcon = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} bg-orange-500 rounded-lg p-1`}>
      <div className="w-full h-full grid grid-cols-2 gap-0.5">
        {/* Top-left quadrant */}
        <div className="bg-orange-500 rounded-sm relative">
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-orange-500 rounded-full"></div>
        </div>
        {/* Top-right quadrant */}
        <div className="bg-orange-500 rounded-sm relative">
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-orange-500 rounded-full"></div>
        </div>
        {/* Bottom-left quadrant */}
        <div className="bg-orange-500 rounded-sm relative">
          <div className="absolute top-0 left-0 w-1 h-1 bg-orange-500 rounded-full"></div>
        </div>
        {/* Bottom-right quadrant */}
        <div className="bg-orange-500 rounded-sm relative">
          <div className="absolute top-0 right-0 w-1 h-1 bg-orange-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <QRIcon size={size} />
      {showText && (
        <span className={`font-bold text-white ${textSizes[size]}`}>
          Viszy
        </span>
      )}
    </Link>
  );
}
