import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'

export const SoccerSchoolSessions: CollectionConfig = {
  slug: 'soccerSchoolSessions',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'dayOfWeek', 'startTime', 'ageRange', 'price'] },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'dayOfWeek',
      type: 'select',
      required: true,
      options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({ label: d, value: d })),
    },
    { name: 'startTime', type: 'text', required: true, admin: { description: 'e.g. 10:00' } },
    { name: 'endTime', type: 'text', required: true, admin: { description: 'e.g. 11:00' } },
    { name: 'ageRange', type: 'text', required: true, admin: { description: 'e.g. 4-7 years' } },
    { name: 'venue', type: 'text', required: true },
    { name: 'price', type: 'text', admin: { description: 'e.g. £5 per session' } },
    { name: 'capacity', type: 'number' },
    { name: 'description', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
