import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'teams',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const team: any = res.docs[0]
  if (!team) notFound()

  const [fixtures, results, news] = await Promise.all([
    payload.find({
      collection: 'fixtures',
      where: { and: [{ team: { equals: team.id } }, { kickoff: { greater_than: new Date().toISOString() } }] },
      sort: 'kickoff',
      limit: 10,
    }),
    payload.find({
      collection: 'results',
      where: { team: { equals: team.id } },
      sort: '-createdAt',
      limit: 10,
      depth: 1,
    }),
    payload.find({
      collection: 'news',
      where: { and: [{ team: { equals: team.id } }, { status: { equals: 'published' } }] },
      sort: '-publishedAt',
      limit: 5,
    }),
  ])

  return (
    <article className="container py-16">
      <p className="text-xs uppercase tracking-widest opacity-60">
        {team.season?.label} - {team.ageGroup?.label} - {team.format}-a-side
      </p>
      <h1 className="mt-2 text-5xl">{team.name}</h1>
      {team.league && <p className="mt-2 opacity-70">{team.league}</p>}

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">Upcoming fixtures</h2>
          <ul className="mt-4 divide-y divide-club-black/10">
            {fixtures.docs.length === 0 && <li className="py-3 opacity-60">No upcoming fixtures.</li>}
            {fixtures.docs.map((f: any) => (
              <li key={f.id} className="py-3">
                <p className="text-xs opacity-60">{new Date(f.kickoff).toLocaleString('en-GB')}</p>
                <p className="font-semibold">vs {f.opposition} ({f.homeAway})</p>
                {f.venue && <p className="text-sm opacity-70">{f.venue}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Recent results</h2>
          <ul className="mt-4 divide-y divide-club-black/10">
            {results.docs.length === 0 && <li className="py-3 opacity-60">No results yet.</li>}
            {results.docs.map((r: any) => (
              <li key={r.id} className="py-3 flex items-baseline justify-between">
                <span>vs {r.fixture?.opposition ?? '-'}</span>
                <span className="font-display text-xl">{r.scoreHome} - {r.scoreAway}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {news.docs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl">Team news</h2>
          <ul className="mt-4 space-y-2">
            {news.docs.map((n: any) => (
              <li key={n.id}>
                <a href={`/news/${n.slug}`} className="hover:text-club-red">
                  <span className="text-xs opacity-60 mr-2">
                    {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('en-GB') : ''}
                  </span>
                  {n.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
