import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, teamManagerScoped } from '@/access'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'team', 'position', 'showPublicly'],
    description: 'Player listings. GDPR-conscious - hidden by default for under-18s.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public can only read players explicitly marked showPublicly
      return { showPublicly: { equals: true } }
    },
    create: teamManagerScoped('team'),
    update: teamManagerScoped('team'),
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true, hasMany: false },
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Goalkeeper', value: 'GK' },
        { label: 'Defender', value: 'DEF' },
        { label: 'Midfielder', value: 'MID' },
        { label: 'Forward', value: 'FWD' },
      ],
    },
    { name: 'shirtNumber', type: 'number' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'showPublicly',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Only enable with parental/player consent (GDPR). Defaults to hidden.' },
    },
  ],
}
