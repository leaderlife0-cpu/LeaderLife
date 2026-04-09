import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <MapPinOff size={40} className="text-white/30" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>404</h1>
          <h2 className="text-xl font-semibold text-white mb-3">Cette page n'existe pas</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            La page que vous cherchez semble avoir disparu, comme un spot secret qu'on n'a pas encore découvert.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
