import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, TrendingUp, Globe, Star, Users, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceMicButton } from '@/components/search/VoiceMicButton';
import { PlaceCard } from '@/components/places/PlaceCard';
import { Layout } from '@/components/layout/Layout';
import { CATEGORIES, POPULAR_CITIES } from '@/lib/constants';
import { useFeaturedPlaces } from '@/hooks/usePlaces';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { VoiceIntent } from '@/types';

const STATS = [
  { icon: Globe, value: '195+', label: 'pays' },
  { icon: MapPin, value: '1M+', label: 'lieux' },
  { icon: Star, value: '500K+', label: 'avis' },
  { icon: Users, value: '250K+', label: 'explorateurs' },
];

// Fake stories for the Instagram-style stories section
const STORIES = [
  { name: 'Dubai', emoji: '🏙️', gradient: 'from-violet-500 to-rose-500' },
  { name: 'Paris', emoji: '🗼', gradient: 'from-rose-500 to-orange-500' },
  { name: 'Bali', emoji: '🌴', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Tokyo', emoji: '⛩️', gradient: 'from-rose-500 to-violet-500' },
  { name: 'Marrakech', emoji: '🕌', gradient: 'from-orange-500 to-rose-500' },
  { name: 'New York', emoji: '🗽', gradient: 'from-violet-600 to-indigo-500' },
  { name: 'Abidjan', emoji: '🌅', gradient: 'from-yellow-500 to-rose-500' },
  { name: 'Bangkok', emoji: '🛺', gradient: 'from-teal-500 to-violet-500' },
];

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
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 -z-10 animate-gradient"
          style={{
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1a0d2e 25%, #0d1a2e 50%, #1a0d1e 75%, #0F0F0F 100%)',
            backgroundSize: '400% 400%',
          }}
        />

        {/* Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center pt-28 pb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-white/60 mb-6"
            style={{ background: 'rgba(139,92,246,0.08)' }}
          >
            <Compass size={14} className="text-violet-400" />
            <span>Découvrez <span className="text-violet-400 font-medium">195+ pays</span> avec l'IA</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Explorez le monde{' '}
            <span className="gradient-text">sans limites</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez le monde, connectez-vous partout. Restaurants, hôtels, plages, nightlife — tout en un seul endroit.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex items-center gap-2 border rounded-2xl p-2 mb-6 max-w-2xl mx-auto input-gradient"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}
          >
            <Search size={18} className="text-white/35 ml-2 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher une ville, un pays, un lieu..."
              className="flex-1 bg-transparent text-white placeholder:text-white/35 text-sm md:text-base focus:outline-none py-2"
            />
            <VoiceMicButton onTranscript={handleVoice} size="md" />
            <Button
              type="submit"
              className="text-white rounded-xl px-5 shrink-0 font-semibold"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              Rechercher
            </Button>
          </motion.form>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-hide"
          >
            {CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.key}
                onClick={() => navigate(`/explore?category=${cat.key}`)}
                className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm text-white/60 hover:text-white transition-all border border-white/8 hover:border-violet-500/40 hover:bg-violet-500/8"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STORIES (Instagram-style) ===== */}
      <section className="max-w-7xl mx-auto px-4 mb-12 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h2
            className="text-lg font-bold text-white/80"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Destinations tendance
          </h2>
        </motion.div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {STORIES.map((story, i) => (
            <motion.button
              key={story.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/ville/${story.name}`)}
              className="shrink-0 flex flex-col items-center gap-2"
            >
              {/* Story ring */}
              <div
                className="p-[2px] rounded-full"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F472B6)' }}
              >
                <div
                  className="p-[2px] rounded-full"
                  style={{ background: '#0F0F0F' }}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${story.gradient}`}
                  >
                    {story.emoji}
                  </div>
                </div>
              </div>
              <span className="text-white/60 text-xs font-medium truncate max-w-[72px]">
                {story.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 mb-16"
      >
        <div
          className="border rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ background: 'rgba(26,26,46,0.6)', backdropFilter: 'blur(20px)', borderColor: 'rgba(139,92,246,0.15)' }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))' }}
              >
                <stat.icon size={16} className="text-violet-400" />
              </div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Destinations populaires
            </h2>
            <p className="text-white/45 text-sm">Les villes les plus explorées par notre communauté</p>
          </div>
          <Button
            variant="ghost"
            className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl text-sm"
            onClick={() => navigate('/explore')}
          >
            Voir tout
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {POPULAR_CITIES.map((city, i) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-[20px] overflow-hidden cursor-pointer group aspect-square md:aspect-video border border-white/8"
              onClick={() => navigate(`/ville/${city.name}`)}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {city.name}
                </div>
                <div className="text-white/55 text-xs">{city.country}</div>
                <div className="text-white/35 text-xs mt-0.5">{city.count} lieux</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TRENDING PLACES (horizontal scroll) ===== */}
      {featuredPlaces.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))' }}
              >
                <TrendingUp size={16} className="text-violet-400" />
              </div>
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  En ce moment
                </h2>
                <p className="text-white/40 text-sm">Les spots les plus populaires</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl text-sm"
              onClick={() => navigate('/explore')}
            >
              Voir tout
            </Button>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
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

      {/* ===== CTA ===== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 mb-16"
      >
        <div
          className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))',
            borderColor: 'rgba(139,92,246,0.2)',
          }}
        >
          {/* Orb decorations */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(30px)', transform: 'translate(30%, -30%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(30px)', transform: 'translate(-30%, 30%)' }}
          />

          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-3 relative z-10"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Prêt à{' '}
            <span className="gradient-text">explorer ?</span>
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto relative z-10">
            Trouvez les meilleurs spots avec notre IA voyage et la recherche vocale
          </p>
          <div className="flex gap-3 justify-center flex-wrap relative z-10">
            <Button
              onClick={() => navigate('/explore')}
              className="text-white rounded-2xl px-8 h-11 font-semibold text-base"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              Explorer maintenant
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="border-white/15 text-white hover:bg-white/8 rounded-2xl px-8 h-11 font-semibold text-base"
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}
