import Hero from '../sections/Hero';
import About from '../sections/About';
import ServiceSection from '../sections/ServiceSection';
import Services from '../sections/Services';
import GallerySection from '../sections/GallerySection';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
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
