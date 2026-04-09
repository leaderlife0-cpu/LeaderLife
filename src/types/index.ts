export type PlaceCategory =
  | 'restaurant' | 'hotel' | 'nightclub' | 'beach'
  | 'airbnb' | 'entertainment' | 'shopping' | 'spa'
  | 'coworking' | 'cultural' | 'transport' | 'emergency';

export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  country_code: string;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  price_level: 1 | 2 | 3 | 4;
  rating: number;
  review_count: number;
  phone: string | null;
  website: string | null;
  whatsapp: string | null;
  opening_hours: Record<string, string> | null;
  amenities: string[];
  tags: string[];
  cover_image_url: string;
  images: string[];
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
  comment: string;
  images: string[];
  helpful_count: number;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string };
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  preferred_currency: string;
  preferred_language: string;
  bio: string | null;
  country: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  list_name: string;
  created_at: string;
  places?: Place;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  places_list: Array<{ place_id: string; order: number; notes: string }>;
  is_public: boolean;
  likes_count: number;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggested_places?: Array<{ id: string; name: string; category: PlaceCategory; city: string }>;
}

export interface VoiceIntent {
  query: string;
  category?: PlaceCategory;
  city?: string;
  priceRange?: 'low' | 'high';
  useGeolocation?: boolean;
}

export interface CategoryConfig {
  key: PlaceCategory;
  label: string;
  emoji: string;
  color: string;
  markerColor: string;
}

export interface SerpApiPlace {
  place_id: string;
  name: string;
  rating: number;
  reviews: number;
  type: string;
  types: string[];
  address: string;
  phone?: string;
  website?: string;
  hours?: {
    open_now?: boolean;
    hours?: string[];
  };
  price?: string;
  description?: string;
  thumbnail?: string;
  photos?: string[];
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PlaceFilters {
  category?: PlaceCategory;
  city?: string;
  country?: string;
  price_level?: number;
  min_rating?: number;
  sort_by?: 'rating' | 'price_asc' | 'price_desc' | 'distance' | 'relevance';
  limit?: number;
  offset?: number;
  query?: string;
}
