import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-soft text-tono"><div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="inline-flex items-center min-h-[44px] text-sm text-tono-soft hover:underline">← back</Link>
      <h1 className="mt-8 text-4xl font-bold tracking-tight">Terms</h1>
      <p className="mt-2 text-tono-soft text-sm">last updated: 2026-07-22</p>
      <section className="mt-12 space-y-6 text-[15px] leading-relaxed">
        <p>tono is a pre-send communication coach. by using it, you agree to these terms.</p>
        <h2 className="text-2xl font-semibold pt-6">what tono does</h2>
        <p>you choose a tone and request one suggested rewrite. every suggestion is a starting point. you decide whether to edit, copy, use, or ignore it. tono does not send messages on your behalf.</p>
        <h2 className="text-2xl font-semibold pt-6">what tono is not</h2>
        <p>tono is not medical, therapeutic, mental-health, crisis, legal, or professional advice, and it does not guarantee how a recipient will respond.</p>
        <h2 className="text-2xl font-semibold pt-6">subscriptions</h2>
        <p>Pro auto-renews at $3.99/month or $39.99/year unless cancelled. purchase, renewal, cancellation, and refund terms shown by the applicable purchase platform control the transaction. this website does not claim an account-page cancellation flow.</p>
        <h2 className="text-2xl font-semibold pt-6">your responsibility</h2>
        <p>you own what you send. read and edit every suggestion before using it.</p>
        <h2 className="text-2xl font-semibold pt-6">no warranty</h2>
        <p>tono is provided “as is.” suggestions may be inappropriate, inaccurate, or poorly received.</p>
        <h2 className="text-2xl font-semibold pt-6">contact</h2>
        <p>questions: <a href="mailto:hi@tonoit.com" className="underline">hi@tonoit.com</a>.</p>
      </section>
    </div></main>
  )
}
