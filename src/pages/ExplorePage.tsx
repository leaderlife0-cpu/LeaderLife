import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { PlaceCard } from '@/components/places/PlaceCard';
import { Navbar } from '@/components/layout/Navbar';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReviewStars } from '@/components/reviews/ReviewStars';
import { CategoryBadge } from '@/components/places/CategoryBadge';
import { CATEGORIES, PRICE_LABELS, getCategoryConfig } from '@/lib/constants';
import { usePlaces } from '@/hooks/usePlaces';
import { useGeolocation } from '@/hooks/useGeolocation';
import { formatPrice } from '@/utils/currencyConverter';
import { parseVoiceIntent } from '@/utils/voiceIntentParser';
import type { Place, PlaceCategory, VoiceIntent } from '@/types';

// CartoDB Dark Matter tile layer
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function createPlaceIcon(emoji: string, color: string, selected: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;cursor:pointer;
      background:${selected ? color : color + 'CC'};
      border:2px solid ${color};
      box-shadow:0 2px 10px rgba(0,0,0,0.6);
      transition:transform 0.15s;
    ">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
}

const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
    <div class="ll-user-ping" style="position:absolute;inset:0;background:#3B82F630;border-radius:50%;"></div>
    <div style="width:14px;height:14px;background:#3B82F6;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5);position:relative;z-index:1;"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Re-centers map when center prop changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevCenter = useRef<[number, number]>(center);
  useEffect(() => {
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]) {
      map.setView(center, zoom, { animate: true });
      prevCenter.current = center;
    }
  }, [center, zoom, map]);
  return null;
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>(
    searchParams.get('category') ? [searchParams.get('category') as PlaceCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState(4);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price_asc' | 'price_desc'>('relevance');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const city = searchParams.get('city') ?? undefined;
  const { latitude, longitude, getDistanceTo, refresh: refreshGeo } = useGeolocation();

  const { data: places = [], isLoading } = usePlaces({
    query: query || undefined,
    city,
    category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    price_level: maxPrice,
    min_rating: minRating || undefined,
    sort_by: sortBy === 'relevance' ? undefined : sortBy,
    limit: 50,
  });

  const toggleCategory = (cat: PlaceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (query) p.set('q', query); else p.delete('q');
    setSearchParams(p);
  };

  const handleVoice = useCallback((_text: string, intent: VoiceIntent) => {
    setQuery(_text);
    if (intent.category) setSelectedCategories([intent.category]);
    if (intent.city) {
      const p = new URLSearchParams(searchParams);
      p.set('city', intent.city);
      setSearchParams(p);
    }
    if (intent.useGeolocation) refreshGeo();
  }, [searchParams, setSearchParams, refreshGeo]);

  const filteredPlaces = places.filter(p => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (p.rating < minRating) return false;
    if (p.price_level > maxPrice) return false;
    return true;
  });

  const mapCenter: [number, number] = filteredPlaces.length > 0
    ? [filteredPlaces[0].latitude, filteredPlaces[0].longitude]
    : [latitude ?? 5.354, longitude ?? -4.008];

  return (
    <div className="h-screen bg-[#0A0A0F] flex flex-col overflow-hidden">
      <Navbar />
      <ChatAssistant />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <div className={`
          flex flex-col bg-[#12121A] border-r border-white/10 overflow-hidden
          ${showMap ? 'hidden md:flex w-[380px] shrink-0' : 'flex flex-1'}
        `}>
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3">
              <Search size={16} className="text-white/40 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <VoiceMicButton onTranscript={handleVoice} size="sm" />
              {query && (
                <button onClick={() => setQuery('')} className="text-white/40 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all ${
                    selectedCategories.includes(cat.key)
                      ? 'text-white border'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                  style={selectedCategories.includes(cat.key) ? {
                    background: `${cat.markerColor}20`,
                    borderColor: `${cat.markerColor}60`,
                    color: cat.markerColor,
                  } : {}}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className="flex items-center gap-2 text-white/50 hover:text-white text-xs mt-3"
            >
              <SlidersHorizontal size={12} />
              Filtres avancés
              <ChevronDown size={12} className={showFilters ? 'rotate-180' : ''} />
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-4">
                    <div>
                      <label className="text-white/60 text-xs mb-2 block">
                        Prix maximum : {PRICE_LABELS[maxPrice]}
                      </label>
                      <Slider
                        min={1} max={4} step={1}
                        value={[maxPrice]}
                        onValueChange={(v) => setMaxPrice(Array.isArray(v) ? v[0] : v as number)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-white/60 text-xs mb-2 block">
                        Note minimum : {minRating > 0 ? `${minRating}/5` : 'Toutes'}
                      </label>
                      <Slider
                        min={0} max={5} step={0.5}
                        value={[minRating]}
                        onValueChange={(v) => setMinRating(Array.isArray(v) ? v[0] : v as number)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-white/60 text-xs mb-2 block">Trier par</label>
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as typeof sortBy)}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                      >
                        <option value="relevance">Pertinence</option>
                        <option value="rating">Mieux notés</option>
                        <option value="price_asc">Prix ↑</option>
                        <option value="price_desc">Prix ↓</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0">
            <span className="text-white/50 text-xs">
              {isLoading ? 'Chargement...' : `${filteredPlaces.length} lieu${filteredPlaces.length > 1 ? 'x' : ''} trouvé${filteredPlaces.length > 1 ? 's' : ''}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white/50 hover:text-white text-xs"
              onClick={() => setShowMap(true)}
            >
              <MapIcon size={12} className="mr-1" /> Carte
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-36 bg-white/5 rounded-2xl animate-pulse" />
              ))
            ) : filteredPlaces.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Aucun lieu trouvé"
                description="Aucun lieu trouvé dans cette zone. Essayez d'autres filtres."
                actionLabel="Réinitialiser"
                onAction={() => { setQuery(''); setSelectedCategories([]); setMaxPrice(4); setMinRating(0); }}
              />
            ) : (
              filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`cursor-pointer transition-all rounded-2xl ${selectedPlace?.id === place.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <PlaceCard
                    place={place}
                    compact
                    distance={getDistanceTo(place.latitude, place.longitude)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className={`flex-1 relative ${showMap ? 'flex' : 'hidden md:flex'}`}>
          {/* Mobile map/list toggle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] md:hidden">
            <button
              onClick={() => setShowMap(false)}
              className="bg-[#12121A]/90 backdrop-blur-xl border border-white/20 text-white text-sm px-4 py-2 rounded-full"
            >
              ← Liste des lieux
            </button>
          </div>

          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <MapController center={mapCenter} zoom={12} />
            <TileLayer
              url={DARK_TILE_URL}
              attribution={DARK_TILE_ATTRIBUTION}
              maxZoom={19}
            />

            {/* User location */}
            {latitude && longitude && (
              <Marker
                position={[latitude, longitude]}
                icon={userLocationIcon}
              />
            )}

            {/* Place markers */}
            {filteredPlaces.map(place => {
              const config = getCategoryConfig(place.category);
              const isSelected = selectedPlace?.id === place.id;
              return (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={createPlaceIcon(config.emoji, config.markerColor, isSelected)}
                  eventHandlers={{
                    click: () => setSelectedPlace(place),
                  }}
                >
                  <Popup>
                    <div
                      className="w-52 cursor-pointer"
                      onClick={() => navigate(`/place/${place.id}`)}
                    >
                      <img
                        src={place.cover_image_url}
                        alt={place.name}
                        className="w-full h-28 object-cover"
                      />
                      <div className="p-2">
                        <CategoryBadge category={place.category} size="sm" />
                        <p className="text-white font-semibold text-sm mt-1 truncate">{place.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <ReviewStars rating={place.rating} size="sm" showScore />
                          <span className="text-white/50 text-xs">{PRICE_LABELS[place.price_level]}</span>
                        </div>
                        {place.price_min && (
                          <p className="text-white/50 text-xs mt-1">
                            {formatPrice(place.price_min, place.currency)}
                          </p>
                        )}
                        <Button
                          size="sm"
                          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-7 text-xs"
                          onClick={() => navigate(`/place/${place.id}`)}
                        >
                          Voir
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Active filters overlay */}
          {(selectedCategories.length > 0 || query) && (
            <div className="absolute top-4 right-4 flex flex-wrap gap-1 max-w-48 z-[1000]">
              {selectedCategories.map(cat => {
                const config = getCategoryConfig(cat);
                return (
                  <Badge
                    key={cat}
                    className="text-white rounded-full cursor-pointer"
                    style={{ background: config.markerColor + '40', borderColor: config.markerColor + '60' }}
                    onClick={() => toggleCategory(cat)}
                  >
                    {config.emoji} {config.label} <X size={10} className="ml-1" />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
