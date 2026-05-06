import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "DJ Photography Karaikudi | Best Wedding & Portrait Photographer - Dass",
  description = "Professional photography services in Karaikudi. Specializing in Weddings, Engagements, Pre-wedding, Baby shoots, and Corporate events by Dass. Capturing your timeless moments.",
  keywords = "DJ Photography Karaikudi, Best photographer in Karaikudi, Wedding photography Karaikudi, Dass Photography, Baby shoots Karaikudi, Modeling shoots Tamil Nadu, Pre-wedding photography, Professional portrait photographer",
  image = "https://karaikudidjphotography.com/og-image.jpg",
  url = "https://karaikudidjphotography.com",
  type = "website"
}: SEOProps) {
  const siteName = "DJ Photography Karaikudi";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteName,
    "image": image,
    "@id": url,
    "url": url,
    "telephone": "+918825605403",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Karaikudi",
      "addressLocality": "Karaikudi",
      "addressRegion": "Tamil Nadu",
      "postalCode": "630001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.0748,
      "longitude": 78.7733
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.instagram.com/dj_photography_kkdi"
    ],
    "priceRange": "$$"
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Photography",
    "provider": {
      "@type": "LocalBusiness",
      "name": siteName
    },
    "areaServed": {
      "@type": "State",
      "name": "Tamil Nadu"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Photography Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wedding Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Engagement Shoots" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pre-wedding & Post-wedding Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Baby Shoots & Baby Theme Shoots" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Modeling & Portrait Shoots" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Event Shoots" } }
      ]
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Dass" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
}
