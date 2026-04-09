import { useQuery } from '@tanstack/react-query';
import type { Place, PlaceFilters } from '@/types';
import { SEED_PLACES } from '@/data/seedPlaces';
import { searchPlacesViaSerpApi } from '@/lib/serpapi';

function filterSeedPlaces(places: Place[], filters: PlaceFilters): Place[] {
  let result = [...places];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }

  if (filters.city) {
    const city = filters.city.toLowerCase();
    result = result.filter(p => p.city.toLowerCase().includes(city));
  }

  if (filters.country) {
    const country = filters.country.toLowerCase();
    result = result.filter(p => p.country.toLowerCase().includes(country));
  }

  if (filters.price_level) {
    result = result.filter(p => p.price_level <= (filters.price_level ?? 4));
  }

  if (filters.min_rating) {
    result = result.filter(p => p.rating >= (filters.min_rating ?? 0));
  }

  switch (filters.sort_by) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'price_asc':
      result.sort((a, b) => (a.price_level ?? 1) - (b.price_level ?? 1));
      break;
    case 'price_desc':
      result.sort((a, b) => (b.price_level ?? 1) - (a.price_level ?? 1));
      break;
    default:
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 50;
  return result.slice(offset, offset + limit);
}

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY as string;
const hasSerpApi = Boolean(SERPAPI_KEY && SERPAPI_KEY !== 'your_serpapi_key');

export function usePlaces(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: ['places', filters],
    queryFn: async (): Promise<Place[]> => {
      if (hasSerpApi && (filters.query || filters.city || filters.category)) {
        try {
          const serpResults = await searchPlacesViaSerpApi({
            query: filters.query,
            city: filters.city,
            category: filters.category,
            limit: filters.limit ?? 20,
          });
          return serpResults;
        } catch {
          return filterSeedPlaces(SEED_PLACES, filters);
        }
      }
      return filterSeedPlaces(SEED_PLACES, filters);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaceById(id: string) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async (): Promise<Place | null> => {
      const seed = SEED_PLACES.find(p => p.id === id);
      if (seed) return seed;
      return null;
    },
    enabled: Boolean(id),
  });
}

export function useFeaturedPlaces() {
  return useQuery({
    queryKey: ['places', 'featured'],
    queryFn: async (): Promise<Place[]> => {
      return SEED_PLACES.filter(p => p.is_featured);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useNearbyPlaces(lat: number | null, lng: number | null, radiusKm = 50) {
  return useQuery({
    queryKey: ['places', 'nearby', lat, lng, radiusKm],
    queryFn: async (): Promise<Place[]> => {
      if (lat === null || lng === null) return [];
      if (hasSerpApi) {
        try {
          return await searchPlacesViaSerpApi({
            ll: `@${lat},${lng},14z`,
            limit: 20,
          });
        } catch {
          // fallback below
        }
      }
      return SEED_PLACES.slice(0, 10);
    },
    enabled: lat !== null && lng !== null,
    staleTime: 5 * 60 * 1000,
  });
}
