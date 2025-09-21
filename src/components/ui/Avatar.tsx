import { forwardRef, useState } from 'react';
import { cn } from '@/utils';
import { BaseComponentProps } from '@/types';

interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  onClick?: () => void;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt = 'Avatar', 
    fallback, 
    size = 'md', 
    status,
    onClick,
    ...props 
  }, ref) => {
    const [imageError, setImageError] = useState(false);
    const shouldShowImage = src && !imageError;

    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    };

    const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    };

    const statusSizeClasses = {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const avatarContent = () => {
      if (shouldShowImage) {
        return (
          <img
            src={src}
            alt={alt}
            className="h-full w-full rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        );
      }

      const initials = fallback ? getInitials(fallback) : '?';
      return (
        <span className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-primary-600 text-white font-medium',
          textSizeClasses[size]
        )}>
          {initials}
        </span>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block',
          sizeClasses[size],
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {avatarContent()}
        
        {status && (
          <span className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
            statusClasses[status],
            statusSizeClasses[size]
          )} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
