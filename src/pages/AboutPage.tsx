import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Globe, Heart, Star, Zap, Shield, Users, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

const STATS = [
  { value: '195+', label: 'Pays couverts', icon: Globe },
  { value: '1M+', label: 'Lieux référencés', icon: MapPin },
  { value: '500K+', label: 'Avis collectés', icon: Star },
  { value: '250K+', label: 'Explorateurs', icon: Users },
];

const VALEURS = [
  {
    icon: Heart,
    title: 'Passion du voyage',
    description: 'Nous croyons que chaque voyage transforme. Exploraa est né pour rendre accessible les meilleurs endroits du monde à tous.',
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    glow: 'rgba(236,72,153,0.2)',
  },
  {
    icon: Zap,
    title: 'Innovation IA',
    description: 'Notre assistant intelligent analyse des millions de données pour vous recommander des lieux parfaitement adaptés à vos envies.',
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    glow: 'rgba(139,92,246,0.2)',
  },
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'Chaque lieu est vérifié et chaque avis est modéré. Vous pouvez faire confiance à nos recommandations les yeux fermés.',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    glow: 'rgba(16,185,129,0.2)',
  },
  {
    icon: Globe,
    title: 'Sans frontières',
    description: 'Restaurants à Abidjan, hôtels à Dubai, plages à Bali — Exploraa couvre le monde entier sans exception.',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    glow: 'rgba(245,158,11,0.2)',
  },
];

const TEAM = [
  {
    name: 'Leader',
    role: 'Fondateur & CEO',
    bio: 'Visionnaire et explorateur passionné, Leader a créé Exploraa pour partager sa passion des découvertes avec le monde entier.',
    avatar: '👑',
    gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
  },
];

const TIMELINE = [
  { year: '2023', title: 'Idée initiale', desc: 'Naissance du concept Exploraa lors d\'un voyage à Abidjan.' },
  { year: '2024', title: 'Développement', desc: 'Lancement de la plateforme avec les premières villes africaines.' },
  { year: '2025', title: 'Expansion', desc: 'Ajout de l\'IA, de la recherche vocale, et couverture de 195+ pays.' },
  { year: '2026', title: 'Aujourd\'hui', desc: 'Exploraa devient la référence pour les explorateurs du monde.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 -z-10 animate-gradient"
          style={{
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1a0d2e 40%, #0d1a2e 70%, #0F0F0F 100%)',
            backgroundSize: '400% 400%',
          }}
        />
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', boxShadow: '0 12px 40px rgba(139,92,246,0.5)' }}
            >
              <MapPin size={30} className="text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            À propos d'
            <span className="gradient-text">Exploraa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl leading-relaxed"
          >
            La plateforme qui connecte les explorateurs aux meilleurs endroits du monde.
            <br />Découvrez le monde, connectez-vous partout.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border rounded-2xl p-5 text-center"
              style={{ background: 'rgba(22,33,62,0.7)', borderColor: 'rgba(139,92,246,0.15)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))' }}
              >
                <stat.icon size={18} className="text-violet-400" />
              </div>
              <div
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05))',
            borderColor: 'rgba(139,92,246,0.2)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
          >
            <Sparkles size={26} className="text-white" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Notre Mission
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Rendre la découverte du monde accessible à tous. Que vous soyez à Abidjan, Paris, Dubai
            ou New York, Exploraa vous guide vers les expériences les plus authentiques et les plus
            mémorables — grâce à l'intelligence artificielle et à une communauté de passionnés.
          </p>
        </motion.div>
      </section>

      {/* Valeurs */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Nos valeurs
          </h2>
          <p className="text-white/40">Ce qui guide chaque décision que nous prenons.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VALEURS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border rounded-2xl p-6 hover:border-violet-500/25 transition-all"
              style={{ background: 'rgba(22,33,62,0.6)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: v.gradient, boxShadow: `0 8px 24px ${v.glow}` }}
              >
                <v.icon size={22} className="text-white" />
              </div>
              <h3
                className="text-white font-bold text-lg mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {v.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Notre histoire
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #8B5CF6, #EC4899)' }} />
          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start pl-4"
              >
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center z-10 relative"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}
                  >
                    <span className="text-white text-xs font-bold">{item.year.slice(2)}</span>
                  </div>
                </div>
                <div
                  className="border rounded-2xl p-4 flex-1"
                  style={{ background: 'rgba(22,33,62,0.6)', borderColor: 'rgba(139,92,246,0.12)' }}
                >
                  <div
                    className="text-xs font-semibold mb-1 gradient-text"
                  >
                    {item.year}
                  </div>
                  <h3
                    className="text-white font-semibold mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/45 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            L'équipe
          </h2>
          <p className="text-white/40">Les personnes derrière Exploraa.</p>
        </motion.div>

        <div className="flex justify-center">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border rounded-2xl p-8 text-center max-w-sm w-full hover:border-violet-500/30 transition-all"
              style={{ background: 'rgba(22,33,62,0.6)', borderColor: 'rgba(139,92,246,0.12)' }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
                style={{ background: member.gradient, boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}
              >
                {member.avatar}
              </div>
              <h3
                className="text-white font-bold text-xl mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {member.name}
              </h3>
              <p className="gradient-text text-sm font-semibold mb-3">{member.role}</p>
              <p className="text-white/55 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border rounded-3xl p-8 md:p-12 text-center"
          style={{ background: 'rgba(22,33,62,0.5)', borderColor: 'rgba(139,92,246,0.15)' }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Nous contacter
          </h2>
          <p className="text-white/45 mb-8 max-w-md mx-auto">
            Une question, une suggestion, un partenariat ? Notre équipe est là pour vous.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              className="text-white rounded-2xl px-8 gap-2 font-semibold"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              <Mail size={16} /> Envoyer un email
            </Button>
            <Button
              onClick={() => navigate('/assistant')}
              variant="outline"
              className="border-white/15 text-white hover:bg-white/8 rounded-2xl px-8 gap-2"
            >
              <MessageCircle size={16} /> Parler à l'IA
            </Button>
          </div>
        </motion.div>
      </section>

      {/* CTA final */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 pb-16"
      >
        <div
          className="rounded-3xl overflow-hidden p-10 text-center relative border"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.08))',
            borderColor: 'rgba(139,92,246,0.2)',
          }}
        >
          <h2
            className="text-2xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Prêt à explorer avec nous ?
          </h2>
          <p className="text-white/50 mb-6">
            Rejoignez 250 000 explorateurs qui découvrent le monde avec Exploraa.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/explore')}
              className="text-white rounded-2xl px-10 py-3 text-base font-semibold"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              Explorer maintenant
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="border-white/15 text-white hover:bg-white/8 rounded-2xl px-10 py-3 text-base"
            >
              Créer un compte gratuit
            </Button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}
