export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  category: string;
  date: string;
  location: string;
  coverImage: string;
  images: GalleryImage[];
}

export const events: Event[] = [
  {
    id: '1',
    slug: 'vignesh-wedding',
    name: 'Vignesh & Priya Wedding',
    category: 'Wedding',
    date: 'March 2024',
    location: 'Karaikudi',
    coverImage: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id: '1-1', src: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Wedding ceremony', width: 1200, height: 800 },
      { id: '1-2', src: 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Couple portrait', width: 1200, height: 900 },
      { id: '1-3', src: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Wedding reception', width: 1200, height: 750 },
      { id: '1-4', src: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Bridal details', width: 1200, height: 1000 },
      { id: '1-5', src: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Ceremony moment', width: 1200, height: 800 },
      { id: '1-6', src: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Family portrait', width: 1200, height: 900 },
      { id: '1-7', src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Wedding details', width: 1200, height: 800 },
      { id: '1-8', src: 'https://images.pexels.com/photos/2122372/pexels-photo-2122372.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Candid moment', width: 1200, height: 1100 },
    ],
  },
  {
    id: '2',
    slug: 'pre-wedding-shoot',
    name: 'Pre-Wedding Shoot',
    category: 'Pre-Wedding',
    date: 'February 2024',
    location: 'Chettinad',
    coverImage: 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id: '2-1', src: 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Pre-wedding couple', width: 1200, height: 900 },
      { id: '2-2', src: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Romantic moment', width: 1200, height: 800 },
      { id: '2-3', src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Golden hour shot', width: 1200, height: 750 },
      { id: '2-4', src: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Couple walk', width: 1200, height: 1000 },
      { id: '2-5', src: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sunset portrait', width: 1200, height: 800 },
      { id: '2-6', src: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Nature backdrop', width: 1200, height: 900 },
    ],
  },
  {
    id: '3',
    slug: 'engagement-ceremony',
    name: 'Engagement Ceremony',
    category: 'Engagement',
    date: 'January 2024',
    location: 'Sivaganga',
    coverImage: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id: '3-1', src: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Ring ceremony', width: 1200, height: 750 },
      { id: '3-2', src: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Engagement moment', width: 1200, height: 1000 },
      { id: '3-3', src: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Happy couple', width: 1200, height: 800 },
      { id: '3-4', src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Floral decoration', width: 1200, height: 800 },
      { id: '3-5', src: 'https://images.pexels.com/photos/2122372/pexels-photo-2122372.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Family blessing', width: 1200, height: 1100 },
    ],
  },
  {
    id: '4',
    slug: 'grand-reception',
    name: 'Grand Reception',
    category: 'Reception',
    date: 'April 2024',
    location: 'Karaikudi',
    coverImage: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id: '4-1', src: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Reception hall', width: 1200, height: 800 },
      { id: '4-2', src: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Stage decoration', width: 1200, height: 900 },
      { id: '4-3', src: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Couple on stage', width: 1200, height: 800 },
      { id: '4-4', src: 'https://images.pexels.com/photos/2122372/pexels-photo-2122372.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Dance moment', width: 1200, height: 1100 },
      { id: '4-5', src: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Guests celebrating', width: 1200, height: 800 },
      { id: '4-6', src: 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Candid joy', width: 1200, height: 900 },
      { id: '4-7', src: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Reception portrait', width: 1200, height: 800 },
    ],
  },
  {
    id: '5',
    slug: 'haldi-ceremony',
    name: 'Haldi Ceremony',
    category: 'Ceremony',
    date: 'May 2024',
    location: 'Pudukkottai',
    coverImage: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id: '5-1', src: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Haldi ceremony', width: 1200, height: 800 },
      { id: '5-2', src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Family celebration', width: 1200, height: 750 },
      { id: '5-3', src: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Traditional ritual', width: 1200, height: 1000 },
      { id: '5-4', src: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Colorful moments', width: 1200, height: 800 },
    ],
  },
  {
    id: '6',
    slug: 'baby-shower',
    name: 'Baby Shower',
    category: 'Event',
    date: 'June 2024',
    location: 'Karaikudi',
    coverImage: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id: '6-1', src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Baby shower', width: 1200, height: 750 },
      { id: '6-2', src: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Celebration moment', width: 1200, height: 1000 },
      { id: '6-3', src: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Family joy', width: 1200, height: 800 },
    ],
  },
];
