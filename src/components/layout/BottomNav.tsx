import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Sparkles, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/explore', icon: Compass, label: 'Explorer' },
  { to: '/assistant', icon: Sparkles, label: 'IA' },
  { to: '/favoris', icon: Heart, label: 'Favoris' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  const location = useLocation();
  const { getFavoriteCount } = useFavorites();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0F0F0F]/95 backdrop-blur-xl border-t border-white/8 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          const isFav = to === '/favoris';
          const count = isFav ? getFavoriteCount() : 0;

          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative min-w-[52px]"
            >
              <div className="relative">
                {isActive ? (
                  <div
                    className="w-6 h-6 flex items-center justify-center"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.7))',
                    }}
                  >
                    <Icon
                      size={22}
                      className="fill-current"
                      style={{ color: '#8B5CF6' }}
                    />
                  </div>
                ) : (
                  <Icon size={22} className="text-white/40" />
                )}
                {count > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }}
                  >
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  isActive ? 'text-violet-400' : 'text-white/35'
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
