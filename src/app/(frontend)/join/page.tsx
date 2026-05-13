import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Join Us' }

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayloadClient()
  const ageGroupsRes = await payload
    .find({ collection: 'ageGroups', sort: 'sortOrder', limit: 50 })
    .catch(() => ({ docs: [] as any[] }))

  return (
    <section className="container py-16 max-w-3xl">
      <h1 className="text-5xl">Join Raw Skills FC</h1>
      <p className="mt-4 text-lg opacity-80">
        Looking to play for one of our teams? Fill in the form below and we'll get back to you about
        trials and availability in the right age group.
      </p>

      {sp.sent && (
        <div className="mt-6 rounded-md border border-green-500/40 bg-green-500/10 p-4">
          Thanks - we've received your request and a coach will be in touch shortly.
        </div>
      )}

      <form
        action="/api/enquiries/contact"
        method="post"
        className="mt-8 grid gap-4"
      >
        <input type="hidden" name="type" value="trial" />
        <input type="hidden" name="next" value="/join" />

        <label className="grid gap-1">
          <span className="text-sm font-medium">Player name *</span>
          <input
            name="subject"
            required
            className="rounded-md border border-club-black/20 px-3 py-2"
            placeholder="e.g. Sam Smith"
          />
        </label>

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
          <span className="text-sm font-medium">Age group</span>
          <select name="ageGroupLabel" className="rounded-md border border-club-black/20 px-3 py-2">
            <option value="">Not sure - please advise</option>
            {ageGroupsRes.docs.map((ag: any) => (
              <option key={ag.id} value={ag.label}>
                {ag.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Tell us about the player *</span>
          <textarea
            name="message"
            required
            rows={5}
            className="rounded-md border border-club-black/20 px-3 py-2"
            placeholder="Previous experience, current team, anything else we should know..."
          />
        </label>

        <button type="submit" className="btn-accent justify-self-start mt-2">
          Request a trial
        </button>
      </form>
    </section>
  )
}
