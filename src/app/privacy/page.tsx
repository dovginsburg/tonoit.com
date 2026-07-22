import Link from 'next/link'

export const metadata = {
  title: 'privacy — tono',
  description: 'How tono handles explicit rewrite requests and account data.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-soft text-tono"><div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="inline-flex items-center min-h-[44px] text-sm text-tono-soft hover:underline">← back</Link>
      <h1 className="mt-8 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-tono-soft text-sm">Effective and last updated: July 22, 2026</p>
      <section className="mt-12 space-y-6 text-[15px] leading-relaxed">
        <p>tono is a pre-send communication coach operated under the trade name Amazed Labs. tono is not a clinical or crisis service and does not send messages on your behalf.</p>
        <h2 className="text-2xl font-semibold pt-6">when text is sent</h2>
        <p>ordinary typing and opening the tone choices create no rewrite request. after you explicitly choose one tone and request a rewrite, the selected text is transmitted over TLS to tono's backend and its configured AI provider. one tone selection is intended to create one selected rewrite request; no hidden sibling rewrite is shown or prefetched by this website.</p>
        <h2 className="text-2xl font-semibold pt-6">what may stay on your device</h2>
        <p>the website may save an unfinished demo draft in browser storage so it can survive a reload or temporary network loss. you can clear it from the composer or your browser storage. signed-in product surfaces may also keep local rewrite history.</p>
        <h2 className="text-2xl font-semibold pt-6">service data</h2>
        <p>tono may process pseudonymous device or account identifiers, subscription state, request status, latency, selected tone, coarse message-length buckets, and content-free diagnostics needed to operate and secure the service. payment details are handled by the applicable purchase platform.</p>
        <h2 className="text-2xl font-semibold pt-6">providers</h2>
        <p>the service uses third parties for AI processing, hosting, authentication, payments, email, and web delivery. the active provider and its terms are disclosed by the applicable product or purchase surface and may change.</p>
        <h2 className="text-2xl font-semibold pt-6">deletion and contact</h2>
        <p>email <a href="mailto:hi@tonoit.com?subject=tono%20data%20deletion" className="underline">hi@tonoit.com</a> to request account-data access or deletion. the public service does not claim an in-app deletion or cancellation path.</p>
      </section>
    </div></main>
  )
}
