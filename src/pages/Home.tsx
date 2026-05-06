import Hero from '../sections/Hero';
import About from '../sections/About';
import ServiceSection from '../sections/ServiceSection';
import Services from '../sections/Services';
import GallerySection from '../sections/GallerySection';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <h1 className="sr-only">DJ Photography Karaikudi - Best Wedding, Baby & Event Photographer in Karaikudi by Dass</h1>
      <p className="sr-only">
        Looking for the best photographer in Karaikudi? DJ Photography by Dass offers professional Wedding, Engagement, Pre-wedding, 
        Baby theme shoots, Modeling, and Corporate event photography. Top-rated photography services in Tamil Nadu.
      </p>
      <Hero />
      <About />
      <ServiceSection />
      <Services />
      <GallerySection />
      <Testimonials />
      <Contact />
    </>
  );
}
