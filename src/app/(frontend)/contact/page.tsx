export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <section className="container py-16 max-w-2xl">
      <h1 className="text-5xl">Contact</h1>
      <p className="mt-3 opacity-80">
        Got a question about joining, our soccer school, sponsorship or anything else? Drop us a line below.
      </p>
      <form
        action="/api/enquiries/contact"
        method="post"
        className="mt-8 grid gap-4"
      >
        <input type="hidden" name="type" value="contact" />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Name</span>
          <input name="name" required className="rounded border border-club-black/20 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" required className="rounded border border-club-black/20 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Phone (optional)</span>
          <input name="phone" className="rounded border border-club-black/20 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Subject</span>
          <input name="subject" className="rounded border border-club-black/20 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Message</span>
          <textarea name="message" rows={6} required className="rounded border border-club-black/20 bg-white px-3 py-2" />
        </label>
        {/* Turnstile widget would mount here */}
        <div className="text-xs opacity-60">Protected by Cloudflare Turnstile (configure in env).</div>
        <button className="btn-primary self-start">Send</button>
      </form>
    </section>
  )
}
