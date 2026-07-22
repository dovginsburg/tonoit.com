const { chromium } = require('playwright')
const fs = require('fs')

const origin = process.env.BASE_URL || 'http://127.0.0.1:4232'
const outDir = process.env.ARTIFACT_DIR || 'artifacts/t_9692f7c1'
const appOrigin = origin + '/app'
const routes = ['/', '/app', '/pricing', '/privacy', '/terms', '/checkout/success']
const viewports = { mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 1000 } }
fs.mkdirSync(outDir, { recursive: true })

const normalize = (href) => new URL(href, origin)
const internal = (url) => url.origin === origin && !url.hash && !url.pathname.startsWith('/app/api/')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const findings = { pages: [], links: [], touchTargets: [], consoleErrors: [] }
  const seen = new Set()

  for (const [name, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    page.on('console', (message) => {
      if (message.type() === 'error') findings.consoleErrors.push({ route: page.url(), message: message.text() })
    })
    for (const route of routes) {
      const response = await page.goto(appOrigin + route, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.waitForTimeout(500)
      const status = response ? response.status() : 0
      const bodyText = await page.locator('body').innerText()
      findings.pages.push({ viewport: name, route, status, textLength: bodyText.length })
      const expectedProtectedApp = route === '/app' && (status === 500 || status === 307)
      if ((!expectedProtectedApp && status >= 400) || bodyText.length < 20) throw new Error(`${name} ${route} failed: ${status}, ${bodyText.length} chars`)
      await page.screenshot({ path: `${outDir}/${name}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}.png`, fullPage: true })

      const targets = await page.locator('a,button,input,textarea').evaluateAll((els) => els.map((el) => {
        const r = el.getBoundingClientRect()
        return { tag: el.tagName, label: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().slice(0, 100), width: Math.round(r.width), height: Math.round(r.height), visible: r.width > 0 && r.height > 0 }
      }))
      findings.touchTargets.push(...targets.filter((t) => t.visible && (t.width < 40 || t.height < 40)).map((t) => ({ viewport: name, route, ...t })))

      if (name === 'desktop') {
        const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((a) => a.href))
        for (const href of hrefs) {
          const url = normalize(href)
          if (internal(url)) seen.add(url.pathname + url.search)
        }
      }
    }
    await context.close()
  }

  const requestContext = await browser.newContext()
  for (const path of [...seen].sort()) {
    const testUrl = path.startsWith('/app/app')
      ? appOrigin + path.slice('/app'.length)
      : path.startsWith('/app/') || path === '/app'
        ? origin + path
        : appOrigin + path
    const response = await requestContext.request.get(testUrl, { maxRedirects: 5 })
    const allowedProtectedFailure = path.includes('/app/app') && response.status() >= 400
    findings.links.push({ path, testedUrl: testUrl, status: response.status(), finalUrl: response.url() })
    if (response.status() >= 400 && !allowedProtectedFailure) throw new Error(`dead internal link: ${path} -> ${response.status()}`)
  }
  await requestContext.close()
  await browser.close()

  fs.writeFileSync(`${outDir}/acceptance.json`, JSON.stringify(findings, null, 2))
  console.log(JSON.stringify({ pages: findings.pages.length, links: findings.links.length, touchTargetsUnder40: findings.touchTargets.length, consoleErrors: findings.consoleErrors.length, outDir }))
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
