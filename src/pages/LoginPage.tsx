import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Left panel - visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1b2e 0%, #1a0d06 50%, #0d1b2e 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop)', backgroundSize: 'cover' }} />
        <div className="relative z-10 text-center px-8">
          <div className="flex items-center gap-2 justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MapPin size={24} className="text-blue-400" />
            </div>
            <span className="font-bold text-white text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>Exploraa</span>
          </div>
          <h2 className="text-white text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Explorez le monde
          </h2>
          <p className="text-white/60 max-w-xs">
            Rejoignez des milliers d'explorateurs qui découvrent les meilleurs spots partout dans le monde.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <MapPin size={20} className="text-blue-400" />
            <span className="font-bold text-white text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>Exploraa</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Bon retour !</h1>
          <p className="text-white/50 text-sm mb-8">Connectez-vous à votre compte pour continuer</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-blue-400 text-sm hover:underline">Mot de passe oublié ?</a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 text-white rounded-xl h-12 gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Continuer avec Google
          </Button>

          <p className="text-center text-white/50 text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
