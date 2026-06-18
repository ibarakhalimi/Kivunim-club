import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'כיוונים · מועדון הסטודנטים',
    short_name: 'כיוונים',
    description: 'מועדון ההטבות והפעילויות הסטודנטיאלי של אשדוד',
    start_url: '/',
    display: 'standalone',
    background_color: '#181A23',
    theme_color: '#181A23',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}