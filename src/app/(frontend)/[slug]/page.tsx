import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

// Slugs that have their own dedicated route - don't let this catch-all handle them.
const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'contact',
  'fixtures',
  'join',
  'news',
  'soccer-school',
  'sponsors',
  'teams',
])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return {}
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 1,
    })
    .catch(() => ({ docs: [] as any[] }))
  const page = res.docs[0]
  if (!page) return {}
  return { title: page.title }
}

export default async function CMSPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) notFound()

  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  const page = res.docs[0]
  if (!page) notFound()

  return (
    <>
      {page.heroImage?.url && (
        <section className="relative h-[40vh] min-h-[280px] w-full bg-club-black">
          <Image
            src={page.heroImage.url}
            alt={page.heroImage.alt ?? page.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 flex items-end">
            <div className="container pb-10 text-club-white">
              <h1 className="text-5xl md:text-6xl">{page.title}</h1>
            </div>
          </div>
        </section>
      )}

      <section className="container py-16 max-w-3xl">
        {!page.heroImage?.url && <h1 className="mb-6 text-5xl">{page.title}</h1>}
        <div className="prose prose-lg max-w-none">
          <RichText data={page.body} />
        </div>
      </section>
    </>
  )
}
