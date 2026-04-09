import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, MapPin, Phone, Globe, MessageCircle, Share2, ChevronLeft,
  ChevronRight, Clock, Wifi, Car, Wind, Waves, Coffee, CheckCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { ReviewStars } from '@/components/reviews/ReviewStars';
import { CategoryBadge } from '@/components/places/CategoryBadge';
import { PlaceCard } from '@/components/places/PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePlaceById, usePlaces } from '@/hooks/usePlaces';
import { useFavorites } from '@/hooks/useFavorites';
import { useGeolocation } from '@/hooks/useGeolocation';
import { formatPrice } from '@/utils/currencyConverter';
import { isOpenNow, formatDistance } from '@/utils/formatters';
import { PRICE_LABELS } from '@/lib/constants';

const AMENITY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Wi-Fi': Wifi, 'Parking': Car, 'Climatisation': Wind,
  'Piscine': Waves, 'Restaurant': Coffee,
};

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: place, isLoading } = usePlaceById(id ?? '');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getDistanceTo } = useGeolocation();
  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data: similar = [] } = usePlaces({
    category: place?.category,
    city: place?.city,
    limit: 4,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 pt-24">
          <div className="h-72 bg-white/5 rounded-2xl animate-pulse mb-6" />
          <div className="h-8 bg-white/5 rounded animate-pulse mb-3 w-1/2" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
        </div>
      </Layout>
    );
  }

  if (!place) {
    return (
      <Layout>
        <div className="pt-24">
          <EmptyState
            icon={MapPin}
            title="Lieu introuvable"
            description="Ce lieu n'existe pas ou a été supprimé."
            actionLabel="Retour à l'exploration"
            onAction={() => navigate('/explore')}
          />
        </div>
      </Layout>
    );
  }

  const images = [place.cover_image_url, ...place.images.filter(i => i !== place.cover_image_url)];
  const openStatus = isOpenNow(place.opening_hours);
  const distance = getDistanceTo(place.latitude, place.longitude);
  const isFav = isFavorite(place.id);
  const similarFiltered = similar.filter(p => p.id !== place.id).slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: place.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Layout>
      {/* Image carousel */}
      <div className="relative h-72 md:h-96 overflow-hidden mt-16">
        <img
          src={images[imgIndex]}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setImgIndex(i => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-24 md:pb-8">
        {/* Main info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge category={place.category} />
                {place.is_verified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle size={10} className="mr-1" /> Vérifié
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                {place.name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-white/40" />
                <span className="text-white/60 text-sm">{place.address}</span>
                {distance !== null && (
                  <span className="text-blue-400 text-sm">• {formatDistance(distance)}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <ReviewStars rating={place.rating} size="md" showScore reviewCount={place.review_count} />
                <span className="text-white/40">•</span>
                <span className="text-white/60 text-sm">{PRICE_LABELS[place.price_level]}</span>
                {place.price_min && (
                  <span className="text-white/40 text-sm">
                    à partir de {formatPrice(place.price_min, place.currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              onClick={() => toggleFavorite(place.id)}
              className={`rounded-full ${isFav ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
            >
              <Heart size={16} className={isFav ? 'fill-white mr-2' : 'mr-2'} />
              {isFav ? 'Favori' : 'Ajouter'}
            </Button>
            {place.phone && (
              <a href={`tel:${place.phone}`} className="inline-flex items-center rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 text-sm font-medium transition-colors">
                <Phone size={16} className="mr-2" /> Appeler
              </a>
            )}
            {place.whatsapp && (
              <Button
                onClick={() => window.open(`https://wa.me/${place.whatsapp?.replace(/\D/g, '')}`, '_blank')}
                className="rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
              >
                <MessageCircle size={16} className="mr-2" /> WhatsApp
              </Button>
            )}
            {place.website && (
              <Button
                onClick={() => window.open(place.website ?? '', '_blank')}
                className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Globe size={16} className="mr-2" /> Site web
              </Button>
            )}
            <Button
              onClick={handleShare}
              className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Share2 size={16} className="mr-2" /> Partager
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="apercu">
          <TabsList className="bg-white/5 border border-white/10 rounded-xl mb-6 w-full grid grid-cols-4">
            {['apercu', 'photos', 'avis', 'similaires'].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/50 rounded-lg capitalize text-sm"
              >
                {tab === 'apercu' ? 'Aperçu' : tab === 'avis' ? 'Avis' : tab === 'similaires' ? 'Similaires' : 'Photos'}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Aperçu */}
          <TabsContent value="apercu" className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3">Description</h3>
              <p className="text-white/70 leading-relaxed">{place.description}</p>
            </div>

            {place.opening_hours && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-white/60" />
                  <h3 className="text-white font-semibold">Horaires</h3>
                  {openStatus !== null && (
                    <Badge className={openStatus ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                      {openStatus ? 'Ouvert' : 'Fermé'}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {DAYS.map(day => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-white/50 capitalize">{day}</span>
                      <span className="text-white/80">{place.opening_hours?.[day] ?? 'Non indiqué'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {place.amenities.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3">Équipements & Services</h3>
                <div className="flex flex-wrap gap-2">
                  {place.amenities.map(a => {
                    const Icon = AMENITY_ICONS[a];
                    return (
                      <div key={a} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/70">
                        {Icon && <Icon size={12} />}
                        {a}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3">Adresse</h3>
              <p className="text-white/70 text-sm mb-3">{place.address}</p>
              <Button
                onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=16`, '_blank')}
                className="rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-sm"
              >
                <ExternalLink size={14} className="mr-2" /> Voir sur la carte
              </Button>
            </div>
          </TabsContent>

          {/* Photos */}
          <TabsContent value="photos">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(i)}
                >
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
              <div
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                onClick={() => setLightbox(null)}
              >
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white" onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null); }}>
                  <ChevronLeft size={20} />
                </button>
                <img src={images[lightbox]} alt="" className="max-w-4xl max-h-screen object-contain" onClick={e => e.stopPropagation()} />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white" onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i + 1) % images.length : null); }}>
                  <ChevronRight size={20} />
                </button>
                <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setLightbox(null)}>✕</button>
              </div>
            )}
          </TabsContent>

          {/* Avis */}
          <TabsContent value="avis">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <ReviewStars rating={place.rating} size="lg" showScore reviewCount={place.review_count} className="justify-center mb-4" />
              <p className="text-white/50 text-sm">Les avis utilisateurs nécessitent une connexion Supabase.</p>
              <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                Écrire un avis
              </Button>
            </div>
          </TabsContent>

          {/* Similaires */}
          <TabsContent value="similaires">
            {similarFiltered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarFiltered.map(p => (
                  <PlaceCard key={p.id} place={p} distance={getDistanceTo(p.latitude, p.longitude)} />
                ))}
              </div>
            ) : (
              <EmptyState icon={MapPin} title="Aucun lieu similaire" description="Pas d'autres lieux de cette catégorie dans cette ville." />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#12121A]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between z-40">
        <div>
          <div className="text-white font-semibold">{PRICE_LABELS[place.price_level]}</div>
          {place.price_min && (
            <div className="text-white/50 text-xs">à partir de {formatPrice(place.price_min, place.currency)}</div>
          )}
        </div>
        <Button
          onClick={() => place.phone ? window.open(`tel:${place.phone}`) : handleShare()}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
        >
          {place.phone ? 'Contacter' : 'Partager'}
        </Button>
      </div>
    </Layout>
  );
}
