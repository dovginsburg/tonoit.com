import Link from 'next/link'

const footerLink = 'inline-flex items-center min-h-[44px] text-tono-text-soft hover:text-tono-text transition'

export default function TonoFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-tono-border bg-tono-bg-soft">
      <div className="md:hidden border-b border-tono-border"><div className="max-w-[1180px] mx-auto px-6 py-3"><Link href="/" className={footerLink}>← Home</Link></div></div>
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div className="sm:col-span-2 md:col-span-1"><div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-tono-accent" /><span className="text-[16px] font-bold">tono</span></div><p className="text-[13px] text-tono-text-soft mt-3">say what you mean. one intentional rewrite at a time.</p></div>
          <FooterColumn title="Product" items={[['How it works','/#how'],['Pricing','/pricing'],['Demo','/#try-tono'],['Sign in','/login'],['Changelog','/blog']]} />
          <FooterColumn title="Company" items={[['About','/about'],['Contact','/contact'],['Feedback','mailto:hi@tonoit.com?subject=tono%20feedback']]} />
          <FooterColumn title="Legal" items={[['Privacy','/privacy'],['Terms','/terms'],['Data deletion','mailto:hi@tonoit.com?subject=tono%20data%20deletion']]} />
          <FooterColumn title="Elsewhere" items={[['GitHub','https://github.com/dovginsburg/tono-platform'],['Pro questions','mailto:hi@tonoit.com?subject=tono%20pro']]} />
        </div>
        <p className="mt-8 text-[12px] text-tono-text-softer leading-relaxed">subscriptions auto-renew at $3.99/mo or $39.99/yr unless cancelled. purchase and cancellation terms are shown by the applicable purchase platform.</p>
        <div className="mt-8 pt-6 border-t border-tono-border flex flex-col sm:flex-row justify-between gap-2"><p className="text-[11px] text-tono-muted">© {year} tono. all rights reserved.</p><p className="text-[11px] text-tono-muted">one tone selection creates one rewrite request. tono never sends on your behalf.</p></div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }: { title: string; items: [string, string][] }) {
  return <div><p className="text-[11px] uppercase tracking-wider font-semibold text-tono-text-softer mb-2">{title}</p><ul>{items.map(([label, href]) => <li key={label}><a href={href} className={footerLink}>{label}</a></li>)}</ul></div>
}
