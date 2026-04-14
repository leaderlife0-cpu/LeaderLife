import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Left visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0d06 0%, #0d1b2e 50%, #1a0d06 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop)', backgroundSize: 'cover' }} />
        <div className="relative z-10 text-center px-8">
          <div className="flex items-center gap-2 justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <MapPin size={24} className="text-orange-400" />
            </div>
            <span className="font-bold text-white text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>Exploraa</span>
          </div>
          <h2 className="text-white text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Rejoignez l'aventure
          </h2>
          <p className="text-white/60 max-w-xs">
            Créez votre compte et commencez à explorer les meilleurs spots du monde avec notre IA voyage.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <MapPin size={20} className="text-blue-400" />
            <span className="font-bold text-white text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>Exploraa</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Créer un compte</h1>
          <p className="text-white/50 text-sm mb-8">Rejoignez notre communauté d'explorateurs</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Nom complet</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Votre prénom et nom" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 pr-10" />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12">
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Button onClick={signInWithGoogle} variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white rounded-xl h-12 gap-2">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Continuer avec Google
          </Button>

          <p className="text-center text-white/50 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-medium">Se connecter</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
