import Link from 'next/link'

function CheckIcon() {
  return <span className="text-tono-tone-safer font-semibold" aria-hidden="true">✓</span>
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-tono-bg text-tono-text font-sans antialiased">
      <div className="max-w-[1080px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <header className="mb-12 max-w-2xl">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">pricing</span>
          <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.02em] mt-3 leading-[1.05]">simple pricing for intentional rewrites.</h1>
          <p className="text-[16px] text-tono-text-soft leading-[1.6] mt-5">try the demo without checkout. ask about Pro when you are ready.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-5">
          <article data-tier="demo" className="bg-tono-bg-card border border-tono-border rounded-[18px] p-7 flex flex-col">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-tono-text-softer">demo</p>
            <p className="text-[40px] md:text-[44px] font-bold mt-2">$0 <span className="text-[15px] font-normal text-tono-text-softer">to explore</span></p>
            <p className="text-[14px] text-tono-text-soft leading-[1.55] mt-3">choose a tone and inspect one result without starting checkout.</p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-tono-text-soft flex-1">
              <li className="flex gap-2"><CheckIcon /><span>one selected tone per request</span></li>
              <li className="flex gap-2"><CheckIcon /><span>safer remains visible</span></li>
              <li className="flex gap-2"><CheckIcon /><span>tono never sends on your behalf</span></li>
            </ul>
            <Link href="/#try-tono" className="mt-8 inline-flex items-center justify-center px-5 py-3 rounded-[12px] border border-tono-border-strong hover:border-tono-accent font-semibold min-h-[44px] text-[14px]">try the demo</Link>
          </article>

          <article data-tier="pro" className="bg-tono-bg-card border border-tono-accent/40 rounded-[18px] p-7 flex flex-col relative">
            <span className="absolute -top-3 right-5 px-3 py-1 rounded-full bg-tono-accent text-white text-[10px] font-semibold uppercase tracking-wider">tono pro</span>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-tono-accent-light">pro</p>
            <p className="text-[40px] md:text-[44px] font-bold mt-2">$3.99 <span className="text-[15px] font-normal text-tono-text-softer">/ month</span></p>
            <p className="text-[14px] text-tono-text-soft leading-[1.55] mt-3">or $39.99 per year.</p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-tono-text-soft flex-1">
              <li className="flex gap-2"><CheckIcon /><span>one selected tone per request</span></li>
              <li className="flex gap-2"><CheckIcon /><span>safer always available</span></li>
              <li className="flex gap-2"><CheckIcon /><span>monthly or annual billing</span></li>
            </ul>
            <a href="mailto:hi@tonoit.com?subject=tono%20pro" className="mt-8 inline-flex items-center justify-center px-5 py-3 rounded-[12px] bg-tono-accent hover:bg-tono-accent-hover text-white font-semibold min-h-[44px] text-[14px]">ask about pro</a>
          </article>
        </div>

        <p className="text-center text-[13px] text-tono-text-softer mt-10">subscriptions auto-renew at $3.99/mo or $39.99/yr unless cancelled. purchase and cancellation terms are shown by the applicable purchase platform.</p>
        <p className="text-center text-[13px] text-tono-text-softer mt-3">prices in USD. this page does not start a charge.</p>
        <div className="text-center mt-6"><Link href="/" className="text-[13px] text-tono-text-softer hover:text-tono-text">← back to tono</Link></div>
      </div>
    </main>
  )
}
