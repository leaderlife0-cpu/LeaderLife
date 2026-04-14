import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '@/types';

const STORAGE_KEY = 'exploraa_chat_history';
const MAX_MESSAGES = 50;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "Salut ! 👋 Je suis ton guide Exploraa. Dis-moi où tu veux aller ou ce que tu cherches, et je te trouve les meilleurs spots ! Tu peux aussi me parler en appuyant sur le micro 🎤",
  timestamp: new Date().toISOString(),
};

export function useChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ChatMessage[];
    } catch { /* ignore */ }
    return [WELCOME_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    const toStore = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setHasUnread(false);
      return !prev;
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const hasSupabase = SUPABASE_URL && SUPABASE_URL !== 'https://placeholder.supabase.co';

      if (hasSupabase) {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/chat-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as { reply: string; suggested_places?: ChatMessage['suggested_places'] };

        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
          suggested_places: data.suggested_places,
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Demo mode without Supabase
        await new Promise(r => setTimeout(r, 1000));
        const demoReplies = [
          "Super choix ! Pour **Abidjan**, je te recommande l'Allocodrome de Cocody pour la street food locale — à partir de 1 000 FCFA seulement. L'ambiance le soir est incroyable 🍽️",
          "**Paris** en automne, c'est magique ! Le Bouillon Chartier reste mon coup de cœur pour un repas parisien à moins de 25€. Réserve à l'avance, il y a toujours du monde !",
          "Pour **Dubai**, le JBR Beach est parfait pour profiter de la plage sans se ruiner. Et le soir, White Dubai sur le rooftop pour une vue panoramique inoubliable 🌆",
          "À **Bangkok**, commence par Wat Pho tôt le matin avant la foule. Ensuite, déjeune chez Jay Fai pour la meilleure street food étoilée Michelin du monde !",
        ];
        const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch {
      setError("Oups, je n'ai pas pu répondre. Réessayez !");
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: "Oups, je n'ai pas pu répondre. Réessayez ! 😅",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const clearHistory = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    isOpen,
    error,
    hasUnread,
    toggleChat,
    setIsOpen,
    sendMessage,
    clearHistory,
  };
}
