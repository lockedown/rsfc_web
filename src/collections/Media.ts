import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'filename' },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 960, height: undefined, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Short description for accessibility/SEO.' } },
    { name: 'credit', type: 'text' },
  ],
}
