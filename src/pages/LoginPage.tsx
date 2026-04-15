import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/explore';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success('Connexion réussie !');
      navigate(from);
    } catch {
      toast.error('Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0F0F0F' }}>
      {/* Left panel — visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0d2e 0%, #0d1a3e 50%, #1a0d2e 100%)' }}
      >
        {/* Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="relative z-10 text-center px-10">
          <div className="flex items-center gap-3 justify-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', boxShadow: '0 8px 32px rgba(139,92,246,0.5)' }}
            >
              <MapPin size={26} className="text-white" />
            </div>
            <span
              className="font-bold text-3xl gradient-text"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Exploraa
            </span>
          </div>
          <h2
            className="text-white text-4xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Explorez le monde
          </h2>
          <p className="text-white/50 max-w-sm text-lg leading-relaxed">
            Rejoignez des milliers d'explorateurs qui découvrent les meilleurs spots partout dans le monde.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {['195+ pays', 'IA voyage', 'Recherche vocale', '1M+ lieux'].map(f => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full text-sm text-white/60 border border-white/10"
                style={{ background: 'rgba(139,92,246,0.1)' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              <MapPin size={18} className="text-white" />
            </div>
            <span
              className="font-bold text-2xl gradient-text"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Exploraa
            </span>
          </div>

          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Bon retour ! 👋
          </h1>
          <p className="text-white/40 text-sm mb-8">Connectez-vous à votre compte pour continuer</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/55 text-sm mb-1.5 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full border rounded-2xl px-4 py-3.5 text-white placeholder:text-white/25 text-sm focus:outline-none transition-all"
                style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label className="text-white/55 text-sm mb-1.5 block font-medium">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border rounded-2xl px-4 py-3.5 pr-12 text-white placeholder:text-white/25 text-sm focus:outline-none transition-all"
                  style={{ background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white rounded-2xl h-12 text-base font-semibold mt-2"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {signInWithGoogle && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-white/30 text-xs">ou</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/12 text-white hover:bg-white/6 rounded-2xl h-12 font-medium"
                onClick={() => signInWithGoogle()}
              >
                <Sparkles size={16} className="mr-2 text-violet-400" />
                Continuer avec Google
              </Button>
            </>
          )}

          <p className="text-center text-white/35 text-sm mt-8">
            Pas encore de compte ?{' '}
            <Link
              to="/signup"
              className="font-semibold gradient-text hover:opacity-80 transition-opacity"
            >
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
