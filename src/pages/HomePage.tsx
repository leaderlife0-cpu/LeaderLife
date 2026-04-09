import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, TrendingUp, Globe, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { PlaceCard } from '@/components/places/PlaceCard';
import { Layout } from '@/components/layout/Layout';
import { CATEGORIES, POPULAR_CITIES } from '@/lib/constants';
import { useFeaturedPlaces } from '@/hooks/usePlaces';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';
import type { VoiceIntent } from '@/types';

const STATS = [
  { icon: Globe, value: '195+', label: 'pays' },
  { icon: MapPin, value: '1M+', label: 'lieux' },
  { icon: Star, value: '500K+', label: 'avis' },
  { icon: Users, value: '250K+', label: 'explorateurs' },
];

const titleWords = ['Explorez', 'le', 'monde', 'comme', 'si', 'vous', 'y', 'étiez'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: featuredPlaces = [] } = useFeaturedPlaces();
  const { getDistanceTo } = useGeolocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleVoice = (text: string, intent: VoiceIntent) => {
    setQuery(text);
    let url = '/search?q=' + encodeURIComponent(text);
    if (intent.category) url += '&category=' + intent.category;
    if (intent.city) url += '&city=' + intent.city;
    navigate(url);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #0A0A0F 0%, #0d1b2e 25%, #1a0a1e 50%, #1a0d06 75%, #0A0A0F 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
          }}
        />
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center pt-24 pb-12">
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-white/60 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Restaurants, hôtels, plages, nightlife — découvrez les meilleurs spots dans 195+ pays
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 mb-6 max-w-2xl mx-auto"
          >
            <Search size={20} className="text-white/40 ml-2 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher une ville, un pays, un lieu..."
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm md:text-base focus:outline-none py-2"
            />
            <VoiceMicButton onTranscript={handleVoice} size="md" />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 shrink-0"
            >
              Rechercher
            </Button>
          </motion.form>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-hide"
          >
            {CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.key}
                onClick={() => navigate(`/explore?category=${cat.key}`)}
                className="shrink-0 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/70 hover:text-white transition-all"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 -mt-8 mb-16"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon size={20} className="text-blue-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Popular destinations */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            Destinations populaires
          </h2>
          <p className="text-white/50">Les villes les plus explorées par notre communauté</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {POPULAR_CITIES.map((city, i) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square md:aspect-video"
              onClick={() => navigate(`/ville/${city.name}`)}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-white font-bold text-lg leading-tight">{city.name}</div>
                <div className="text-white/60 text-xs">{city.country}</div>
                <div className="text-white/40 text-xs mt-0.5">{city.count} lieux</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending */}
      {featuredPlaces.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <TrendingUp size={20} className="text-orange-400" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                En ce moment
              </h2>
              <p className="text-white/50 text-sm">Les spots les plus populaires</p>
            </div>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredPlaces.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="shrink-0 w-64"
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

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 mb-16"
      >
        <div
          className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1E3A8A20, #2196F330)' }}
        >
          <div className="absolute inset-0 border border-blue-500/20 rounded-3xl" />
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Prêt à explorer ?
          </h2>
          <p className="text-white/60 mb-6">Trouvez les meilleurs spots avec notre IA voyage et la recherche vocale</p>
          <div className={cn('flex gap-3 justify-center flex-wrap')}>
            <Button
              onClick={() => navigate('/explore')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8"
            >
              Explorer maintenant
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}
