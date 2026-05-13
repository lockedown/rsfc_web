/* eslint-disable no-console */
/**
 * Bootstrap seed: creates an admin user, the current season, default age groups
 * and a Settings global. Run once after first DB push.
 *
 *   npm run seed
 *
 * Requires DATABASE_URI and PAYLOAD_SECRET to be set.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@rawskillsfc.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!1234'

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })
  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Club Admin', email: adminEmail, password: adminPassword, role: 'admin' },
    })
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`)
  }

  // Default age groups
  const groups = [
    { label: 'U7', sortOrder: 7, defaultFormat: '5' },
    { label: 'U8', sortOrder: 8, defaultFormat: '5' },
    { label: 'U9', sortOrder: 9, defaultFormat: '7' },
    { label: 'U10', sortOrder: 10, defaultFormat: '7' },
    { label: 'U11', sortOrder: 11, defaultFormat: '9' },
    { label: 'U12', sortOrder: 12, defaultFormat: '9' },
    { label: 'U13', sortOrder: 13, defaultFormat: '11' },
    { label: 'U14', sortOrder: 14, defaultFormat: '11' },
    { label: 'U15', sortOrder: 15, defaultFormat: '11' },
    { label: 'U16', sortOrder: 16, defaultFormat: '11' },
    { label: 'U18', sortOrder: 18, defaultFormat: '11' },
  ]
  for (const g of groups) {
    const found = await payload.find({ collection: 'ageGroups', where: { label: { equals: g.label } }, limit: 1 })
    if (found.docs.length === 0) {
      await payload.create({ collection: 'ageGroups', data: g as any })
    }
  }
  console.log('Seeded age groups.')

  // Current season (defaults to current Aug -> next Jun)
  const now = new Date()
  const startYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
  const label = `${startYear}/${String(startYear + 1).slice(-2)}`
  const seasonRes = await payload.find({ collection: 'seasons', where: { label: { equals: label } }, limit: 1 })
  if (seasonRes.docs.length === 0) {
    await payload.create({
      collection: 'seasons',
      data: {
        label,
        startDate: `${startYear}-08-01`,
        endDate: `${startYear + 1}-06-30`,
        isCurrent: true,
        archived: false,
      },
    })
    console.log(`Created current season ${label}`)
  }

  // Settings global
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      clubName: 'Raw Skills FC',
      tagline: 'Junior football, played the right way - since 2005.',
      stats: [
        { label: 'Players', value: '200+' },
        { label: 'Teams', value: '18+' },
        { label: 'Since', value: '2005' },
      ],
    } as any,
  })
  console.log('Seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
