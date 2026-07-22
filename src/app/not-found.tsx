// ──────────────────────────────────────────────────────────────────────
// /not-found — Tono global 404 page.
//
// Renders for any unknown toneit.com route (Next.js App Router convention:
// a missing segment under app/ that has no route match — including
// legacy /app/account, /app/settings, /app/billing, /app/delete, which
// are tracked separately in the launch audit GAP-13).
//
// Goals:
//  • Brand-aligned: dark theme, tono accent, footer + nav, no Vercel stock.
//  • Recovery: clear "go home" primary CTA + secondary "browse features".
//  • Support prompt: prominent mailto so a stuck visitor can reach a human
//    instead of bouncing.
//  • No new dependencies; pure server component; uses the same Tailwind
//    tokens as the rest of the site (see tailwind.config.ts).
// ──────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'page not found — tono',
  description: "we can't find that page. here are a few things that still work.",
  robots: { index: false, follow: false },
}

function HomeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12 12 3l9 9" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <main className="min-h-[80vh] bg-tono-bg text-tono-text font-sans antialiased flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[640px] text-center">
        {/* Eyebrow + code */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-tono-accent shadow-[0_0_10px_var(--accent-glow)]"
          />
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-tono-accent-light">
            error 404
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[40px] md:text-[56px] font-bold tracking-[-0.03em] text-tono-text leading-[1.02]">
          we couldn&rsquo;t find that page.
        </h1>

        {/* Body */}
        <p className="text-[16px] md:text-[17px] text-tono-text-soft leading-[1.6] mt-5 max-w-[520px] mx-auto">
          the link may be old, or the page may have moved. tono is still
          here &mdash; here&rsquo;s where to go next.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-tono-accent hover:bg-tono-accent-hover text-white font-semibold transition min-h-[48px] text-[15px] shadow-[0_0_24px_var(--accent-softer)]"
          >
            <HomeIcon />
            <span>go home</span>
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-tono-bg-card hover:bg-tono-bg-elev text-tono-text font-semibold border border-tono-border transition min-h-[48px] text-[15px]"
          >
            <span>browse features</span>
          </Link>
        </div>

        {/* Recovery links */}
        <div className="mt-12 pt-8 border-t border-tono-border">
          <p className="text-[12px] uppercase tracking-[0.14em] font-semibold text-tono-muted mb-4">
            or jump to
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px]">
            <li>
              <Link
                href="/pricing"
                className="text-tono-text-soft hover:text-tono-accent-light transition"
              >
                pricing
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-tono-text-soft hover:text-tono-accent-light transition"
              >
                contact
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-tono-text-soft hover:text-tono-accent-light transition"
              >
                blog
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="text-tono-text-soft hover:text-tono-accent-light transition"
              >
                features
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-tono-text-soft hover:text-tono-accent-light transition"
              >
                sign in
              </Link>
            </li>
          </ul>
        </div>

        {/* Support contact — primary fallback when visitor is stuck */}
        <div className="mt-10 p-5 rounded-[14px] bg-tono-bg-card border border-tono-border">
          <p className="text-[14px] text-tono-text-soft leading-[1.55]">
            think this page should exist? tell us what you were looking for
            and we&rsquo;ll point you in the right direction.
          </p>
          <a
            href="mailto:hello@tonoit.com?subject=404%20report%20%E2%80%94%20tono&body=Page%20I%20was%20looking%20for%3A%20%5Bpaste%20URL%20here%5D%0A%0AWhat%20I%20was%20trying%20to%20do%3A%0A"
            className="mt-3 inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-tono-accent-light hover:text-tono-accent transition"
          >
            <MailIcon />
            <span>hello@tonoit.com</span>
          </a>
        </div>
      </div>
    </main>
  )
}
