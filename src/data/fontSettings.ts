import type { FontSettings } from '../types/database';

export const FONT_FAMILIES = ['font-sans', 'font-serif', 'font-script', 'font-mono'] as const;

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  hero: {
    subtitle: 'font-script',
    title: 'font-serif',
    text: 'font-sans',
  },
  about: {
    subtitle: 'font-sans',
    title: 'font-serif',
    text: 'font-sans',
  },
  services: {
    subtitle: 'font-sans',
    title: 'font-serif',
    text: 'font-sans',
  },
  contact: {
    subtitle: 'font-sans',
    title: 'font-serif',
    text: 'font-sans',
  },
  testimonials: {
    subtitle: 'font-script',
    title: 'font-serif',
    text: 'font-sans',
  },
};
