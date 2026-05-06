import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import { Loader2 } from 'lucide-react';
import Preloader from './components/Preloader';

const GalleryEvent = lazy(() => import('./pages/GalleryEvent'));
const Admin = lazy(() => import('./pages/Admin'));
const PackageDetails = lazy(() => import('./pages/PackageDetails'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Logic to wait for network/page load
    const handleLoad = () => {
      // Add a small delay for visual smoothness
      setTimeout(() => {
        setIsAppLoading(false);
      }, 1000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback in case load event takes too long
      const fallbackTimer = setTimeout(handleLoad, 5000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isAppLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      <div className={`flex flex-col min-h-screen transition-opacity duration-700 ${isAppLoading ? 'opacity-0' : 'opacity-100'}`}>
        {!isAdmin && <Navbar />}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery/:slug" element={<GalleryEvent />} />
              <Route path="/package/:id" element={<PackageDetails />} />
              <Route path="/service/:id" element={<ServiceDetails />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
