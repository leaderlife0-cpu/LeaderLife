import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'leaderlife_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((placeId: string) => favorites.includes(placeId), [favorites]);

  const toggleFavorite = useCallback((placeId: string) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  }, []);

  const getFavoriteCount = () => favorites.length;

  return { favorites, isFavorite, toggleFavorite, getFavoriteCount };
}
