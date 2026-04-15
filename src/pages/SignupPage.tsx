import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 6) { toast.error('Mot de passe trop court (6 caractères minimum).'); return; }
    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Compte créé ! Vérifiez votre email.');
      navigate('/explore');
    } catch {
      toast.error('Erreur lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full border rounded-2xl px-4 py-3.5 text-white placeholder:text-white/25 text-sm focus:outline-none transition-all";
  const inputStyle = { background: 'rgba(26,26,46,0.8)', borderColor: 'rgba(255,255,255,0.1)' };

  return (
    <div className="min-h-screen flex" style={{ background: '#0F0F0F' }}>
      {/* Left visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1a2e 0%, #1a0d2e 50%, #0d1a2e 100%)' }}
      >
        <div
          className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="relative z-10 text-center px-10">
          <div className="flex items-center gap-3 justify-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', boxShadow: '0 8px 32px rgba(236,72,153,0.45)' }}
            >
              <Globe size={26} className="text-white" />
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
            Rejoignez l'aventure
          </h2>
          <p className="text-white/50 max-w-sm text-lg leading-relaxed">
            Créez votre compte et commencez à explorer les meilleurs spots du monde avec notre IA voyage.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { emoji: '🗺️', text: 'Accès à 1M+ lieux dans 195 pays' },
              { emoji: '🤖', text: 'Assistant IA voyage personnalisé' },
              { emoji: '❤️', text: 'Sauvegardez vos lieux préférés' },
              { emoji: '🎤', text: 'Recherche vocale intelligente' },
            ].map(item => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-sm text-white/55 border rounded-xl px-4 py-3"
                style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.15)' }}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 overflow-y-auto">
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
            Créer un compte
          </h1>
          <p className="text-white/40 text-sm mb-8">Rejoignez notre communauté d'explorateurs</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/55 text-sm mb-1.5 block font-medium">Nom complet</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Votre prénom et nom"
                required
                className={inputClass}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label className="text-white/55 text-sm mb-1.5 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className={inputClass}
                style={inputStyle}
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
                  placeholder="Minimum 6 caractères"
                  required
                  className={`${inputClass} pr-12`}
                  style={inputStyle}
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
            <div>
              <label className="text-white/55 text-sm mb-1.5 block font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white rounded-2xl h-12 text-base font-semibold mt-2"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
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
                Continuer avec Google
              </Button>
            </>
          )}

          <p className="text-center text-white/35 text-sm mt-8">
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="font-semibold gradient-text hover:opacity-80 transition-opacity"
            >
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
