import { cn } from '@/lib/utils';
import { getCategoryConfig } from '@/lib/constants';
import type { PlaceCategory } from '@/types';

interface CategoryBadgeProps {
  category: PlaceCategory;
  className?: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, className, size = 'md' }: CategoryBadgeProps) {
  const config = getCategoryConfig(category);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{ background: `${config.markerColor}25`, color: config.markerColor, border: `1px solid ${config.markerColor}40` }}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
