import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Sponsors' }

const TIER_ORDER = ['principal', 'gold', 'silver', 'bronze', 'supporter'] as const
const TIER_LABEL: Record<string, string> = {
  principal: 'Principal partner',
  gold: 'Gold sponsors',
  silver: 'Silver sponsors',
  bronze: 'Bronze sponsors',
  supporter: 'Supporters',
}

export default async function SponsorsPage() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({ collection: 'sponsors', limit: 200, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))

  const byTier: Record<string, any[]> = {}
  for (const s of res.docs) {
    const tier = s.tier ?? 'supporter'
    if (!byTier[tier]) byTier[tier] = []
    byTier[tier].push(s)
  }

  return (
    <>
      <section className="bg-club-black text-club-white">
        <div className="container py-20 max-w-3xl">
          <h1 className="text-5xl md:text-6xl">Our sponsors</h1>
          <p className="mt-4 text-lg opacity-80">
            We're proud to be supported by local businesses who help us keep junior football
            accessible and well-resourced. Thank you to everyone who backs the club.
          </p>
          <Link href="/contact?subject=Sponsorship" className="btn-accent mt-6 inline-flex">
            Become a sponsor
          </Link>
        </div>
      </section>

      <section className="container py-16">
        {res.docs.length === 0 ? (
          <p className="opacity-70">
            No sponsors listed yet. Check back soon, or get in touch to be the first.
          </p>
        ) : (
          <div className="grid gap-12">
            {TIER_ORDER.filter((t) => byTier[t]?.length).map((tier) => (
              <div key={tier}>
                <h2 className="text-2xl">{TIER_LABEL[tier]}</h2>
                <ul
                  className={`mt-6 grid gap-6 ${
                    tier === 'principal'
                      ? 'sm:grid-cols-1'
                      : tier === 'gold'
                        ? 'sm:grid-cols-2'
                        : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}
                >
                  {byTier[tier].map((s: any) => (
                    <li
                      key={s.id}
                      className="flex flex-col rounded-lg border border-club-black/10 bg-white p-6 shadow-sm"
                    >
                      {s.logo?.url ? (
                        <div className="relative mb-4 aspect-[3/2] w-full bg-club-black/5">
                          <Image
                            src={s.logo.url}
                            alt={s.logo.alt ?? s.name}
                            fill
                            className="object-contain p-3"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-[3/2] w-full items-center justify-center rounded bg-club-black/5">
                          <span className="font-display text-2xl opacity-50">{s.name}</span>
                        </div>
                      )}
                      <p className="text-lg font-semibold">{s.name}</p>
                      {s.description && (
                        <p className="mt-2 text-sm opacity-70">{s.description}</p>
                      )}
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 text-sm font-medium text-club-red hover:underline"
                        >
                          Visit website
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
