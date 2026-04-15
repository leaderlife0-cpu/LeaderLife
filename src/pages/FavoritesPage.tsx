import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, FolderPlus, X, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { PlaceCard } from '@/components/places/PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFavorites } from '@/hooks/useFavorites';
import { useGeolocation } from '@/hooks/useGeolocation';
import { SEED_PLACES } from '@/data/seedPlaces';
import { CATEGORIES } from '@/lib/constants';
import type { PlaceCategory } from '@/types';

const BASE_LISTS = ['Tous', 'À visiter', 'Coups de cœur', 'Restaurants', 'Hôtels'];

export default function FavoritesPage() {
  const { favorites, toggleFavorite, getFavoriteCount } = useFavorites();
  const { getDistanceTo } = useGeolocation();
  const navigate = useNavigate();
  const [activeList, setActiveList] = useState('Tous');
  const [filterCategory, setFilterCategory] = useState<PlaceCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [customLists, setCustomLists] = useState<string[]>([]);

  const favoritePlaces = SEED_PLACES.filter(p => favorites.includes(p.id));

  const filtered = favoritePlaces.filter(p => {
    if (filterCategory && p.category !== filterCategory) return false;
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;
    return true;
  });

  const handleAddList = () => {
    const name = newListName.trim();
    if (!name) return;
    setCustomLists(prev => [...prev, name]);
    setNewListName('');
    setShowNewList(false);
  };

  const allLists = [BASE_LISTS[0], ...customLists, ...BASE_LISTS.slice(1)];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}
            >
              <Heart size={20} className="text-white fill-white" />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Mes Favoris
              </h1>
              <p className="text-white/40 text-sm">
                {getFavoriteCount()} lieu{getFavoriteCount() > 1 ? 'x' : ''} sauvegardé{getFavoriteCount() > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0 space-y-4"
          >
            {/* Lists */}
            <div
              className="border rounded-2xl p-4"
              style={{ background: 'rgba(22,33,62,0.6)', borderColor: 'rgba(139,92,246,0.12)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Mes listes
                </h2>
                <button
                  onClick={() => setShowNewList(true)}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <FolderPlus size={16} />
                </button>
              </div>

              <AnimatePresence>
                {showNewList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="flex gap-2 items-center">
                      <input
                        autoFocus
                        value={newListName}
                        onChange={e => setNewListName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddList()}
                        placeholder="Nom de la liste..."
                        className="flex-1 border rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none"
                        style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                      />
                      <button onClick={handleAddList} className="text-violet-400 text-xs hover:text-violet-300 font-semibold">OK</button>
                      <button onClick={() => setShowNewList(false)} className="text-white/30 hover:text-white">
                        <X size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                {allLists.map(list => (
                  <button
                    key={list}
                    onClick={() => setActiveList(list)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between"
                    style={
                      activeList === list
                        ? {
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
                            border: '1px solid rgba(139,92,246,0.3)',
                            color: '#A78BFA',
                          }
                        : {
                            color: 'rgba(255,255,255,0.5)',
                          }
                    }
                  >
                    <span>{list}</span>
                    {list === 'Tous' && (
                      <span className="text-xs text-white/25">{getFavoriteCount()}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div
              className="border rounded-2xl p-4"
              style={{ background: 'rgba(22,33,62,0.6)', borderColor: 'rgba(139,92,246,0.12)' }}
            >
              <h2
                className="text-white font-semibold text-sm mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Catégories
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => setFilterCategory(undefined)}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                  style={!filterCategory
                    ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' }
                    : { color: 'rgba(255,255,255,0.5)' }
                  }
                >
                  Toutes
                </button>
                {CATEGORIES.map(cat => {
                  const count = favoritePlaces.filter(p => p.category === cat.key).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setFilterCategory(filterCategory === cat.key ? undefined : cat.key)}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-all"
                      style={
                        filterCategory === cat.key
                          ? {
                              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
                              border: '1px solid rgba(139,92,246,0.3)',
                              color: '#A78BFA',
                            }
                          : { color: 'rgba(255,255,255,0.5)' }
                      }
                    >
                      <span>{cat.emoji} {cat.label}</span>
                      <span className="text-xs text-white/25">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex-1 flex items-center gap-2 border rounded-2xl px-3 input-gradient"
                style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <Search size={15} className="text-white/35 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans mes favoris..."
                  className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-white/35 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
              {filterCategory && (
                <Badge
                  className="text-white/65 cursor-pointer hover:text-white border shrink-0"
                  style={{ background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)', color: '#A78BFA' }}
                  onClick={() => setFilterCategory(undefined)}
                >
                  {CATEGORIES.find(c => c.key === filterCategory)?.label}
                  <X size={10} className="ml-1" />
                </Badge>
              )}
            </div>

            {/* Grid */}
            {favoritePlaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))' }}
                >
                  <Heart size={36} className="text-rose-400/60" />
                </div>
                <h2
                  className="text-white font-bold text-xl mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Aucun favori pour l'instant
                </h2>
                <p className="text-white/40 text-sm mb-8 max-w-sm">
                  Explorez des lieux et ajoutez-les à vos favoris en cliquant sur le ❤️
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button
                    onClick={() => navigate('/explore')}
                    className="text-white rounded-2xl px-8 font-semibold"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                  >
                    <MapPin size={16} className="mr-2" /> Explorer
                  </Button>
                  <Button
                    onClick={() => navigate('/assistant')}
                    variant="outline"
                    className="border-white/15 text-white hover:bg-white/8 rounded-2xl px-8"
                  >
                    Demander à l'IA
                  </Button>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Aucun résultat"
                description="Aucun favori ne correspond à votre recherche."
                actionLabel="Réinitialiser les filtres"
                onAction={() => { setSearchQuery(''); setFilterCategory(undefined); }}
              />
            ) : (
              <>
                <p className="text-white/35 text-sm mb-4">
                  {filtered.length} lieu{filtered.length > 1 ? 'x' : ''}
                </p>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filtered.map((place, i) => (
                      <motion.div
                        key={place.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.04 }}
                        className="relative group"
                      >
                        <PlaceCard place={place} distance={getDistanceTo(place.latitude, place.longitude)} />
                        <button
                          onClick={() => toggleFavorite(place.id)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                          style={{ background: 'rgba(239,68,68,0.9)' }}
                          title="Retirer des favoris"
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
