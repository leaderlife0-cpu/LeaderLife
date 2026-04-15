import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const PlaceDetailPage = lazy(() => import('@/pages/PlaceDetailPage'));
const SearchResultsPage = lazy(() => import('@/pages/SearchResultsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const AssistantPage = lazy(() => import('@/pages/AssistantPage'));
const CityPage = lazy(() => import('@/pages/CityPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ItineraryPage = lazy(() => import('@/pages/ItineraryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0F0F' }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full animate-spin border-2 border-t-transparent"
          style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }}
        />
        <p className="text-white/35 text-sm">Chargement...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/place/:id" element={<PlaceDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favoris" element={<FavoritesPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/ville/:nom" element={<CityPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/itinerary/new" element={<ItineraryPage />} />
            <Route path="/itinerary/:id" element={<ItineraryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-right" theme="dark" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
