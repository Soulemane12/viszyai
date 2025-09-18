import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/logo.PNG"
        alt="Viszy Logo"
        width={48}
        height={48}
        className={sizeClasses[size]}
        priority
      />
      {showText && (
        <span className={`font-bold text-white ${textSizes[size]}`}>
          Viszy
        </span>
      )}
    </Link>
  );
}
