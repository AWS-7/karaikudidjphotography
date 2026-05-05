export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  review: string;
  rating: number;
  event: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Karthik & Meena',
    role: 'Newly Weds',
    location: 'Karaikudi',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    review: 'Dass captured our wedding day beautifully. Every emotion, every candid smile was perfectly framed. We still tear up looking at our photos. Truly a magician with the camera!',
    rating: 5,
    event: 'Wedding Photography',
  },
  {
    id: '2',
    name: 'Ramesh & Kavitha',
    role: 'Married Couple',
    location: 'Sivaganga',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    review: 'The pre-wedding shoot was an absolute dream! Dass made us feel so comfortable and natural. The golden hour shots are absolutely breathtaking. Highly recommend DJ Photography!',
    rating: 5,
    event: 'Pre-Wedding & Reception',
  },
  {
    id: '3',
    name: 'Senthil & Preethi',
    role: 'Happy Clients',
    location: 'Madurai',
    avatar: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=150',
    review: 'From the first consultation to the final album delivery, everything was seamless. The cinematic video made our families cry happy tears. This is money well spent. Thank you!',
    rating: 5,
    event: 'Wedding & Cinematography',
  },
];
