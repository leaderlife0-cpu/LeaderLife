import type { VoiceIntent, PlaceCategory } from '@/types';
import { KNOWN_CITIES } from '@/lib/constants';

const CATEGORY_KEYWORDS: Record<PlaceCategory, string[]> = {
  restaurant: ['restaurant', 'resto', 'manger', 'dîner', 'déjeuner', 'food', 'cuisine', 'brasserie', 'café', 'bistrot'],
  hotel: ['hôtel', 'hotel', 'hébergement', 'chambre', 'dormir', 'nuit'],
  nightclub: ['boîte', 'club', 'bar', 'nightclub', 'discothèque', 'sortir', 'soirée', 'fête'],
  beach: ['plage', 'beach', 'mer', 'sable', 'bord de mer'],
  airbnb: ['airbnb', 'location', 'appartement', 'appart', 'loger', 'maison'],
  entertainment: ['parc', 'zoo', 'cinéma', 'loisirs', 'activité', 'divertissement', 'fun'],
  shopping: ['shopping', 'marché', 'boutique', 'magasin', 'centre commercial', 'acheter'],
  spa: ['spa', 'massage', 'bien-être', 'relaxation', 'hammam', 'sauna'],
  coworking: ['coworking', 'espace de travail', 'bureau', 'travail'],
  cultural: ['musée', 'monument', 'temple', 'église', 'culture', 'histoire', 'art', 'galerie'],
  transport: ['taxi', 'transport', 'uber', 'bus', 'métro', 'aéroport'],
  emergency: ['hôpital', 'urgences', 'médecin', 'pharmacie', 'clinique'],
};

export function parseVoiceIntent(transcript: string): VoiceIntent {
  const lower = transcript.toLowerCase().trim();

  let category: PlaceCategory | undefined;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      category = cat as PlaceCategory;
      break;
    }
  }

  let city: string | undefined;
  const cityPrepositions = /\b(à|au|en|near|in|dans)\s+([a-zéèêëàâùûîïôç\s]+)/i;
  const cityMatch = lower.match(cityPrepositions);
  if (cityMatch) {
    const possibleCity = cityMatch[2].trim().split(' ').slice(0, 2).join(' ');
    if (KNOWN_CITIES.some(c => c.includes(possibleCity) || possibleCity.includes(c.split(' ')[0]))) {
      city = possibleCity;
    }
  }

  let priceRange: 'low' | 'high' | undefined;
  if (/pas cher|cheap|économique|budget|abordable/.test(lower)) priceRange = 'low';
  else if (/luxe|premium|cher|haut de gamme|luxury/.test(lower)) priceRange = 'high';

  const useGeolocation = /près de moi|nearby|autour|around me|à côté|proche/.test(lower);

  return { query: transcript, category, city, priceRange, useGeolocation };
}
