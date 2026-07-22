// robots.txt for tonoit.com.
//
// Served at both /robots.txt and /app/robots.txt. Vercel (vercel.json) used
// to rewrite /robots.txt -> /app/robots.txt, which shadowed the public/
// static file and returned this inverted form. We now let this route
// handler serve BOTH apex paths and fix the crawlable surface.
//
// Two sections:
//   1. Allow the public marketing pages + auth surface so search engines
//      can index them and link to them. The marketing root "/" MUST be
//      allow-listed (a launch showstopper per launch-audit GAP-12).
//   2. Disallow the editor (/app), per-user history, and /api/* so
//      user-specific routes are not crawled or indexed. /auth/* is
//      always disallowed (token-bearing callbacks must never be
//      indexed).
//
// Sitemap is declared at the canonical apex location —
// https://tonoit.com/sitemap.xml — because that's where crawlers
// expect it.

import { NextResponse } from 'next/server';

const BODY = `# tonoit.com — robots
User-agent: *
Allow: /
Allow: /pricing
Allow: /features
Allow: /about
Allow: /contact
Allow: /blog
Allow: /privacy
Allow: /terms
Allow: /login
Allow: /checkout/success
Disallow: /app
Disallow: /history
Disallow: /api/
Disallow: /auth/

Sitemap: https://tonoit.com/sitemap.xml
`;

export async function GET() {
  return new NextResponse(BODY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
