import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Heart, Menu, X, User, LogOut, Settings, Route, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getFavoriteCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/explore', label: 'Explorer' },
    { to: '/assistant', label: 'Assistant IA' },
    { to: '/itinerary/new', label: 'Itinéraires' },
  ];

  const favCount = getFavoriteCount();

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0F0F0F]/95 backdrop-blur-2xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/5'
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
          >
            <MapPin size={15} className="text-white" />
          </div>
          <span
            className="font-bold text-lg gradient-text"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Exploraa
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm px-4 py-2 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-white font-semibold bg-white/8'
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
            onClick={() => setSearchOpen(prev => !prev)}
          >
            <Search size={17} />
          </button>

          {/* Favorites — hidden on mobile (in bottom nav) */}
          <button
            className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center relative text-white/50 hover:text-white hover:bg-white/8 transition-all"
            onClick={() => navigate('/favoris')}
          >
            <Heart size={17} />
            {favCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-white text-[9px] font-bold rounded-full"
                style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }}
              >
                {favCount}
              </span>
            )}
          </button>

          {/* User menu or login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-xl outline-none">
                <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-violet-500/50 transition-all">
                  <AvatarFallback
                    className="text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                  >
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="border-white/10 text-white"
                style={{ background: '#1A1A2E' }}
                align="end"
              >
                <DropdownMenuItem className="hover:bg-white/8 focus:bg-white/8" onClick={() => navigate('/profile')}>
                  <User size={14} className="mr-2 text-violet-400" /> Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/8 focus:bg-white/8" onClick={() => navigate('/favoris')}>
                  <Heart size={14} className="mr-2 text-rose-400" /> Favoris
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/8 focus:bg-white/8" onClick={() => navigate('/profile')}>
                  <Settings size={14} className="mr-2 text-white/50" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/8" />
                <DropdownMenuItem className="hover:bg-white/8 focus:bg-white/8 text-red-400" onClick={signOut}>
                  <LogOut size={14} className="mr-2" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="hidden sm:flex text-white rounded-xl h-8 px-4 text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              Se connecter
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-xl outline-none transition-all">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-white/8 text-white w-72"
              style={{ background: '#0F0F0F' }}
            >
              {/* Mobile menu header */}
              <div className="flex items-center gap-2.5 mb-8 mt-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                >
                  <MapPin size={15} className="text-white" />
                </div>
                <span className="font-bold text-lg gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Exploraa
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map(link => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        'text-base px-4 py-3 rounded-2xl font-medium transition-all flex items-center gap-3',
                        isActive
                          ? 'text-white bg-white/8'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label === 'Itinéraires' && <Route size={18} className="text-violet-400" />}
                      {link.label === 'Assistant IA' && <Sparkles size={18} className="text-violet-400" />}
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {!user && (
                <div className="mt-8 flex flex-col gap-3">
                  <Button
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="text-white rounded-2xl h-11 font-semibold"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                  >
                    Se connecter
                  </Button>
                  <Button
                    onClick={() => { navigate('/signup'); setMobileOpen(false); }}
                    variant="outline"
                    className="border-white/15 text-white hover:bg-white/8 rounded-2xl h-11"
                  >
                    Créer un compte
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/8 px-4 py-3"
            style={{ background: '#0F0F0F' }}
          >
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/6 border border-white/12 rounded-2xl px-4 input-gradient">
                <Search size={15} className="text-white/40 shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une ville, un pays, un lieu..."
                  className="flex-1 bg-transparent py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="text-white rounded-2xl font-semibold"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                <Search size={15} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
