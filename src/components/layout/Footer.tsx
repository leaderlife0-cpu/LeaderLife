import { Link } from 'react-router-dom';
import { MapPin, Globe, MessageCircle, Rss, Play } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A0A0F] border-t border-white/10 py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <MapPin size={16} className="text-blue-400" />
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                LeaderLife
              </span>
            </div>
            <p className="text-white/50 text-sm max-w-xs">
              Découvrez les meilleurs spots du monde entier. Restaurants, hôtels, plages, nightlife — tout en un seul endroit.
            </p>
            <div className="flex gap-3 mt-4">
              {[Globe, MessageCircle, Rss, Play].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Découvrir</h4>
            <div className="flex flex-col gap-2">
              {['Restaurants', 'Hôtels', 'Plages', 'Nightlife', 'Explorer'].map(item => (
                <Link key={item} to="/explore" className="text-white/50 hover:text-white text-sm transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">LeaderLife</h4>
            <div className="flex flex-col gap-2">
              <Link to="/a-propos" className="text-white/50 hover:text-white text-sm transition-colors">À propos</Link>
              <Link to="/assistant" className="text-white/50 hover:text-white text-sm transition-colors">Assistant IA</Link>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">CGU</a>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Confidentialité</a>
              <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © 2026 LeaderLife — Propulsé par Leader
          </p>
          <p className="text-white/30 text-xs">
            Fait avec ❤️ pour les explorateurs du monde
          </p>
        </div>
      </div>
    </footer>
  );
}
