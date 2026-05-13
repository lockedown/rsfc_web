import Link from 'next/link'
import { getCurrentSeason, getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayloadClient()
  const season = await getCurrentSeason()

  const [news, fixtures, teamsCount, sponsors] = await Promise.all([
    payload.find({
      collection: 'news',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
    }),
    season
      ? payload.find({
          collection: 'fixtures',
          where: {
            and: [
              { status: { equals: 'scheduled' } },
              { kickoff: { greater_than: new Date().toISOString() } },
            ],
          },
          sort: 'kickoff',
          limit: 5,
          depth: 1,
        })
      : Promise.resolve({ docs: [] as any[] }),
    season
      ? payload.count({ collection: 'teams', where: { season: { equals: season.id } } })
      : Promise.resolve({ totalDocs: 0 }),
    payload.find({ collection: 'sponsors', limit: 12, sort: 'tier' }),
  ])

  return (
    <>
      <section className="relative isolate overflow-hidden bg-club-black text-club-white">
        <div className="container py-24 md:py-32 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-club-accent font-semibold tracking-widest text-sm uppercase">Est. 2005</p>
            <h1 className="mt-3 text-5xl md:text-7xl leading-[0.95]">
              Junior football,<br />played the right way.
            </h1>
            <p className="mt-5 text-lg opacity-80 max-w-prose">
              Raw Skills FC is one of the largest junior football clubs in our area, developing players
              from U7 through to U18 across boys' and girls' teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/join" className="btn-accent">Join us</Link>
              <Link href="/teams" className="btn-ghost text-club-white border-white/30 hover:bg-white/10">See our teams</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Teams" value={String(teamsCount.totalDocs || '-')} />
            <Stat label="Season" value={season?.label ?? 'TBC'} />
            <Stat label="Since" value="2005" />
          </div>
        </div>
      </section>

      <section className="container py-20 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl">Latest news</h2>
          <ul className="mt-6 divide-y divide-club-black/10">
            {news.docs.length === 0 && <li className="py-4 opacity-60">No news yet.</li>}
            {news.docs.map((n: any) => (
              <li key={n.id} className="py-4">
                <Link href={`/news/${n.slug}`} className="group">
                  <p className="text-xs opacity-60">
                    {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('en-GB') : ''}
                  </p>
                  <p className="text-lg font-semibold group-hover:text-club-red">{n.title}</p>
                  {n.excerpt && <p className="text-sm opacity-70 mt-1">{n.excerpt}</p>}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/news" className="btn-ghost mt-6">All news</Link>
        </div>
        <div>
          <h2 className="text-3xl">Upcoming fixtures</h2>
          <ul className="mt-6 divide-y divide-club-black/10">
            {fixtures.docs.length === 0 && <li className="py-4 opacity-60">No upcoming fixtures.</li>}
            {fixtures.docs.map((f: any) => (
              <li key={f.id} className="py-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs opacity-60">{new Date(f.kickoff).toLocaleString('en-GB')}</p>
                  <p className="font-semibold">
                    {f.team?.name ?? 'Team'} {f.homeAway === 'home' ? 'vs' : '@'} {f.opposition}
                  </p>
                  {f.venue && <p className="text-sm opacity-70">{f.venue}</p>}
                </div>
              </li>
            ))}
          </ul>
          <Link href="/fixtures" className="btn-ghost mt-6">Full fixture list</Link>
        </div>
      </section>

      {sponsors.docs.length > 0 && (
        <section className="bg-club-black/5 py-12">
          <div className="container">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-60">Our sponsors</p>
            <div className="mt-6 flex flex-wrap items-center gap-8 opacity-80">
              {sponsors.docs.map((s: any) => (
                <a key={s.id} href={s.url ?? '#'} className="text-lg font-semibold hover:text-club-red">
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-5 text-center">
      <p className="font-display text-3xl text-club-accent">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest opacity-70">{label}</p>
    </div>
  )
}
