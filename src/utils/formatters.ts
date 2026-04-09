export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `Il y a ${Math.floor(diff / 86400)} j`;
  if (diff < 31536000) return `Il y a ${Math.floor(diff / 2592000)} mois`;
  return `Il y a ${Math.floor(diff / 31536000)} an(s)`;
}

export function isOpenNow(openingHours: Record<string, string> | null): boolean | null {
  if (!openingHours) return null;
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const now = new Date();
  const dayName = days[now.getDay()];
  const hours = openingHours[dayName];
  if (!hours || hours === 'Fermé') return false;
  if (hours === 'Ouvert 24h/24') return true;

  const match = hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const openH = parseInt(match[1]);
  const openM = parseInt(match[2]);
  const closeH = parseInt(match[3]);
  const closeM = parseInt(match[4]);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

export { formatDistance } from '@/utils/distanceCalculator';

export function getPriceLevelFromString(price?: string): 1 | 2 | 3 | 4 {
  if (!price) return 2;
  const count = (price.match(/\$/g) || price.match(/€/g) || []).length;
  if (count >= 4) return 4;
  if (count === 3) return 3;
  if (count === 2) return 2;
  return 1;
}
