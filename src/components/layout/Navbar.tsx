import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Heart, Menu, X, User, LogOut, Settings, Route } from 'lucide-react';
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
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
        isHome && !scrolled
          ? 'bg-transparent'
          : 'bg-[#12121A]/95 backdrop-blur-xl border-b border-white/10'
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <MapPin size={16} className="text-blue-400" />
          </div>
          <span className="font-bold text-white text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
            Exploraa
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'text-sm transition-colors',
                location.pathname === link.to ? 'text-white font-medium' : 'text-white/60 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            onClick={() => setSearchOpen(prev => !prev)}
          >
            <Search size={18} />
          </Button>

          {/* Favorites */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            onClick={() => navigate('/favoris')}
          >
            <Heart size={18} />
            {favCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-4 w-4 p-0 flex items-center justify-center rounded-full">
                {favCount}
              </Badge>
            )}
          </Button>

          {/* User menu or login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none">
                <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1E1E2E] border-white/10 text-white" align="end">
                <DropdownMenuItem className="hover:bg-white/10" onClick={() => navigate('/profile')}>
                  <User size={14} className="mr-2" /> Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10" onClick={() => navigate('/favoris')}>
                  <Heart size={14} className="mr-2" /> Favoris
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10" onClick={() => navigate('/profile')}>
                  <Settings size={14} className="mr-2" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/10 text-red-400" onClick={signOut}>
                  <LogOut size={14} className="mr-2" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="hidden sm:flex bg-blue-500 hover:bg-blue-600 text-white rounded-full h-8 px-4 text-sm"
            >
              Se connecter
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden text-white/60 hover:text-white p-2 outline-none">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#12121A] border-white/10 text-white">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg text-white/80 hover:text-white flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label === 'Itinéraires' && <Route size={18} />}
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Button
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                  >
                    Se connecter
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-white/10 bg-[#12121A]/95 backdrop-blur-xl px-4 py-3"
          >
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher une ville, un pays, un lieu..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-blue-500/50"
              />
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                <Search size={16} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
