import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  reviewCount?: number;
  className?: string;
}

export function ReviewStars({ rating, size = 'md', showScore = false, reviewCount, className }: ReviewStarsProps) {
  const sizes = { sm: 12, md: 16, lg: 20 };
  const px = sizes[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <Star
            key={i}
            size={px}
            className={cn(
              filled || half ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-600 text-gray-600'
            )}
            strokeWidth={1}
          />
        );
      })}
      {showScore && (
        <span className={cn('font-semibold text-white', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn('text-white/50', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({reviewCount.toLocaleString('fr-FR')})
        </span>
      )}
    </div>
  );
}
