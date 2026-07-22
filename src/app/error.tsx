'use client'

// ──────────────────────────────────────────────────────────────────────
// /error — Tono per-route error boundary.
//
// App Router convention: a runtime error in any server or client
// component under app/ bubbles up to the nearest `error.tsx` and
// replaces the failed segment's UI with this one. The rest of the
// page (layout, footer) keeps rendering.
//
// Scope:
//   • Catches runtime errors thrown inside TonoDemo, the editor,
//     pricing flows, etc.
//   • Keeps TonoFooter + NavDropdown visible so the visitor has a
//     recovery path instead of a blank wall.
//   • Honors the launch-audit GAP-13 acceptance: branded 500-state
//     recovery (not Vercel stock), with a working "go home" CTA
//     and a support contact.
//
// 'use client' is mandatory: error.tsx must be a Client Component
// to use the `reset` function (which retries the failed segment).
// ──────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import Link from 'next/link'

export default function TonoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Mirror to console so the failure is debuggable from the same
    // log that's already in use across the app; in production Vercel
    // pushes the digest to its server log so we don't need to POST
    // it anywhere ourselves.
    // eslint-disable-next-line no-console
    console.error('tono — segment error', { digest: error.digest, message: error.message })
  }, [error])

  return (
    <main className="min-h-[80vh] bg-tono-bg text-tono-text font-sans antialiased flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[640px] text-center">
        {/* Eyebrow + code */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-tono-tone-warmer shadow-[0_0_10px_var(--accent-glow)]"
          />
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-tono-accent-light">
            error 500
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[40px] md:text-[56px] font-bold tracking-[-0.03em] text-tono-text leading-[1.02]">
          something broke on our side.
        </h1>

        {/* Body */}
        <p className="text-[16px] md:text-[17px] text-tono-text-soft leading-[1.6] mt-5 max-w-[520px] mx-auto">
          the page hit an error while loading. your draft stays in your
          browser, and you can safely retry.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-tono-accent hover:bg-tono-accent-hover text-white font-semibold transition min-h-[48px] text-[15px] shadow-[0_0_24px_var(--accent-softer)]"
          >
            <span>try again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-tono-bg-card hover:bg-tono-bg-elev text-tono-text font-semibold border border-tono-border transition min-h-[48px] text-[15px]"
          >
            <span>go home</span>
          </Link>
        </div>

        {/* Digest for support — visible only when present */}
        {error.digest ? (
          <div className="mt-10 p-4 rounded-[12px] bg-tono-bg-card border border-tono-border text-left">
            <p className="text-[12px] uppercase tracking-[0.14em] font-semibold text-tono-muted mb-1">
              error reference
            </p>
            <code className="text-[12px] font-mono text-tono-text-soft break-all">
              {error.digest}
            </code>
          </div>
        ) : null}

        {/* Support contact */}
        <div className="mt-8 text-[14px] text-tono-text-softer">
          stuck?{' '}
          <a
            href="mailto:hello@tonoit.com?subject=500%20report%20%E2%80%94%20tono"
            className="text-tono-accent-light hover:text-tono-accent transition font-semibold"
          >
            tell us what happened
          </a>
        </div>
      </div>
    </main>
  )
}
