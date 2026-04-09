import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Icon size={36} className="text-white/30" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-white/50 text-sm max-w-xs mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
