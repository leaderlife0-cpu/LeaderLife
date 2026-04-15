import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage, Place } from '@/types';
import { SEED_PLACES } from '@/data/seedPlaces';

const STORAGE_KEY = 'exploraa_chat_history';
const MAX_MESSAGES = 50;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "Salut ! 👋 Je suis ton guide Exploraa. Dis-moi où tu veux aller ou ce que tu cherches, et je te trouve les meilleurs spots ! Tu peux aussi me parler en appuyant sur le micro 🎤",
  timestamp: new Date().toISOString(),
};

// ─── Local AI Engine ──────────────────────────────────────────────────────────

const CITY_ALIASES: Record<string, string[]> = {
  abidjan: ['abidjan', 'abj', 'cocody', 'marcory', 'treichville', 'yopougon', 'ivory', 'ivoire', "côte d'ivoire", 'cote ivoire'],
  paris: ['paris', 'île-de-france', 'ile de france', 'idf', 'parisien', 'parisienne'],
  dubai: ['dubai', 'dubaï', 'dxb', 'emirats', 'émirats', 'uae', 'abu dhabi'],
  newyork: ['new york', 'new-york', 'nyc', 'manhattan', 'brooklyn', 'états-unis', 'etats-unis', 'usa'],
  bangkok: ['bangkok', 'bkk', 'thaïlande', 'thailande', 'thai'],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  restaurant: ['restaurant', 'resto', 'manger', 'dîner', 'déjeuner', 'dejeuner', 'nourriture', 'food', 'cuisine', 'repas', 'gastronomie', 'bouffe', 'table', 'bistrot', 'brasserie', 'street food', 'alloco'],
  hotel: ['hôtel', 'hotel', 'hébergement', 'hebergement', 'dormir', 'nuit', 'chambre', 'suite', 'séjour', 'sejour', 'lodge', 'palace', 'resort'],
  nightclub: ['club', 'boîte', 'boite', 'sortir', 'soirée', 'soiree', 'nightlife', 'nuit', 'dj', 'danser', 'danse', 'bar', 'fête', 'fete', 'ambiance'],
  beach: ['plage', 'beach', 'mer', 'sable', 'baignade', 'bain de soleil', 'palmiers', 'côte', 'cote', 'littoral'],
  airbnb: ['airbnb', 'appartement', 'villa', 'location', 'louer', 'maison', 'logement', 'privatif', 'privé', 'prive'],
  entertainment: ['divertissement', 'activité', 'activite', 'parc', 'musée', 'musee', 'visite', 'explorer', 'découvrir', 'decouvrir', 'nature', 'randonnée', 'randonnee', 'zoo', 'attraction'],
  shopping: ['shopping', 'acheter', 'marché', 'marche', 'boutique', 'magasin', 'mode', 'vêtements', 'vetements', 'souvenirs', 'mall', 'centre commercial'],
  spa: ['spa', 'massage', 'bien-être', 'bien etre', 'détente', 'detente', 'relaxation', 'hammam', 'soins', 'beauté', 'beaute'],
  coworking: ['coworking', 'co-working', 'travail', 'bureau', 'télétravail', 'teletravail', 'espace de travail', 'nomade', 'freelance'],
  cultural: ['musée', 'musee', 'culture', 'histoire', 'monument', 'patrimoine', 'art', 'exposition', 'visite'],
};

const PRICE_KEYWORDS = {
  low: ['pas cher', 'pas chère', 'économique', 'economique', 'budget', 'abordable', 'bon marché', 'bon marche', 'petit prix', 'low cost', 'gratuit', 'cheap'],
  high: ['luxe', 'luxueux', 'haut de gamme', 'premium', 'gastronomique', 'palace', 'étoilé', 'etoile', 'vip', 'exclusif', '5 étoiles', '5 etoiles', 'cher', 'très bien'],
};

function normalise(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

function detectCity(query: string): string | null {
  const q = normalise(query);
  for (const [city, aliases] of Object.entries(CITY_ALIASES)) {
    if (aliases.some(a => q.includes(normalise(a)))) return city;
  }
  return null;
}

function detectCategory(query: string): string | null {
  const q = normalise(query);
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => q.includes(normalise(k)))) return cat;
  }
  return null;
}

function detectPrice(query: string): 'low' | 'high' | null {
  const q = normalise(query);
  if (PRICE_KEYWORDS.low.some(k => q.includes(normalise(k)))) return 'low';
  if (PRICE_KEYWORDS.high.some(k => q.includes(normalise(k)))) return 'high';
  return null;
}

