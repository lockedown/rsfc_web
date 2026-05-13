import Link from 'next/link'
import { getCurrentSeason, getPayloadClient } from '@/lib/payload'

export const revalidate = 60
export const metadata = { title: 'Teams' }

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayloadClient()

  let seasonDoc: any = null
  if (sp.season) {
    const r = await payload.find({ collection: 'seasons', where: { label: { equals: sp.season } }, limit: 1 })
    seasonDoc = r.docs[0]
  } else {
    seasonDoc = await getCurrentSeason()
  }

  const teams = seasonDoc
    ? await payload.find({
        collection: 'teams',
        where: { season: { equals: seasonDoc.id } },
        depth: 1,
        limit: 200,
        sort: 'ageGroup.sortOrder',
      })
    : { docs: [] as any[] }

  const seasons = await payload.find({ collection: 'seasons', sort: '-startDate', limit: 20 })

  return (
    <section className="container py-16">
      <div className="flex items-baseline justify-between flex-wrap gap-4">
        <h1 className="text-5xl">Teams</h1>
        <form className="flex items-center gap-2 text-sm">
          <label htmlFor="season" className="opacity-70">Season:</label>
          <select
            id="season"
            name="season"
            defaultValue={seasonDoc?.label ?? ''}
            className="rounded border border-club-black/20 bg-white px-2 py-1"
          >
            {seasons.docs.map((s: any) => (
              <option key={s.id} value={s.label}>
                {s.label}{s.isCurrent ? ' (current)' : ''}
              </option>
            ))}
          </select>
          <button className="btn-ghost py-1 px-3 text-sm">Go</button>
        </form>
      </div>

      <p className="mt-2 opacity-70">
        {seasonDoc ? `Season ${seasonDoc.label}` : 'No active season set in the CMS yet.'}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.docs.length === 0 && (
          <p className="opacity-70 col-span-full">No teams listed for this season yet.</p>
        )}
        {teams.docs.map((t: any) => (
          <Link
            key={t.id}
            href={`/teams/${t.slug}`}
            className="rounded-xl border border-club-black/10 bg-white p-6 hover:shadow-md transition"
          >
            <p className="text-xs uppercase tracking-widest opacity-60">
              {t.ageGroup?.label} - {t.format}-a-side
            </p>
            <p className="mt-1 font-display text-2xl">{t.name}</p>
            {t.league && <p className="mt-2 text-sm opacity-70">{t.league}</p>}
          </Link>
        ))}
      </div>
    </section>
  )
}
