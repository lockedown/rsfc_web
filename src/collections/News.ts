import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor, teamManagerScoped } from '@/access'

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'team', 'publishedAt', 'status'] },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: async (args) => {
      const { req } = args
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true
      const scoped = await teamManagerScoped('team')(args)
      return scoped
    },
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'team', type: 'relationship', relationTo: 'teams', hasMany: false, admin: { description: 'Optional - leave blank for club-wide news.' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'author', type: 'relationship', relationTo: 'users', hasMany: false },
  ],
}
