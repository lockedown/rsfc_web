import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 60
export const metadata = { title: 'News' }

export default async function NewsPage() {
  const payload = await getPayloadClient()
  const news = await payload.find({
    collection: 'news',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 30,
  })
  return (
    <section className="container py-16">
      <h1 className="text-5xl">News</h1>
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {news.docs.map((n: any) => (
          <li key={n.id} className="rounded-xl border border-club-black/10 bg-white p-6">
            <p className="text-xs opacity-60">
              {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('en-GB') : ''}
            </p>
            <h2 className="mt-1 font-display text-2xl">
              <Link href={`/news/${n.slug}`} className="hover:text-club-red">{n.title}</Link>
            </h2>
            {n.excerpt && <p className="mt-2 opacity-80">{n.excerpt}</p>}
          </li>
        ))}
        {news.docs.length === 0 && <li className="opacity-60">No news published yet.</li>}
      </ul>
    </section>
  )
}
