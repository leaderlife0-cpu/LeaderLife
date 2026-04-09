import { useState, useCallback } from 'react';
import { haversineDistance } from '@/utils/distanceCalculator';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
  });

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Géolocalisation non supportée par ce navigateur' }));
      return;
    }
    setState(s => ({ ...s, isLoading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (err) => {
        setState(s => ({ ...s, error: err.message, isLoading: false }));
      }
    );
  }, []);

  const getDistanceTo = useCallback((lat: number, lng: number): number | null => {
    if (state.latitude === null || state.longitude === null) return null;
    return haversineDistance(state.latitude, state.longitude, lat, lng);
  }, [state.latitude, state.longitude]);

  return { ...state, refresh, getDistanceTo };
}
