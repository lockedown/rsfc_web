import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['type', 'name', 'email', 'subject', 'createdAt'],
    description: 'Submissions from public forms (contact, trial, soccer school).',
  },
  access: {
    // Forms POST via a server route that uses overrideAccess
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Trial / Join Us', value: 'trial' },
        { label: 'Soccer School', value: 'soccerSchool' },
        { label: 'Sponsor', value: 'sponsor' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'team', type: 'relationship', relationTo: 'teams' },
    { name: 'ageGroup', type: 'relationship', relationTo: 'ageGroups' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'inProgress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
