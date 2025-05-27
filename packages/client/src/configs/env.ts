import { z } from 'zod';

// Schema for environment variables
const envSchema = z.object({
  app: z.object({
    name: z.string().default('Graph Talk'),
    url: z.string().default('http://localhost:8888'),
    appKey: z.string().default('graph-talk'),
    mode: z.enum(['development', 'production', 'test']).default('development'),
  }),
  pwa: z.object({
    name: z.string().default('Graph Talk'),
    shortName: z.string().default('Graph Talk'),
    description: z.string().default('Graph Talk'),
    themeColor: z.string().default('#000000'),
    backgroundColor: z.string().default('#000000'),
  }),
});

// Load environment variables
export const env = envSchema.parse({
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Graph Talk',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:8888',
    appKey: import.meta.env.VITE_APP_KEY || 'graph-talk',
    mode: import.meta.env.MODE || 'development',
  },
  pwa: {
    name: import.meta.env.VITE_PWA_NAME,
    shortName: import.meta.env.VITE_PWA_SHORT_NAME,
    description: import.meta.env.VITE_PWA_DESCRIPTION,
    themeColor: import.meta.env.VITE_PWA_THEME_COLOR,
    backgroundColor: import.meta.env.VITE_PWA_BACKGROUND_COLOR,
  },
});
