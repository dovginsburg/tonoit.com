'use client'

// ──────────────────────────────────────────────────────────────────────
// /global-error — Tono top-level error fallback.
//
// Replaces the ENTIRE root layout when an error escapes all other
// error boundaries (root layout crashes, provider failure, hydration
// mismatch at the very top of the tree). Because it replaces the
// root <html>, it must define its own <html><body>.
//
// Rules from the App Router docs:
//   • Must be a Client Component.
//   • Must define its own <html><body> tags.
//   • Receives `error` and `reset`; on `reset()` the framework retries
//     the root segment.
//
// Why a custom UI: Vercel's default global error replaces the page
// with a generic message that has zero recovery affordance. Launch-
// audit GAP-13 requires branded 500-state recovery everywhere a
// visitor can land — including the worst-case top-level failure.
// ──────────────────────────────────────────────────────────────────────

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" data-theme="tono" className="dark">
      <body
        style={{
          background: '#000',
          color: '#fff',
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          margin: 0,
          minHeight: '100vh',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <main
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
          }}
        >
          <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#F472B6',
                boxShadow: '0 0 12px rgba(168,85,247,0.45)',
                marginBottom: 24,
              }}
            />
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#D8B4FE',
                margin: '0 0 12px',
              }}
            >
              error 500
            </p>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              tono hit an unexpected error.
            </h1>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: '#C9C9D1',
                marginTop: 16,
              }}
            >
              the page didn&rsquo;t finish loading. your draft stays in
              your browser, and you can safely retry.
            </p>
            {error.digest ? (
              <p
                style={{
                  fontFamily:
                    "ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace",
                  fontSize: 12,
                  color: '#9CA3AF',
                  marginTop: 24,
                  padding: 12,
                  border: '1px solid #1F1F23',
                  borderRadius: 10,
                  background: '#111113',
                  wordBreak: 'break-all',
                }}
              >
                ref: {error.digest}
              </p>
            ) : null}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 28,
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  padding: '14px 22px',
                  borderRadius: 12,
                  background: '#A855F7',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 15,
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: 48,
                  minWidth: 180,
                }}
              >
                try again
              </button>
              <a
                href="mailto:hello@tonoit.com?subject=global%20500%20report%20%E2%80%94%20tono"
                style={{
                  color: '#D8B4FE',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                email support
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
