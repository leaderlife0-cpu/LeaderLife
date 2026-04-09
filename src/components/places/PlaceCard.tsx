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
  const fav = isFavorite(place.id);

  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl overflow-hidden cursor-pointer',
        'bg-white/5 border border-white/10 backdrop-blur-sm',
        'transition-all duration-300',
        className
      )}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(33,150,243,0.15)' }}
      onClick={() => navigate(`/place/${place.id}`)}
    >
      {/* Image */}
      <div className={cn('relative overflow-hidden', compact ? 'h-36' : 'h-48')}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        <img
          src={place.cover_image_url}
          alt={place.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
            !imgLoaded && 'opacity-0'
          )}
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={place.category} size="sm" />
        </div>

        {/* Verified badge */}
        {place.is_verified && (
          <div className="absolute top-3 right-10 bg-black/50 backdrop-blur-sm rounded-full p-1">
            <CheckCircle size={14} className="text-green-400" />
          </div>
        )}

        {/* Favorite button */}
        <button
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all',
            fav ? 'bg-red-500/80' : 'bg-black/40 hover:bg-black/60'
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={14} className={fav ? 'fill-white text-white' : 'text-white'} />
        </button>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm leading-tight truncate mb-1">
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-white/50 text-xs mb-2">
          <MapPin size={10} />
          <span className="truncate">{place.city}, {place.country}</span>
          {distance !== null && distance !== undefined && (
            <span className="ml-auto shrink-0 text-blue-400">
              {formatDistance(distance)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <ReviewStars rating={place.rating} size="sm" showScore reviewCount={place.review_count} />
          <span className="text-white/60 text-xs font-medium">
            {PRICE_LABELS[place.price_level]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
