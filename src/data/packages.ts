export interface PackageFeature {
  text: string;
  included: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  badge?: string;
  popular?: boolean;
  features: PackageFeature[];
  accentColor: string;
}

export const packages: Package[] = [
  {
    id: 'silver',
    name: 'Silver',
    price: '₹70,000',
    priceNote: 'Starting price',
    accentColor: 'from-slate-400 to-slate-300',
    features: [
      { text: '1 Day Photography Coverage', included: true },
      { text: '400+ Edited Photos', included: true },
      { text: 'Online Gallery Access', included: true },
      { text: '1 Photographer', included: true },
      { text: 'USB Drive Delivery', included: true },
      { text: 'Cinematic Video', included: false },
      { text: 'Pre-Wedding Shoot', included: false },
      { text: 'Same Day Edit (Highlights)', included: false },
      { text: 'Printed Album', included: false },
      { text: 'Drone Shots', included: false },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₹95,000',
    priceNote: 'Starting price',
    badge: 'Most Popular',
    popular: true,
    accentColor: 'from-gold-500 to-gold-400',
    features: [
      { text: '2 Day Photography Coverage', included: true },
      { text: '700+ Edited Photos', included: true },
      { text: 'Online Gallery Access', included: true },
      { text: '2 Photographers', included: true },
      { text: 'USB Drive + Cloud Delivery', included: true },
      { text: 'Cinematic Wedding Film (5 min)', included: true },
      { text: 'Pre-Wedding Shoot (1 hour)', included: true },
      { text: 'Same Day Edit (Highlights)', included: false },
      { text: 'Printed Album (20 pages)', included: false },
      { text: 'Drone Shots', included: false },
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '₹1,20,000',
    priceNote: 'Starting price',
    badge: 'Best Value',
    accentColor: 'from-cyan-400 to-blue-400',
    features: [
      { text: '3 Day Photography Coverage', included: true },
      { text: '1000+ Edited Photos', included: true },
      { text: 'Online Gallery Access', included: true },
      { text: '3 Photographers', included: true },
      { text: 'USB Drive + Cloud + Print Delivery', included: true },
      { text: 'Cinematic Wedding Film (10 min)', included: true },
      { text: 'Pre-Wedding Shoot (2 hours)', included: true },
      { text: 'Same Day Edit (Highlights)', included: true },
      { text: 'Printed Album (40 pages)', included: true },
      { text: 'Drone Shots', included: false },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹1,70,000',
    priceNote: 'Starting price',
    accentColor: 'from-maroon-700 to-maroon-500',
    features: [
      { text: 'Full Event Photography Coverage', included: true },
      { text: '1500+ Edited Photos', included: true },
      { text: 'Premium Online Gallery', included: true },
      { text: '4 Photographers + 2 Videographers', included: true },
      { text: 'All Formats Delivery', included: true },
      { text: 'Cinematic Wedding Film (20 min)', included: true },
      { text: 'Pre-Wedding Shoot (Full Day)', included: true },
      { text: 'Same Day Edit (Highlights)', included: true },
      { text: 'Premium Printed Album (60 pages)', included: true },
      { text: 'Drone Shots (Aerial Footage)', included: true },
    ],
  },
];
