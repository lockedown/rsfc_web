import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) return true // disabled in dev
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
  })
  const data = (await res.json()) as { success: boolean }
  return data.success
}

export async function POST(req: Request) {
  const form = await req.formData()
  const turnstileToken = (form.get('cf-turnstile-response') as string) ?? null
  const ok = await verifyTurnstile(turnstileToken)
  if (!ok) return NextResponse.json({ error: 'Captcha failed' }, { status: 400 })

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'enquiries',
    data: {
      type: (form.get('type') as any) ?? 'contact',
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? '') || undefined,
      subject: String(form.get('subject') ?? '') || undefined,
      message: String(form.get('message') ?? ''),
      status: 'new',
    },
    overrideAccess: true,
  })

  return NextResponse.redirect(new URL('/contact?sent=1', req.url), { status: 303 })
}
