import type { Place, PlaceCategory, SerpApiPlace } from '@/types';
import { SERPAPI_CATEGORY_QUERIES } from '@/lib/constants';
import { getPriceLevelFromString } from '@/utils/formatters';

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY as string;
const SERPAPI_BASE = 'https://serpapi.com/search';

export interface SearchPlacesParams {
  query?: string;
  city?: string;
  category?: PlaceCategory;
  ll?: string; // lat,lng for nearby
  limit?: number;
}

export async function searchPlacesViaSerpApi(params: SearchPlacesParams): Promise<Place[]> {
  const { query, city, category, ll, limit = 20 } = params;

  const categoryQuery = category ? SERPAPI_CATEGORY_QUERIES[category] : '';
  const q = [query, categoryQuery, city].filter(Boolean).join(' ');

  const searchParams = new URLSearchParams({
    engine: 'google_maps',
    q,
    api_key: SERPAPI_KEY,
    num: String(limit),
    hl: 'fr',
  });

  if (ll) {
    searchParams.set('ll', ll);
    searchParams.set('zoom', '13');
  }

  const url = `${SERPAPI_BASE}?${searchParams.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`);

  const data = await res.json() as { local_results?: SerpApiPlace[] };
  const results = data.local_results ?? [];

  return results.map(r => serpApiToPlace(r, city, category));
}

export async function getPlaceDetailsViaSerpApi(placeId: string): Promise<Partial<Place>> {
  const searchParams = new URLSearchParams({
    engine: 'google_maps',
    place_id: placeId,
    api_key: SERPAPI_KEY,
  });

  const url = `${SERPAPI_BASE}?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`);

  const data = await res.json() as { place_results?: SerpApiPlace };
  if (!data.place_results) return {};

  return serpApiToPlace(data.place_results);
}

function serpApiToPlace(r: SerpApiPlace, city?: string, category?: PlaceCategory): Place {
  const detectedCategory = category ?? detectCategory(r.types ?? []);

  return {
    id: r.place_id,
    name: r.name,
    description: r.description ?? `${r.type ?? 'Lieu'} avec une note de ${r.rating}/5.`,
    category: detectedCategory,
    latitude: r.gps_coordinates?.latitude ?? 0,
    longitude: r.gps_coordinates?.longitude ?? 0,
    address: r.address ?? '',
    city: city ?? extractCity(r.address ?? ''),
    country: extractCountry(r.address ?? ''),
    country_code: '',
    price_min: null,
    price_max: null,
    currency: 'EUR',
    price_level: getPriceLevelFromString(r.price),
    rating: r.rating ?? 0,
    review_count: r.reviews ?? 0,
    phone: r.phone ?? null,
    website: r.website ?? null,
    whatsapp: null,
    opening_hours: parseHours(r.hours?.hours),
    amenities: [],
    tags: r.types ?? [],
    cover_image_url: r.thumbnail ?? `https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop`,
    images: r.photos ?? (r.thumbnail ? [r.thumbnail] : []),
    is_verified: true,
    is_featured: (r.rating ?? 0) >= 4.5,
    created_at: new Date().toISOString(),
  };
}

function detectCategory(types: string[]): PlaceCategory {
  const typeStr = types.join(' ').toLowerCase();
  if (/restaurant|food|meal|cafe|bar/.test(typeStr)) return 'restaurant';
  if (/hotel|lodging|accommodation/.test(typeStr)) return 'hotel';
  if (/night_club|bar|disco/.test(typeStr)) return 'nightclub';
  if (/beach|park/.test(typeStr)) return 'beach';
  if (/spa|beauty|wellness/.test(typeStr)) return 'spa';
  if (/museum|cultural|monument|church|temple/.test(typeStr)) return 'cultural';
  if (/shopping|store|mall/.test(typeStr)) return 'shopping';
  if (/amusement|entertainment/.test(typeStr)) return 'entertainment';
  return 'entertainment';
}

function extractCity(address: string): string {
  const parts = address.split(',');
  return parts.length >= 2 ? parts[parts.length - 2].trim() : address;
}

function extractCountry(address: string): string {
  const parts = address.split(',');
  return parts.length >= 1 ? parts[parts.length - 1].trim() : '';
}

function parseHours(hours?: string[]): Record<string, string> | null {
  if (!hours || hours.length === 0) return null;
  const days: Record<string, string> = {};
  hours.forEach(h => {
    const parts = h.split(': ');
    if (parts.length === 2) days[parts[0].toLowerCase()] = parts[1];
  });
  return Object.keys(days).length > 0 ? days : null;
}
