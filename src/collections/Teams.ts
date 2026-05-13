import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, teamManagerScoped } from '@/access'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'season', 'ageGroup', 'format', 'manager'],
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: teamManagerScoped('self'),
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Raw Skills U11 Lions' } },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'URL slug, e.g. u11-lions-2025-26' } },
    { name: 'season', type: 'relationship', relationTo: 'seasons', required: true, hasMany: false },
    { name: 'ageGroup', type: 'relationship', relationTo: 'ageGroups', required: true, hasMany: false },
    {
      name: 'format',
      type: 'select',
      required: true,
      defaultValue: '11',
      options: [
        { label: '5-a-side', value: '5' },
        { label: '7-a-side', value: '7' },
        { label: '9-a-side', value: '9' },
        { label: '11-a-side', value: '11' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'manager',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: { description: 'Team manager (gets login & per-team edit rights).' },
    },
    { name: 'coaches', type: 'array', fields: [{ name: 'name', type: 'text', required: true }, { name: 'role', type: 'text' }] },
    { name: 'venue', type: 'text' },
    { name: 'trainingTimes', type: 'textarea' },
    { name: 'league', type: 'text' },
    { name: 'crestImage', type: 'upload', relationTo: 'media' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'richText' },
    { name: 'sponsors', type: 'relationship', relationTo: 'sponsors', hasMany: true },
    {
      name: 'previousTeam',
      type: 'relationship',
      relationTo: 'teams',
      hasMany: false,
      admin: { description: 'Link to the same team in the prior season (for history).', position: 'sidebar' },
    },
  ],
}
