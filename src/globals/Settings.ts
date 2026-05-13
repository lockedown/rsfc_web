import type { GlobalConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: { description: 'Club-wide settings shown in the header/footer.' },
  access: { read: anyone, update: isAdminOrEditor },
  fields: [
    { name: 'clubName', type: 'text', required: true, defaultValue: 'Raw Skills FC' },
    { name: 'tagline', type: 'text', defaultValue: 'Junior football, played the right way - since 2005.' },
    { name: 'crest', type: 'upload', relationTo: 'media' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'safeguardingOfficer', type: 'group', fields: [
      { name: 'name', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'phone', type: 'text' },
    ] },
    { name: 'socials', type: 'group', fields: [
      { name: 'facebook', type: 'text' },
      { name: 'instagram', type: 'text' },
      { name: 'twitter', type: 'text' },
      { name: 'youtube', type: 'text' },
    ] },
  ],
}
