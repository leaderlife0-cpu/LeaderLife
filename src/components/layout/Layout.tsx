import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChatAssistant } from '@/components/chat/ChatAssistant';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const NO_CHAT_PATHS = ['/login', '/signup'];

export function Layout({ children, showFooter = true }: LayoutProps) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const showChat = !NO_CHAT_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
      {showChat && <ChatAssistant />}
    </div>
  );
}
