import { getCurrentSeason, getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 60
export const metadata = { title: 'Fixtures & Results' }

export default async function FixturesPage() {
  const payload = await getPayloadClient()
  const season = await getCurrentSeason()
  if (!season) {
    return (
      <section className="container py-16">
        <h1 className="text-5xl">Fixtures & Results</h1>
        <p className="mt-4 opacity-70">No active season configured in the CMS.</p>
      </section>
    )
  }

  const teams = await payload.find({
    collection: 'teams',
    where: { season: { equals: season.id } },
    limit: 200,
  })
  const teamIds = teams.docs.map((t: any) => t.id)

  const fixtures = await payload.find({
    collection: 'fixtures',
    where: { team: { in: teamIds } },
    sort: 'kickoff',
    limit: 200,
    depth: 1,
  })

  return (
    <section className="container py-16">
      <h1 className="text-5xl">Fixtures & Results</h1>
      <p className="mt-2 opacity-70">Season {season.label}</p>
      <table className="mt-8 w-full text-sm">
        <thead className="text-left uppercase tracking-widest text-xs opacity-60 border-b">
          <tr>
            <th className="py-2">Date</th>
            <th>Team</th>
            <th>Opposition</th>
            <th>Venue</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-club-black/10">
          {fixtures.docs.map((f: any) => (
            <tr key={f.id}>
              <td className="py-2 whitespace-nowrap">{new Date(f.kickoff).toLocaleString('en-GB')}</td>
              <td>{f.team?.name}</td>
              <td>{f.opposition} ({f.homeAway})</td>
              <td>{f.venue ?? '-'}</td>
              <td className="capitalize">{f.status}</td>
            </tr>
          ))}
          {fixtures.docs.length === 0 && (
            <tr><td colSpan={5} className="py-6 opacity-60 text-center">No fixtures scheduled.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  )
}
