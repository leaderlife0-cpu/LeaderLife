import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, TrendingUp, Star, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { PlaceCard } from '@/components/places/PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePlaces } from '@/hooks/usePlaces';
import { useGeolocation } from '@/hooks/useGeolocation';
import { POPULAR_CITIES, CATEGORIES, getCategoryConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';

const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function createPlaceIcon(emoji: string, color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;cursor:pointer;
      background:${color}CC;
      border:2px solid ${color};
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function CityPage() {
  const { nom } = useParams<{ nom: string }>();
  const navigate = useNavigate();
  const cityName = nom ?? '';
  const { getDistanceTo } = useGeolocation();

  const { data: places = [], isLoading } = usePlaces({ city: cityName, limit: 50 });

  const cityInfo = POPULAR_CITIES.find(
    c => c.name.toLowerCase() === cityName.toLowerCase()
  );

  // Stats par catégorie
  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: places.filter(p => p.category === cat.key).length,
  })).filter(c => c.count > 0);

  const topRated = [...places].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const mapCenter = places.length > 0
    ? { lat: places[0].latitude, lng: places[0].longitude }
    : { lat: 5.354, lng: -4.008 };

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-72 md:h-96 mt-16 overflow-hidden">
        {cityInfo?.image ? (
          <img
            src={cityInfo.image}
            alt={cityName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #0d1b2e 0%, #1a0a1e 100%)' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent" />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* City name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                {cityInfo?.country ?? ''}
              </span>
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {cityName}
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {places.length} lieu{places.length > 1 ? 'x' : ''} à découvrir
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <Layers size={20} className="text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{places.length}</div>
            <div className="text-white/40 text-xs">Lieux</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <Star size={20} className="text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">
              {places.length > 0
                ? (places.reduce((s, p) => s + p.rating, 0) / places.length).toFixed(1)
                : '—'}
            </div>
            <div className="text-white/40 text-xs">Note moyenne</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <TrendingUp size={20} className="text-orange-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{categoryStats.length}</div>
            <div className="text-white/40 text-xs">Catégories</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <MapPin size={20} className="text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">
              {topRated[0]?.rating.toFixed(1) ?? '—'}
            </div>
            <div className="text-white/40 text-xs">Meilleure note</div>
          </div>
        </motion.div>

        {/* Category pills */}
        {categoryStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categoryStats.map(cat => (
              <button
                key={cat.key}
                onClick={() => navigate(`/explore?city=${cityName}&category=${cat.key}`)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition-all hover:scale-105"
                style={{
                  background: `${cat.markerColor}15`,
                  borderColor: `${cat.markerColor}40`,
                  color: cat.markerColor,
                }}
              >
                <span>{cat.emoji}</span>
                <span className="font-medium">{cat.label}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: `${cat.markerColor}30` }}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Top lieux */}
        {topRated.length > 0 && (
          <section className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-5"
            >
              <Star size={18} className="text-yellow-400" />
              <h2
                className="text-xl md:text-2xl font-bold text-white"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Les incontournables
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topRated.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <PlaceCard
                    place={place}
                    distance={getDistanceTo(place.latitude, place.longitude)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Map */}
        {places.length > 0 && (
          <section className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-5"
            >
              <h2
                className="text-xl md:text-2xl font-bold text-white"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Carte de {cityName}
              </h2>
              <Button
                onClick={() => navigate(`/explore?city=${cityName}`)}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-full text-sm"
              >
                Voir sur la carte complète
              </Button>
            </motion.div>

            <div className="rounded-2xl overflow-hidden h-64 md:h-80">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={12}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url={DARK_TILE_URL}
                  attribution={DARK_TILE_ATTRIBUTION}
                  maxZoom={19}
                />
                {places.map(place => {
                  const config = getCategoryConfig(place.category);
                  return (
                    <Marker
                      key={place.id}
                      position={[place.latitude, place.longitude]}
                      icon={createPlaceIcon(config.emoji, config.markerColor)}
                      eventHandlers={{
                        click: () => navigate(`/place/${place.id}`),
                      }}
                    />
                  );
                })}
              </MapContainer>
            </div>
          </section>
        )}

        {/* All places */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-5"
          >
            <h2
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Tous les lieux
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : places.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title={`Aucun lieu trouvé à ${cityName}`}
              description="Explorez d'autres villes ou utilisez la recherche globale."
              actionLabel="Explorer"
              onAction={() => navigate('/explore')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {places.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.05 }}
                >
                  <PlaceCard
                    place={place}
                    distance={getDistanceTo(place.latitude, place.longitude)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'mt-12 rounded-3xl overflow-hidden p-8 text-center relative border border-blue-500/20',
          )}
          style={{ background: 'linear-gradient(135deg, #1E3A8A15, #2196F320)' }}
        >
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Planifiez votre séjour à {cityName}
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Demandez à notre IA de créer un itinéraire personnalisé pour vous.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/assistant')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8"
            >
              Parler à l'assistant
            </Button>
            <Button
              onClick={() => navigate(`/explore?city=${cityName}`)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
            >
              Explorer la carte
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
