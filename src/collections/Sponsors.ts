import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'tier', 'url'] },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'url', type: 'text' },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'supporter',
      options: [
        { label: 'Principal', value: 'principal' },
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
        { label: 'Supporter', value: 'supporter' },
      ],
    },
    { name: 'description', type: 'textarea' },
  ],
}
