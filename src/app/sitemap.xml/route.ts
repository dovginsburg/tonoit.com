// Sitemap for tonoit.com.
//
// Served at both /sitemap.xml and /app/sitemap.xml. Lists every public,
// indexable surface so search engines can find them without crawling
// from /. Marketing pages are static, the editor and history require
// auth, and the login page is a thin shell — none of those are in
// the sitemap.
//
// URLs use the APEX (non-basePath) form because the Vercel deployment
// maps /pricing, /features, etc. to /app/* and crawlers expect the
// surface that a human user lands on.
//
// Update lastmod on real edits; static copy/published dates are fine
// for the marketing surface because the underlying route map is what
// the crawler cares about, not the prose.

import { NextResponse } from 'next/server';

const SITE = 'https://tonoit.com';
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// (apex path, priority, changefreq)
const ROUTES: Array<[string, string, string]> = [
  ['/', '1.0', 'weekly'],
  ['/pricing', '0.9', 'weekly'],
  ['/features', '0.8', 'monthly'],
  ['/about', '0.7', 'monthly'],
  ['/contact', '0.5', 'monthly'],
  ['/blog', '0.7', 'weekly'],
  ['/privacy', '0.3', 'yearly'],
  ['/terms', '0.3', 'yearly'],
  ['/login', '0.5', 'monthly'],
  ['/checkout/success', '0.3', 'yearly'],
];

function urlEntry(path: string, priority: string, changefreq: string) {
  return `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(([p, prio, freq]) => urlEntry(p, prio, freq)).join('\n')}
</urlset>
`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
