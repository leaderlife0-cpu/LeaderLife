import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Route, Settings, User, MapPin, LogOut } from 'lucide-react';
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
          <div className="h-32 bg-white/5 rounded-2xl animate-pulse mb-4" />
        </div>
      </Layout>
    );
  }

  const favoritePlaces = SEED_PLACES.filter(p => favorites.includes(p.id));
  const displayName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'Explorateur';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const stats = [
    { icon: MapPin, value: favoritePlaces.length, label: 'Favoris' },
    { icon: Star, value: 0, label: 'Avis' },
    { icon: Route, value: 0, label: 'Itinéraires' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white/10">
              <AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>{displayName}</h1>
            <p className="text-white/50 text-sm">{user.email}</p>
            <div className="flex gap-6 mt-4 justify-center sm:justify-start">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-white/40 text-xs flex items-center gap-1">
                    <s.icon size={10} />{s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full"
          >
            <LogOut size={14} className="mr-2" /> Déconnexion
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="favoris">
          <TabsList className="bg-white/5 border border-white/10 rounded-xl mb-6 w-full grid grid-cols-3">
            {[
              { value: 'favoris', icon: Heart, label: `Favoris (${getFavoriteCount()})` },
              { value: 'avis', icon: Star, label: 'Mes Avis' },
              { value: 'parametres', icon: Settings, label: 'Paramètres' },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/50 rounded-lg text-sm">
                <tab.icon size={14} className="mr-1.5" />{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoritePlaces.map(place => (
                  <PlaceCard key={place.id} place={place} distance={getDistanceTo(place.latitude, place.longitude)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="avis">
            <EmptyState
              icon={Star}
              title="Aucun avis"
              description="Visitez un lieu et partagez votre expérience avec la communauté."
              actionLabel="Explorer"
              onAction={() => navigate('/explore')}
            />
          </TabsContent>

          <TabsContent value="parametres">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><User size={16} /> Informations personnelles</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nom complet</label>
                    <input defaultValue={displayName} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Email</label>
                    <input defaultValue={user.email ?? ''} disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Biographie</label>
                    <textarea placeholder="Parlez-nous de vous..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">Sauvegarder</Button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-red-400 font-semibold mb-3">Zone dangereuse</h3>
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full text-sm">
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