function searchPlaces(query: string): Place[] {
  const q = normalise(query);
  const cityKey = detectCity(query);
  const categoryKey = detectCategory(query);
  const priceKey = detectPrice(query);

  let results = SEED_PLACES.filter(p => {
    const cityMatch = !cityKey || CITY_ALIASES[cityKey]?.some(a => normalise(p.city).includes(normalise(a))) || normalise(p.city).includes(cityKey);
    const catMatch = !categoryKey || p.category === categoryKey;
    const priceMatch =
      !priceKey ||
      (priceKey === 'low' && (p.price_level ?? 2) <= 2) ||
      (priceKey === 'high' && (p.price_level ?? 2) >= 3);
    return cityMatch && catMatch && priceMatch;
  });

  // If too restrictive, relax
  if (results.length === 0 && categoryKey) {
    results = SEED_PLACES.filter(p => p.category === categoryKey);
  }
  if (results.length === 0) {
    // Full-text fallback on name/description/tags
    const words = q.split(/\s+/).filter(w => w.length > 3);
    results = SEED_PLACES.filter(p => {
      const haystack = normalise(`${p.name} ${p.description} ${p.tags.join(' ')} ${p.city} ${p.country}`);
      return words.some(w => haystack.includes(w));
    });
  }

  // Sort: featured first, then by rating
  results.sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return b.rating - a.rating;
  });

  return results.slice(0, 4);
}

function formatPrice(p: Place): string {
  if (p.price_min === null || p.price_max === null) return '';
  if (p.price_min === 0 && p.price_max === 0) return '(gratuit)';
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
  return `(${fmt(p.price_min)}–${fmt(p.price_max)} ${p.currency})`;
}

function buildLocalReply(query: string, places: Place[]): string {
  const cityKey = detectCity(query);
  const categoryKey = detectCategory(query);
  const priceKey = detectPrice(query);

  const cityLabel = cityKey
    ? { abidjan: 'Abidjan', paris: 'Paris', dubai: 'Dubaï', newyork: 'New York', bangkok: 'Bangkok' }[cityKey] ?? cityKey
    : null;

  const catLabel = categoryKey
    ? ({
        restaurant: 'restaurants', hotel: 'hôtels', nightclub: 'clubs & bars',
        beach: 'plages', airbnb: 'locations', entertainment: 'activités',
        shopping: 'shopping', spa: 'spas & bien-être', coworking: 'espaces de coworking',
        cultural: 'sites culturels', transport: 'transports', emergency: 'urgences',
      }[categoryKey] ?? categoryKey)
    : null;

  if (places.length === 0) {
    return "Désolé, je n'ai pas trouvé de lieu correspondant à ta recherche pour l'instant. Essaie de reformuler ou de préciser la ville (Abidjan, Paris, Dubaï, New York, Bangkok).";
  }

  const introCity = cityLabel ? ` à **${cityLabel}**` : '';
  const introCat = catLabel ? ` parmi les ${catLabel}` : '';
  const priceNote = priceKey === 'low' ? ' (bon budget)' : priceKey === 'high' ? ' (haut de gamme)' : '';
  let reply = `Voici mes meilleures recommandations${introCity}${introCat}${priceNote} :\n\n`;

  places.forEach((p, i) => {
    const stars = '⭐'.repeat(Math.round(p.rating));
    const price = formatPrice(p);
    reply += `**${i + 1}. ${p.name}** ${stars} (${p.rating}/5)\n`;
    reply += `📍 ${p.address}\n`;
    if (price) reply += `💰 ${price}\n`;
    // Short description (first sentence only)
    const shortDesc = p.description.split('.')[0] + '.';
    reply += `_${shortDesc}_\n\n`;
  });

  const tips: Record<string, string> = {
    abidjan: "💡 Conseil : à Abidjan, préfère les paiements en mobile money (MTN/Orange Money).",
    paris: "💡 Conseil : à Paris, réserve à l'avance, surtout le week-end.",
    dubai: "💡 Conseil : à Dubaï, respecte le dress code et évite les heures les plus chaudes l'été.",
    newyork: "💡 Conseil : à New York, le subway est le moyen le plus rapide pour se déplacer.",
    bangkok: "💡 Conseil : à Bangkok, visite les temples tôt le matin pour éviter la chaleur et la foule.",
  };

  if (cityKey && tips[cityKey]) {
    reply += tips[cityKey];
  }

  return reply;
}

function generateResponse(query: string): { content: string; suggested_places: ChatMessage['suggested_places'] } {
  const places = searchPlaces(query);
  const content = buildLocalReply(query, places);
  const suggested_places = places.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    city: p.city,
  }));
  return { content, suggested_places };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ChatMessage[];
    } catch { /* ignore */ }
    return [WELCOME_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    const toStore = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setHasUnread(false);
      return !prev;
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const hasSupabase =
        SUPABASE_URL &&
        SUPABASE_URL !== 'https://placeholder.supabase.co' &&
        SUPABASE_ANON_KEY &&
        SUPABASE_ANON_KEY !== 'placeholder';

      if (hasSupabase) {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/chat-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as { reply: string; suggested_places?: ChatMessage['suggested_places'] };

        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
          suggested_places: data.suggested_places,
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Local AI mode — uses SEED_PLACES data
        await new Promise(r => setTimeout(r, 600));
        const { content: reply, suggested_places } = generateResponse(userMsg.content);
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          suggested_places,
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch {
      setError("Oups, je n'ai pas pu répondre. Réessayez !");
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: "Oups, je n'ai pas pu répondre. Réessayez ! 😅",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const clearHistory = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    isOpen,
    error,
    hasUnread,
    toggleChat,
    setIsOpen,
    sendMessage,
    clearHistory,
  };
}
