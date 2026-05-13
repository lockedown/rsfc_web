import type { Metadata } from 'next'
import { Inter, Anton } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Raw Skills FC', template: '%s | Raw Skills FC' },
  description: 'Raw Skills FC - junior football club. Teams, fixtures, results, soccer school and more.',
  openGraph: {
    title: 'Raw Skills FC',
    description: 'Junior football, played the right way - since 2005.',
    type: 'website',
  },
}

const nav = [
  { href: '/', label: 'Home' },
  { href: '/teams', label: 'Teams' },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/news', label: 'News' },
  { href: '/soccer-school', label: 'Soccer School' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/contact', label: 'Contact' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${anton.variable}`}>
      <body>
        <header className="sticky top-0 z-40 border-b border-club-black/10 bg-club-white/90 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-block h-9 w-9 rounded-full bg-club-red" aria-hidden />
              <span className="font-display text-xl tracking-widest">Raw Skills FC</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-club-red">
                  {n.label}
                </Link>
              ))}
              <Link href="/join" className="btn-primary text-sm py-2 px-4">Join us</Link>
            </nav>
          </div>
        </header>

        <main className="min-h-[60vh]">{children}</main>

        <footer className="mt-24 border-t border-club-black/10 bg-club-black text-club-white">
          <div className="container py-12 grid gap-8 md:grid-cols-4">
            <div>
              <p className="font-display text-2xl tracking-widest">Raw Skills FC</p>
              <p className="mt-2 text-sm opacity-70">Est. 2005. FA Charter Standard junior football club.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Club</p>
              <ul className="space-y-1 text-sm opacity-80">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/teams">Teams</Link></li>
                <li><Link href="/sponsors">Sponsors</Link></li>
                <li><Link href="/policies">Policies</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Play</p>
              <ul className="space-y-1 text-sm opacity-80">
                <li><Link href="/soccer-school">Soccer School</Link></li>
                <li><Link href="/join">Join Us</Link></li>
                <li><Link href="/fixtures">Fixtures</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Contact</p>
              <ul className="space-y-1 text-sm opacity-80">
                <li><Link href="/contact">Contact form</Link></li>
                <li><a href="/admin">Admin login</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 py-4 text-center text-xs opacity-60">
            (c) {new Date().getFullYear()} Raw Skills FC. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
