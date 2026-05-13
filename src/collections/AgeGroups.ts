import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'

export const AgeGroups: CollectionConfig = {
  slug: 'ageGroups',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'sortOrder', 'defaultFormat'],
    description: 'Editable list of age-group labels (U7, Girls U14, Vets, Walking Football, etc.).',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'label', type: 'text', required: true, unique: true },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 100,
      admin: { description: 'Lower numbers appear first (e.g. U7 = 7, U18 = 18).' },
    },
    {
      name: 'defaultFormat',
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
    { name: 'notes', type: 'textarea' },
  ],
}
