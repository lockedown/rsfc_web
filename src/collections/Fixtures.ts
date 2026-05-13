import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, teamManagerScoped } from '@/access'

export const Fixtures: CollectionConfig = {
  slug: 'fixtures',
  admin: {
    useAsTitle: 'opposition',
    defaultColumns: ['team', 'opposition', 'kickoff', 'homeAway', 'status'],
  },
  access: {
    read: anyone,
    create: teamManagerScoped('team'),
    update: teamManagerScoped('team'),
    delete: isAdmin,
  },
  fields: [
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true, hasMany: false },
    { name: 'opposition', type: 'text', required: true },
    { name: 'kickoff', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'homeAway',
      type: 'select',
      required: true,
      defaultValue: 'home',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Away', value: 'away' },
      ],
    },
    { name: 'venue', type: 'text' },
    { name: 'competition', type: 'text', admin: { description: 'League / cup name.' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Played', value: 'played' },
        { label: 'Postponed', value: 'postponed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
