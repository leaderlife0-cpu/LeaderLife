import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, GripVertical, Trash2, Globe, Lock, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { CategoryBadge } from '@/components/places/CategoryBadge';
import { useAuth } from '@/hooks/useAuth';
import { SEED_PLACES } from '@/data/seedPlaces';
import { toast } from 'sonner';
import type { Place } from '@/types';

interface ItineraryItem {
  place: Place;
  order: number;
  notes: string;
}

export default function ItineraryPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('Mon itinéraire');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [placeQuery, setPlaceQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { state: { from: isNew ? '/itinerary/new' : `/itinerary/${id}` } });
  }, [user, authLoading, navigate, id, isNew]);

  const filteredPlaces = SEED_PLACES.filter(p =>
    placeQuery.length > 1 && (
      p.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(placeQuery.toLowerCase())
    )
  ).slice(0, 8);

  const addPlace = (place: Place) => {
    if (items.find(i => i.place.id === place.id)) { toast.error('Ce lieu est déjà dans l\'itinéraire.'); return; }
    setItems(prev => [...prev, { place, order: prev.length + 1, notes: '' }]);
    setShowSearch(false);
    setPlaceQuery('');
    toast.success(`${place.name} ajouté !`);
  };

  const removeItem = (placeId: string) => setItems(prev => prev.filter(i => i.place.id !== placeId));

  const updateNotes = (placeId: string, notes: string) => {
    setItems(prev => prev.map(i => i.place.id === placeId ? { ...i, notes } : i));
  };

  const handleSave = () => {
    if (!title.trim()) { toast.error('Donnez un titre à votre itinéraire.'); return; }
    toast.success(isPublic ? 'Itinéraire publié !' : 'Itinéraire sauvegardé !');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  if (authLoading) return <Layout><div className="h-screen" /></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
            {isNew ? 'Créer un itinéraire' : 'Modifier l\'itinéraire'}
          </h1>

          {/* Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Titre</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: 3 jours à Paris" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Décrivez votre itinéraire..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Ville / Pays</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ex: Paris, France" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>

          {/* Places */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Lieux ({items.length})</h2>
              <Button onClick={() => setShowSearch(true)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-8 px-4 text-sm">
                <Plus size={14} className="mr-1" /> Ajouter
              </Button>
            </div>

            {/* Place search modal */}
            {showSearch && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl w-full max-w-md">
                  <div className="p-4 border-b border-white/10">
                    <input
                      autoFocus
                      value={placeQuery}
                      onChange={e => setPlaceQuery(e.target.value)}
                      placeholder="Rechercher un lieu..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {filteredPlaces.map(p => (
                      <button key={p.id} onClick={() => addPlace(p)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl text-left transition-all">
                        <img src={p.cover_image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{p.name}</p>
                          <p className="text-white/50 text-xs">{p.city}</p>
                        </div>
                        <CategoryBadge category={p.category} size="sm" />
                      </button>
                    ))}
                    {placeQuery.length > 1 && filteredPlaces.length === 0 && (
                      <p className="text-white/40 text-sm text-center py-4">Aucun résultat</p>
                    )}
                    {placeQuery.length <= 1 && (
                      <p className="text-white/40 text-sm text-center py-4">Tapez au moins 2 caractères</p>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <Button variant="ghost" className="w-full text-white/60 hover:text-white" onClick={() => setShowSearch(false)}>Annuler</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center">
                  <p className="text-white/40 text-sm">Ajoutez des lieux à votre itinéraire</p>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.place.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3"
                  >
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <GripVertical size={16} className="text-white/30" />
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    </div>
                    <img src={item.place.cover_image_url} alt={item.place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-white font-semibold text-sm truncate">{item.place.name}</p>
                          <p className="text-white/50 text-xs">{item.place.city}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <CategoryBadge category={item.place.category} size="sm" />
                          <button onClick={() => removeItem(item.place.id)} className="text-red-400 hover:text-red-300 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item.notes}
                        onChange={e => updateNotes(item.place.id, e.target.value)}
                        placeholder="Notes, conseils..."
                        rows={1}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/80 placeholder:text-white/30 text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => { setIsPublic(false); handleSave(); }}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <Save size={14} className="mr-2" /> Sauvegarder
            </Button>
            <Button
              onClick={() => { setIsPublic(true); handleSave(); }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              <Globe size={14} className="mr-2" /> Publier
            </Button>
            <Button onClick={handleShare} variant="outline" className="border-white/10 text-white/60 hover:bg-white/5 rounded-full">
              <Share2 size={14} className="mr-2" /> Partager
            </Button>
            <Badge className={`ml-auto ${isPublic ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/10 text-white/60 border-white/10'}`}>
              {isPublic ? <><Globe size={10} className="mr-1" />Public</> : <><Lock size={10} className="mr-1" />Privé</>}
            </Badge>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
