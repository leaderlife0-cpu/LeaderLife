import { Link } from 'react-router-dom';
import { MapPin, Globe, MessageCircle, Send, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-12 px-4 mt-16" style={{ background: '#0A0A14' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                <MapPin size={16} className="text-white" />
              </div>
              <span
                className="font-bold text-xl gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Exploraa
              </span>
            </div>
            <p className="text-white/45 text-sm max-w-xs leading-relaxed">
              Découvrez le monde, connectez-vous partout. Restaurants, hôtels, plages, nightlife — tout en un seul endroit.
            </p>
            <div className="flex gap-2 mt-5">
              {[Globe, Share2, MessageCircle, Send].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/8 hover:border-violet-500/40 hover:bg-violet-500/10"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Links — Découvrir */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Découvrir
            </h4>
            <div className="flex flex-col gap-2.5">
              {['Restaurants', 'Hôtels', 'Plages', 'Nightlife', 'Explorer'].map(item => (
                <Link
                  key={item}
                  to="/explore"
                  className="text-white/45 hover:text-white text-sm transition-colors hover:text-violet-400"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Links — Exploraa */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Exploraa
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/a-propos" className="text-white/45 hover:text-violet-400 text-sm transition-colors">À propos</Link>
              <Link to="/assistant" className="text-white/45 hover:text-violet-400 text-sm transition-colors">Assistant IA</Link>
              <a href="#" className="text-white/45 hover:text-violet-400 text-sm transition-colors">CGU</a>
              <a href="#" className="text-white/45 hover:text-violet-400 text-sm transition-colors">Confidentialité</a>
              <a href="#" className="text-white/45 hover:text-violet-400 text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/25 text-xs">
            © 2026 Exploraa — Découvrez le monde, connectez-vous partout
          </p>
          <p className="text-white/25 text-xs">
            Fait avec ❤️ pour les explorateurs du monde
          </p>
        </div>
      </div>
    </footer>
  );
}
