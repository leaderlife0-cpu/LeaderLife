import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { ChatAssistant } from '@/components/chat/ChatAssistant';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const NO_CHAT_PATHS = ['/login', '/signup'];

export function Layout({ children, showFooter = true }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const showChat = !NO_CHAT_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      <main className="pb-16 md:pb-0">{children}</main>
      {showFooter && <Footer />}
      {showChat && <ChatAssistant />}
      <BottomNav />
    </div>
  );
}
