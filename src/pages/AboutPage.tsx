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
    color: '#EF4444',
  },
  {
    icon: Zap,
    title: 'Innovation IA',
    description: 'Notre assistant intelligent analyse des millions de données pour vous recommander des lieux parfaitement adaptés à vos envies.',
    color: '#2196F3',
  },
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'Chaque lieu est vérifié et chaque avis est modéré. Vous pouvez faire confiance à nos recommandations les yeux fermés.',
    color: '#4CAF50',
  },
  {
    icon: Globe,
    title: 'Sans frontières',
    description: 'Restaurants à Abidjan, hôtels à Dubai, plages à Bali — Exploraa couvre le monde entier sans exception.',
    color: '#FF6D00',
  },
];

const TEAM = [
  {
    name: 'Leader',
    role: 'Fondateur & CEO',
    bio: 'Visionnaire et explorateur passionné, Leader a créé Exploraa pour partager sa passion des découvertes avec le monde entier.',
    avatar: '👑',
    color: '#2196F3',
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
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #0A0A0F 0%, #0d1b2e 40%, #1a0a1e 70%, #0A0A0F 100%)',
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-orange-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <MapPin size={30} className="text-blue-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            À propos de{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Exploraa
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed"
          >
            La plateforme qui connecte les explorateurs aux meilleurs endroits du monde.
            Restaurants, hôtels, plages, culture — tout en un seul endroit.
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
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
            >
              <stat.icon size={22} className="text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
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
          className="bg-gradient-to-br from-blue-500/10 to-orange-500/5 border border-blue-500/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <Sparkles size={32} className="text-blue-400 mx-auto mb-4" />
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Notre Mission
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
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
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Nos valeurs
          </h2>
          <p className="text-white/50">Ce qui guide chaque décision que nous prenons.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VALEURS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${v.color}20`, border: `1px solid ${v.color}30` }}
              >
                <v.icon size={22} style={{ color: v.color }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{v.description}</p>
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
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Notre histoire
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
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
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center z-10 relative">
                    <span className="text-blue-400 text-xs font-bold">{item.year.slice(2)}</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
                  <div className="text-blue-400 text-xs font-medium mb-1">{item.year}</div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
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
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            L'équipe
          </h2>
          <p className="text-white/50">Les personnes derrière Exploraa.</p>
        </motion.div>

        <div className="flex justify-center">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-sm w-full hover:border-white/20 transition-colors"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 border"
                style={{ background: `${member.color}15`, borderColor: `${member.color}30` }}
              >
                {member.avatar}
              </div>
              <h3 className="text-white font-bold text-xl mb-1">{member.name}</h3>
              <p className="text-blue-400 text-sm font-medium mb-3">{member.role}</p>
              <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
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
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Nous contacter
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Une question, une suggestion, un partenariat ? Notre équipe est là pour vous.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 gap-2"
            >
              <Mail size={16} /> Envoyer un email
            </Button>
            <Button
              onClick={() => navigate('/assistant')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 gap-2"
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
          className="rounded-3xl overflow-hidden p-10 text-center relative border border-blue-500/20"
          style={{ background: 'linear-gradient(135deg, #1E3A8A20, #2196F330)' }}
        >
          <h2
            className="text-2xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Prêt à explorer avec nous ?
          </h2>
          <p className="text-white/60 mb-6">
            Rejoignez 250 000 explorateurs qui découvrent le monde avec Exploraa.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/explore')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-10 py-3 text-base"
            >
              Explorer maintenant
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 py-3 text-base"
            >
              Créer un compte gratuit
            </Button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}
