import type { CategoryConfig } from '@/types';

export const CATEGORIES: CategoryConfig[] = [
  { key: 'restaurant', label: 'Restaurants', emoji: '🍽️', color: 'orange', markerColor: '#FF6D00' },
  { key: 'hotel', label: 'Hôtels', emoji: '🏨', color: 'blue', markerColor: '#2196F3' },
  { key: 'nightclub', label: 'Nightlife', emoji: '🎶', color: 'purple', markerColor: '#9C27B0' },
  { key: 'beach', label: 'Plages', emoji: '🏖️', color: 'cyan', markerColor: '#00BCD4' },
  { key: 'airbnb', label: 'Airbnb', emoji: '🏠', color: 'green', markerColor: '#4CAF50' },
  { key: 'entertainment', label: 'Loisirs', emoji: '🎯', color: 'yellow', markerColor: '#FFC107' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: 'pink', markerColor: '#E91E63' },
  { key: 'spa', label: 'Bien-être', emoji: '💆', color: 'teal', markerColor: '#009688' },
  { key: 'coworking', label: 'Coworking', emoji: '💻', color: 'indigo', markerColor: '#3F51B5' },
  { key: 'cultural', label: 'Culture', emoji: '🏛️', color: 'amber', markerColor: '#FF8F00' },
  { key: 'transport', label: 'Transport', emoji: '🚕', color: 'gray', markerColor: '#607D8B' },
  { key: 'emergency', label: 'Urgences', emoji: '🏥', color: 'red', markerColor: '#F44336' },
];

export const getCategoryConfig = (key: string): CategoryConfig => {
  return CATEGORIES.find(c => c.key === key) ?? CATEGORIES[0];
};

export const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro', rateToEur: 1 },
  { code: 'USD', symbol: '$', name: 'Dollar américain', rateToEur: 0.92 },
  { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA', rateToEur: 0.00152 },
  { code: 'GBP', symbol: '£', name: 'Livre sterling', rateToEur: 1.17 },
  { code: 'AED', symbol: 'AED', name: 'Dirham émirati', rateToEur: 0.25 },
  { code: 'THB', symbol: '฿', name: 'Baht thaïlandais', rateToEur: 0.026 },
  { code: 'MAD', symbol: 'MAD', name: 'Dirham marocain', rateToEur: 0.094 },
];

export const PRICE_LABELS: Record<number, string> = {
  1: '€',
  2: '€€',
  3: '€€€',
  4: '€€€€',
};

export const POPULAR_CITIES = [
  { name: 'Abidjan', country: "Côte d'Ivoire", country_code: 'CI', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', count: 127 },
  { name: 'Paris', country: 'France', country_code: 'FR', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop', count: 342 },
  { name: 'Dubai', country: 'Émirats Arabes Unis', country_code: 'AE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop', count: 289 },
  { name: 'New York', country: 'États-Unis', country_code: 'US', image: 'https://images.unsplash.com/photo-1546436836-07a91091f160?w=600&h=400&fit=crop', count: 415 },
  { name: 'Bangkok', country: 'Thaïlande', country_code: 'TH', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', count: 198 },
  { name: 'Marrakech', country: 'Maroc', country_code: 'MA', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f0b?w=600&h=400&fit=crop', count: 156 },
  { name: 'Bali', country: 'Indonésie', country_code: 'ID', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop', count: 203 },
  { name: 'Barcelone', country: 'Espagne', country_code: 'ES', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop', count: 267 },
];

export const SERPAPI_CATEGORY_QUERIES: Record<string, string> = {
  restaurant: 'restaurants',
  hotel: 'hotels',
  nightclub: 'nightclub bar',
  beach: 'beach plage',
  airbnb: 'vacation rental airbnb',
  entertainment: 'entertainment activities',
  shopping: 'shopping mall market',
  spa: 'spa wellness massage',
  coworking: 'coworking space',
  cultural: 'museum monument cultural site',
  transport: 'transport taxi',
  emergency: 'hospital emergency clinic',
};

export const KNOWN_CITIES = [
  'abidjan', 'paris', 'dubai', 'new york', 'bangkok', 'marrakech',
  'bali', 'barcelone', 'london', 'tokyo', 'rome', 'amsterdam',
  'berlin', 'madrid', 'istanbul', 'cairo', 'nairobi', 'lagos',
  'dakar', 'casablanca', 'tunis', 'accra', 'douala',
  'los angeles', 'miami', 'chicago', 'toronto', 'mexico city',
  'singapore', 'hong kong', 'seoul', 'mumbai', 'delhi',
];
