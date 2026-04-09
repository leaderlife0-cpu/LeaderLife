import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, Grid3X3, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { PlaceCard } from '@/components/places/PlaceCard';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePlaces } from '@/hooks/usePlaces';
import { useGeolocation } from '@/hooks/useGeolocation';
import { CATEGORIES } from '@/lib/constants';
import { parseVoiceIntent } from '@/utils/voiceIntentParser';
import type { PlaceCategory, VoiceIntent } from '@/types';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(q);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | undefined>(
    searchParams.get('category') as PlaceCategory | undefined
  );
  const { getDistanceTo } = useGeolocation();

  const { data: places = [], isLoading } = usePlaces({
    query: q || undefined,
    category: selectedCategory,
    limit: 40,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (query.trim()) p.set('q', query.trim()); else p.delete('q');
    setSearchParams(p);
  };

  const handleVoice = (_text: string, intent: VoiceIntent) => {
    setQuery(_text);
    if (intent.category) setSelectedCategory(intent.category);
    const p = new URLSearchParams();
    p.set('q', _text);
    if (intent.category) p.set('category', intent.category);
    setSearchParams(p);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 mb-6">
          <Search size={18} className="text-white/40 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un lieu, une ville..."
            className="flex-1 bg-transparent py-4 text-white placeholder:text-white/40 text-sm md:text-base focus:outline-none"
          />
          <VoiceMicButton onTranscript={handleVoice} size="md" />
          {query && (
            <button onClick={() => { setQuery(''); setSearchParams({}); }} className="text-white/40 hover:text-white">
              <X size={18} />
            </button>
          )}
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6">
            Chercher
          </Button>
        </form>

        {/* Filters row */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 flex-nowrap">
            {CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(prev => prev === cat.key ? undefined : cat.key)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
                  selectedCategory === cat.key
                    ? 'text-white border'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
                style={selectedCategory === cat.key ? {
                  background: `${cat.markerColor}20`,
                  borderColor: `${cat.markerColor}60`,
                  color: cat.markerColor,
                } : {}}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 ml-auto shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}
            >
              <Grid3X3 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={`rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40'}`}
            >
              <List size={16} />
            </Button>
          </div>
        </div>

        {/* Active filters */}
        {(q || selectedCategory) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {q && (
              <Badge
                className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                onClick={() => { setQuery(''); setSearchParams({}); }}
              >
                "{q}" <X size={10} className="ml-1" />
              </Badge>
            )}
            {selectedCategory && (
              <Badge
                className="bg-white/10 text-white/70 border-white/10 cursor-pointer hover:bg-white/20"
                onClick={() => setSelectedCategory(undefined)}
              >
                {CATEGORIES.find(c => c.key === selectedCategory)?.emoji} {CATEGORIES.find(c => c.key === selectedCategory)?.label} <X size={10} className="ml-1" />
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        {!isLoading && (
          <p className="text-white/50 text-sm mb-6">
            {places.length} résultat{places.length > 1 ? 's' : ''} {q ? `pour "${q}"` : ''}
          </p>
        )}

        {/* Results grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-52 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : places.length === 0 ? (
          <EmptyState
            icon={Search}
            title={`Aucun résultat pour "${q}"`}
            description="Essayez une autre recherche ou explorez par catégorie."
            actionLabel="Explorer"
            onAction={() => navigate('/explore')}
          />
        ) : (
          <motion.div
            className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'flex flex-col gap-3'
            }
          >
            {places.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <PlaceCard
                  place={place}
                  distance={getDistanceTo(place.latitude, place.longitude)}
                  compact={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
