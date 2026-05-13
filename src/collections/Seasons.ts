import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/access'

export const Seasons: CollectionConfig = {
  slug: 'seasons',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'isCurrent', 'startDate', 'endDate'],
    description: 'A football season (e.g. 2025/26). One season may be marked as current.',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'label', type: 'text', required: true, unique: true, admin: { description: 'e.g. 2025/26' } },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },
    {
      name: 'isCurrent',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Only one season can be current. Toggling on will unset others.' },
    },
    { name: 'archived', type: 'checkbox', defaultValue: false },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (data.isCurrent) {
          // Unset isCurrent on all other seasons
          await req.payload.update({
            collection: 'seasons',
            where: {
              and: [
                { isCurrent: { equals: true } },
                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
              ],
            },
            data: { isCurrent: false },
            overrideAccess: true,
          })
        }
        return data
      },
    ],
  },
}
