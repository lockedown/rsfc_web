import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, teamManagerScoped } from '@/access'

export const GalleryAlbums: CollectionConfig = {
  slug: 'galleryAlbums',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'team', 'season', 'date'] },
  access: {
    read: anyone,
    create: teamManagerScoped('team'),
    update: teamManagerScoped('team'),
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'team', type: 'relationship', relationTo: 'teams', hasMany: false },
    { name: 'season', type: 'relationship', relationTo: 'seasons', hasMany: false },
    { name: 'date', type: 'date' },
    { name: 'description', type: 'textarea' },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
