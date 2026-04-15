import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Route, Settings, User, MapPin, LogOut, Grid3X3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Layout } from '@/components/layout/Layout';
import { PlaceCard } from '@/components/places/PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { SEED_PLACES } from '@/data/seedPlaces';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function ProfilePage() {
  const { user, signOut, isLoading } = useAuth();
  const { favorites, getFavoriteCount } = useFavorites();
  const { getDistanceTo } = useGeolocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) navigate('/login', { state: { from: '/profile' } });
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 pt-24">
          <div
            className="h-32 rounded-2xl animate-pulse mb-4"
            style={{ background: 'rgba(139,92,246,0.08)' }}
          />
        </div>
      </Layout>
    );
  }

  const favoritePlaces = SEED_PLACES.filter(p => favorites.includes(p.id));
  const displayName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'Explorateur';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const stats = [
    { value: favoritePlaces.length, label: 'Favoris' },
    { value: 0, label: 'Avis' },
    { value: 0, label: 'Itinéraires' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">

        {/* ===== PROFILE HEADER (Instagram-style) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Cover / gradient banner */}
          <div
            className="h-32 rounded-t-3xl relative overflow-hidden mb-0"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F472B6)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'3\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
            />
          </div>

          <div
            className="rounded-b-3xl border border-t-0 px-6 pb-6"
            style={{ background: 'rgba(22,33,62,0.8)', borderColor: 'rgba(139,92,246,0.15)' }}
          >
            {/* Avatar + actions */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div
                className="p-[3px] rounded-full"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                <div className="p-[3px] rounded-full" style={{ background: '#16213E' }}>
                  <Avatar className="w-20 h-20">
                    <AvatarFallback
                      className="text-white text-xl font-bold"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-white/15 text-white/70 hover:bg-white/8 rounded-xl text-sm h-9"
                  onClick={() => navigate('/profile')}
                >
                  <Settings size={14} className="mr-1.5" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500/25 text-red-400 hover:bg-red-500/10 rounded-xl text-sm h-9"
                  onClick={signOut}
                >
                  <LogOut size={14} />
                </Button>
              </div>
            </div>

            {/* Name + info */}
            <div className="mb-5">
              <h1
                className="text-xl font-bold text-white mb-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {displayName}
              </h1>
              <p className="text-white/40 text-sm">{user.email}</p>
              <p className="text-white/50 text-sm mt-2 flex items-center gap-1.5">
                <MapPin size={12} className="text-violet-400" />
                Explorateur du monde 🌍
              </p>
            </div>

            {/* Stats — Instagram style */}
            <div
              className="grid grid-cols-3 gap-4 border rounded-2xl py-4"
              style={{ borderColor: 'rgba(139,92,246,0.15)', background: 'rgba(139,92,246,0.05)' }}
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== TABS ===== */}
        <Tabs defaultValue="favoris">
          <TabsList
            className="border border-white/8 rounded-2xl mb-6 w-full grid grid-cols-3 p-1"
            style={{ background: 'rgba(22,33,62,0.6)' }}
          >
            {[
              { value: 'favoris', icon: Heart, label: `Favoris (${getFavoriteCount()})` },
              { value: 'avis', icon: Star, label: 'Mes Avis' },
              { value: 'parametres', icon: Settings, label: 'Paramètres' },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-white/45 rounded-xl text-sm font-medium transition-all data-[state=active]:text-white data-[state=active]:shadow-none"
                style={{
                  ['--tw-data-active-bg' as string]: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                }}
              >
                <span
                  className="data-[state=active]:hidden"
                  data-state={tab.value}
                >
                  <tab.icon size={14} className="mr-1.5 inline" />
                </span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Favoris tab */}
          <TabsContent value="favoris">
            {favoritePlaces.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Aucun favori"
                description="Explorez des lieux et ajoutez-les à vos favoris en cliquant sur le ❤️"
                actionLabel="Explorer"
                onAction={() => navigate('/explore')}
              />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4 text-white/40 text-sm">
                  <Grid3X3 size={14} />
                  <span>{favoritePlaces.length} lieu{favoritePlaces.length > 1 ? 'x' : ''} sauvegardé{favoritePlaces.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {favoritePlaces.map(place => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      distance={getDistanceTo(place.latitude, place.longitude)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Avis tab */}
          <TabsContent value="avis">
            <EmptyState
              icon={Star}
              title="Aucun avis"
              description="Visitez un lieu et partagez votre expérience avec la communauté."
              actionLabel="Explorer"
              onAction={() => navigate('/explore')}
            />
          </TabsContent>

          {/* Paramètres tab */}
          <TabsContent value="parametres">
            <div
              className="border rounded-2xl p-6 space-y-6"
              style={{ background: 'rgba(22,33,62,0.5)', borderColor: 'rgba(139,92,246,0.12)' }}
            >
              <div>
                <h3
                  className="text-white font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <User size={16} className="text-violet-400" />
                  Informations personnelles
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/50 text-sm mb-1.5 block">Nom complet</label>
                    <input
                      defaultValue={displayName}
                      className="w-full border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all"
                      style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-1.5 block">Email</label>
                    <input
                      defaultValue={user.email ?? ''}
                      disabled
                      className="w-full border rounded-xl px-4 py-3 text-white/40 text-sm focus:outline-none"
                      style={{ background: 'rgba(26,26,46,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-1.5 block">Biographie</label>
                    <textarea
                      placeholder="Parlez-nous de vous..."
                      rows={3}
                      className="w-full border rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none resize-none transition-all"
                      style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <Button
                    className="text-white rounded-xl font-semibold"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                  >
                    Sauvegarder
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/8 pt-6">
                <h3 className="text-red-400 font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Zone dangereuse
                </h3>
                <Button
                  variant="outline"
                  className="border-red-500/25 text-red-400 hover:bg-red-500/10 rounded-xl text-sm"
                >
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
