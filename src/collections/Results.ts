import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, teamManagerScoped } from '@/access'

export const Results: CollectionConfig = {
  slug: 'results',
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['fixture', 'scoreHome', 'scoreAway', 'motm'],
  },
  access: {
    read: anyone,
    create: teamManagerScoped('team'),
    update: teamManagerScoped('team'),
    delete: isAdmin,
  },
  fields: [
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true, hasMany: false },
    { name: 'fixture', type: 'relationship', relationTo: 'fixtures', required: true, hasMany: false },
    { name: 'scoreHome', type: 'number', required: true, min: 0 },
    { name: 'scoreAway', type: 'number', required: true, min: 0 },
    {
      name: 'scorers',
      type: 'array',
      fields: [
        { name: 'player', type: 'text', required: true },
        { name: 'minute', type: 'number' },
      ],
    },
    { name: 'motm', type: 'text', admin: { description: 'Player of the Match.' } },
    { name: 'notes', type: 'textarea' },
    {
      name: 'summary',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => `${siblingData.scoreHome ?? 0} - ${siblingData.scoreAway ?? 0}`,
        ],
      },
    },
  ],
}
