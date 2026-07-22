import Link from 'next/link'
import TonoDemo from './TonoDemo'

const tones = [
  { name: 'warmer', sub: 'soften the edge.', body: 'keep the point. lose the friction.', cls: 'tone-rule-t-warmer' },
  { name: 'clearer', sub: 'cut the noise.', body: 'make the ask easy to find.', cls: 'tone-rule-t-clearer' },
  { name: 'funnier', sub: 'loosen the grip.', body: 'add levity without losing the message.', cls: 'tone-rule-t-funnier' },
  { name: 'safer', sub: 'pull the spike.', body: 'keep Safer visible for the messages that need it.', cls: 'tone-rule-t-safer' },
] as const

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-tono-bg text-tono-text font-sans antialiased overflow-x-clip">
      <header className="sticky top-0 z-30 bg-tono-bg/80 backdrop-blur-md border-b border-tono-border">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-4">
          <Link href="/" className="flex items-center gap-2.5 w-fit" aria-label="tono — back to home">
            <span aria-hidden="true" className="w-3 h-3 rounded-full bg-tono-accent shadow-[0_0_16px_var(--accent-glow)]" />
            <span className="text-[22px] font-bold tracking-[-0.02em]">tono</span>
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 md:px-10 pt-14 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center min-w-0">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tono-accent-soft text-tono-accent-light text-[11px] font-semibold uppercase tracking-wider border border-tono-accent/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tono-accent" />
                communication coach
              </span>
              <p className="text-[14px] md:text-[16px] text-tono-text-soft leading-[1.45] mt-4 sm:mt-5 max-w-xl">
                choose a tone. get one rewrite for that moment.
              </p>
              <p aria-label="pricing and request behavior" className="mt-3 text-[11px] md:text-[12px] tracking-[0.06em] uppercase font-semibold text-tono-text-softer leading-relaxed">
                $3.99/mo · $39.99/yr · auto-renews unless cancelled · text is sent only after you choose a tone
              </p>
              <h1 className="text-[36px] sm:text-[44px] md:text-[60px] leading-[1.05] md:leading-[1.02] font-bold tracking-[-0.025em] mt-3">
                paste a draft.{' '}
                <em className="not-italic text-tono-accent-light">choose how it should land.</em>
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[15px] text-tono-text-soft">
                <span className="text-tono-text-softer">choose one —</span>
                {tones.map((tone) => (
                  <span key={tone.name} className={`inline-flex items-center px-2 py-1 rounded-[8px] tone-bg-soft-${tone.name} tone-text-${tone.name} font-semibold text-[13px]`}>
                    {tone.name}
                  </span>
                ))}
                <span className="text-tono-text">— one tap, one rewrite.</span>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#try-tono" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] bg-tono-accent hover:bg-tono-accent-hover text-white font-semibold transition min-h-[48px]">
                  try the demo <ArrowIcon />
                </a>
                <a href="#pricing" className="inline-flex items-center justify-center px-5 py-3.5 rounded-[12px] bg-tono-bg-card border border-tono-accent/40 hover:border-tono-accent font-semibold transition min-h-[48px]">
                  see pricing →
                </a>
                <a href="#how" className="inline-flex items-center justify-center px-5 py-3.5 min-h-[48px] text-tono-text-soft hover:text-tono-text font-semibold transition">
                  how it works →
                </a>
              </div>
              <p className="text-xs text-tono-muted mt-4">demo without checkout. paid plans are $3.99/mo or $39.99/yr.</p>
            </div>
            <aside id="try-tono" className="relative scroll-mt-32"><TonoDemo /></aside>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-tono-border bg-tono-bg-soft">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">how it works</span>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] mt-3">three explicit steps.</h2>
          <ol className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              ['1', 'paste the draft', 'ordinary typing creates no rewrite request.'],
              ['2', 'choose one tone', 'select warmer, clearer, funnier, or safer. Safer remains visible.'],
              ['3', 'review one result', 'one selection creates one rewrite. Tono never sends on your behalf.'],
            ].map(([n, title, body]) => (
              <li key={n} className="bg-tono-bg-card border border-tono-border rounded-[18px] p-6">
                <span className="w-9 h-9 rounded-full bg-tono-accent-soft text-tono-accent-light font-bold grid place-items-center border border-tono-accent/40">{n}</span>
                <h3 className="text-[17px] font-semibold mt-4">{title}</h3>
                <p className="text-[14px] text-tono-text-soft leading-[1.6] mt-2">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-tono-border">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">choose a tone</span>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] mt-3">one choice. one result.</h2>
          <p className="text-[15px] text-tono-text-soft leading-[1.6] mt-3 max-w-2xl">opening the tone choices requests nothing. selecting one asks for that tone only.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {tones.map((tone) => (
              <article key={tone.name} className={`bg-tono-bg-card border border-tono-border rounded-[18px] p-5 ${tone.cls}`}>
                <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full tone-dot-${tone.name}`} /><span className="text-[15px] font-semibold">{tone.name}</span></div>
                <p className="text-[13px] text-tono-text-softer mt-1.5 font-medium">{tone.sub}</p>
                <p className="text-[13px] text-tono-text-soft leading-[1.6] mt-3">{tone.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-tono-border bg-tono-bg">
        <div className="max-w-[1080px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">pricing</span>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] mt-3">simple pricing for intentional rewrites.</h2>
          <div className="grid md:grid-cols-2 gap-5 mt-10">
            <article className="bg-tono-bg-card border border-tono-border rounded-[18px] p-7 flex flex-col">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-tono-text-softer">demo</p>
              <p className="text-[40px] font-bold mt-2">$0 <span className="text-[15px] font-normal text-tono-text-softer">to explore</span></p>
              <p className="text-[14px] text-tono-text-soft mt-3">try the tone-selection flow without starting checkout.</p>
              <ul className="mt-6 space-y-2.5 text-[14px] text-tono-text-soft flex-1">
                <li>✓ one selected tone per request</li><li>✓ safer remains visible</li><li>✓ tono never sends on your behalf</li>
              </ul>
              <a href="#try-tono" className="mt-8 inline-flex items-center justify-center px-5 py-3 rounded-[12px] border border-tono-border-strong hover:border-tono-accent font-semibold min-h-[44px]">try the demo</a>
            </article>
            <article className="bg-tono-bg-card border border-tono-accent/40 rounded-[18px] p-7 flex flex-col relative">
              <span className="absolute -top-3 right-5 px-3 py-1 rounded-full bg-tono-accent text-white text-[10px] font-semibold uppercase tracking-wider">tono pro</span>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">pro</p>
              <p className="text-[40px] font-bold mt-2">$3.99 <span className="text-[15px] font-normal text-tono-text-softer">/ month</span></p>
              <p className="text-[14px] text-tono-text-soft mt-3">or $39.99 per year.</p>
              <ul className="mt-6 space-y-2.5 text-[14px] text-tono-text-soft flex-1">
                <li>✓ one selected tone per request</li><li>✓ safer always available</li><li>✓ monthly or annual billing</li>
              </ul>
              <a href="mailto:hi@tonoit.com?subject=tono%20pro" className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-tono-accent hover:bg-tono-accent-hover text-white font-semibold min-h-[44px]">ask about pro <ArrowIcon /></a>
            </article>
          </div>
          <p className="text-center text-[13px] text-tono-text-softer mt-8">subscriptions auto-renew at $3.99/mo or $39.99/yr unless cancelled. purchase and cancellation terms are shown by the applicable purchase platform.</p>
        </div>
      </section>

      <section className="border-t border-tono-border bg-tono-bg-soft">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-16 md:py-20 text-center">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">request discipline</span>
          <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.02em] mt-5">explicit actions only.</h2>
          <p className="mt-5 text-[15px] md:text-[16px] text-tono-text-soft leading-[1.65]">ordinary typing does not create a rewrite request. one tone selection creates one rewrite request. tono never sends messages on your behalf.</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-6 text-[12px] uppercase tracking-[0.14em] font-semibold text-tono-text-softer"><li>no hidden rewrite</li><li>one tap, one request</li><li>you decide what to send</li></ul>
        </div>
      </section>

      <section className="border-t border-tono-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-20 md:py-24 text-center">
          <h2 className="text-[32px] md:text-[44px] font-bold">try one intentional rewrite.</h2>
          <p className="text-[16px] text-tono-text-soft mt-4">choose a tone, review one result, and decide what happens next.</p>
          <a href="#try-tono" className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] bg-tono-accent hover:bg-tono-accent-hover text-white font-semibold min-h-[48px]">try the demo <ArrowIcon /></a>
        </div>
      </section>
    </main>
  )
}

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
}
