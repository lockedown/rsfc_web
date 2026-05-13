import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Soccer School' }

export default async function SoccerSchoolPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayloadClient()
  const sessionsRes = await payload
    .find({
      collection: 'soccerSchoolSessions',
      where: { active: { equals: true } },
      sort: 'dayOfWeek',
      limit: 50,
    })
    .catch(() => ({ docs: [] as any[] }))

  return (
    <>
      <section className="bg-club-black text-club-white">
        <div className="container py-20">
          <h1 className="text-5xl md:text-6xl">Soccer School</h1>
          <p className="mt-4 max-w-prose text-lg opacity-80">
            Our soccer school is open to children aged 4-7 looking to develop fundamental football
            skills in a fun, supportive environment. Sessions run weekly during term time.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-3xl">Upcoming sessions</h2>

        {sessionsRes.docs.length === 0 ? (
          <p className="mt-6 opacity-70">
            No sessions are currently scheduled. Register your interest below and we'll let you know
            when the next block opens.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessionsRes.docs.map((s: any) => (
              <li
                key={s.id}
                className="rounded-lg border border-club-black/10 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-club-red">
                  {s.dayOfWeek} - {s.startTime}-{s.endTime}
                </p>
                <p className="mt-2 text-xl font-semibold">{s.title}</p>
                <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm opacity-80">
                  <dt>Ages</dt>
                  <dd>{s.ageRange}</dd>
                  <dt>Venue</dt>
                  <dd>{s.venue}</dd>
                  {s.price && (
                    <>
                      <dt>Price</dt>
                      <dd>{s.price}</dd>
                    </>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-club-black/5 py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl">Register your interest</h2>
          <p className="mt-3 opacity-80">
            Drop us your details and we'll send session info, dates and how to book.
          </p>

          {sp.sent && (
            <div className="mt-6 rounded-md border border-green-500/40 bg-green-500/10 p-4">
              Thanks - we've received your registration and will be in touch shortly.
            </div>
          )}

          <form action="/api/enquiries/contact" method="post" className="mt-8 grid gap-4">
            <input type="hidden" name="type" value="soccerSchool" />
            <input type="hidden" name="next" value="/soccer-school" />
            <input type="hidden" name="subject" value="Soccer School - interest" />

            <label className="grid gap-1">
              <span className="text-sm font-medium">Parent / guardian name *</span>
              <input
                name="name"
                required
                className="rounded-md border border-club-black/20 px-3 py-2"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-md border border-club-black/20 px-3 py-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  className="rounded-md border border-club-black/20 px-3 py-2"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Child's name and age *</span>
              <textarea
                name="message"
                required
                rows={4}
                className="rounded-md border border-club-black/20 px-3 py-2"
                placeholder="e.g. Alex, age 5. Any preferred session day/time."
              />
            </label>

            <button type="submit" className="btn-accent justify-self-start mt-2">
              Register interest
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
