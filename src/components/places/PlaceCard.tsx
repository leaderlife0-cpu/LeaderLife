import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, CheckCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';
import { ReviewStars } from '@/components/reviews/ReviewStars';
import { useFavorites } from '@/hooks/useFavorites';
import { PRICE_LABELS } from '@/lib/constants';
import { formatDistance } from '@/utils/distanceCalculator';
import type { Place } from '@/types';

interface PlaceCardProps {
  place: Place;
  distance?: number | null;
  className?: string;
  compact?: boolean;
}

export function PlaceCard({ place, distance, className, compact }: PlaceCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const fav = isFavorite(place.id);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(place.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 500);
  };

  return (
    <motion.div
      className={cn(
        'group relative rounded-[20px] overflow-hidden cursor-pointer',
        'border border-white/8',
        'transition-all duration-300',
        className
      )}
      style={{ background: 'rgba(22, 33, 62, 0.7)' }}
      whileHover={{
        y: -6,
        boxShadow: '0 24px 48px rgba(139,92,246,0.25)',
        borderColor: 'rgba(139,92,246,0.3)',
      }}
      onClick={() => navigate(`/place/${place.id}`)}
    >
      {/* Image */}
      <div className={cn('relative overflow-hidden', compact ? 'h-36' : 'h-48')}>
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(139,92,246,0.08)' }} />
        )}
        <img
          src={place.cover_image_url}
          alt={place.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-107',
            !imgLoaded && 'opacity-0'
          )}
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={place.category} size="sm" />
        </div>

        {/* Verified badge */}
        {place.is_verified && (
          <div className="absolute top-3 right-10 bg-black/40 backdrop-blur-sm rounded-full p-1">
            <CheckCircle size={13} className="text-emerald-400" />
          </div>
        )}

        {/* Favorite button — Instagram style */}
        <button
          className={cn(
            'absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all',
            fav ? 'bg-rose-500/90' : 'bg-black/40 hover:bg-black/60'
          )}
          onClick={handleFav}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            size={14}
            className={cn(
              'transition-all',
              fav ? 'fill-white text-white' : 'text-white',
              heartAnim && 'animate-heart-pop'
            )}
          />
        </button>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-white text-sm leading-tight truncate mb-1">
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-white/45 text-xs mb-2.5">
          <MapPin size={10} className="text-violet-400 shrink-0" />
          <span className="truncate">{place.city}, {place.country}</span>
          {distance !== null && distance !== undefined && (
            <span className="ml-auto shrink-0 text-violet-400 font-medium">
              {formatDistance(distance)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <ReviewStars rating={place.rating} size="sm" showScore reviewCount={place.review_count} />
          <span className="text-white/50 text-xs font-semibold">
            {PRICE_LABELS[place.price_level]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
