import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  useCdn: false, // Set to false for write/real-time updates
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN && typeof window === 'undefined') {
  console.warn('SANITY_API_TOKEN is missing! Write operations will fail.');
}
