import fs from 'node:fs/promises'

const site = (process.env.SITE_URL || 'https://mediazhub.com').replace(/\/+$/, '')
const timeoutMs = 15000
const maxLinks = 150

async function get(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'MediazzHub-SEO-Monitor/1.0' },
    })
  } finally {
    clearTimeout(timer)
  }
}

const findings = []
const linkMap = new Map()
const schemaResults = []
let sitemapStatus = 0
let robotsStatus = 0

const sitemapResponse = await get(site + '/sitemap.xml')
sitemapStatus = sitemapResponse.status
const sitemapXml = await sitemapResponse.text()
if (!sitemapResponse.ok) findings.push({ severity: 'critical', type: 'sitemap', url: site + '/sitemap.xml', detail: 'HTTP ' + sitemapStatus })
if (!sitemapXml.includes('<urlset') || !sitemapXml.includes('</urlset>')) {
  findings.push({ severity: 'critical', type: 'sitemap', url: site + '/sitemap.xml', detail: 'Invalid or incomplete XML sitemap structure' })
}
const urls = [...sitemapXml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
  .map(match => match[1].trim())
  .filter(url => {
    try { return new URL(url).origin === new URL(site).origin } catch { return false }
  })

if (!urls.length) findings.push({ severity: 'critical', type: 'sitemap', url: site + '/sitemap.xml', detail: 'No valid same-origin URLs found' })

for (const url of urls) {
  try {
    const response = await get(url)
    const html = await response.text()
    if (!response.ok) findings.push({ severity: 'critical', type: 'page_http', url, detail: 'Sitemap URL returned HTTP ' + response.status })
    const robots = [...html.matchAll(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/gi)].map(x => x[1]).join(' ')
    if (/noindex/i.test(robots)) findings.push({ severity: 'warning', type: 'indexability', url, detail: 'Sitemap URL contains a noindex meta directive' })

    const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    let validSchemas = 0
    for (const block of blocks) {
      try { JSON.parse(block[1]); validSchemas++ }
      catch { findings.push({ severity: 'warning', type: 'schema_json', url, detail: 'Invalid JSON-LD block' }) }
    }
    schemaResults.push({ url, jsonLdBlocks: blocks.length, validJsonLdBlocks: validSchemas })

    for (const match of html.matchAll(/\b(?:href|src)=["']([^"'#]+)["']/gi)) {
      try {
        const target = new URL(match[1], url)
        if (target.origin === new URL(site).origin && ['http:', 'https:'].includes(target.protocol)) linkMap.set(target.href, target.href)
      } catch {}
    }
  } catch (error) {
    findings.push({ severity: 'critical', type: 'page_fetch', url, detail: error.message })
  }
}

const linksToCheck = [...linkMap.keys()].slice(0, maxLinks)
const brokenLinks = []
for (const url of linksToCheck) {
  try {
    const response = await get(url)
    if (response.status >= 400) {
      const item = { url, status: response.status }
      brokenLinks.push(item)
      findings.push({ severity: 'warning', type: 'broken_internal_link', url, detail: 'Internal URL returned HTTP ' + response.status })
    }
  } catch (error) {
    const item = { url, error: error.message }
    brokenLinks.push(item)
    findings.push({ severity: 'warning', type: 'broken_internal_link', url, detail: error.message })
  }
}

try {
  const response = await get(site + '/robots.txt')
  robotsStatus = response.status
  const body = await response.text()
  if (!response.ok) findings.push({ severity: 'warning', type: 'robots', url: site + '/robots.txt', detail: 'HTTP ' + robotsStatus })
  else if (!/sitemap\s*:/i.test(body)) findings.push({ severity: 'warning', type: 'robots', url: site + '/robots.txt', detail: 'Sitemap directive missing' })
} catch (error) {
  findings.push({ severity: 'warning', type: 'robots', url: site + '/robots.txt', detail: error.message })
}

let indexing = []
try {
  const audit = JSON.parse(await fs.readFile('seo-audit-report.json', 'utf8'))
  indexing = (audit.googleSearchConsole?.urlInspections || []).map(item => ({
    url: item.url,
    verdict: item.verdict || '',
    coverageState: item.coverageState || '',
    indexingState: item.indexingState || '',
    error: item.error || '',
  }))
  for (const item of indexing) {
    if (item.error) findings.push({ severity: 'info', type: 'index_inspection_unavailable', url: item.url, detail: item.error })
    else if (item.verdict && !['PASS', 'NEUTRAL'].includes(item.verdict)) findings.push({ severity: 'warning', type: 'indexing', url: item.url, detail: [item.verdict, item.coverageState, item.indexingState].filter(Boolean).join('; ') })
  }
} catch {
  findings.push({ severity: 'info', type: 'indexing', url: site, detail: 'Search Console audit data unavailable in this run' })
}

const summary = {
  pagesInSitemap: urls.length,
  internalLinksDiscovered: linkMap.size,
  internalLinksChecked: linksToCheck.length,
  brokenInternalLinks: brokenLinks.length,
  pagesWithSchemaChecked: schemaResults.length,
  invalidSchemaBlocks: findings.filter(x => x.type === 'schema_json').length,
  indexingUrlsInspected: indexing.length,
  critical: findings.filter(x => x.severity === 'critical').length,
  warnings: findings.filter(x => x.severity === 'warning').length,
}
const report = { generatedAt: new Date().toISOString(), site, sitemapStatus, robotsStatus, summary, indexing, schema: schemaResults, brokenLinks, findings }
await fs.writeFile('seo-monitor-report.json', JSON.stringify(report, null, 2))
const lines = [
  '# Mediazz Hub — SEO monitoring report',
  '',
  'Generated: ' + report.generatedAt,
  'Sitemap HTTP: ' + sitemapStatus + ' | Robots HTTP: ' + robotsStatus,
  '',
  '## Summary',
  ...Object.entries(summary).map(([key, value]) => '- ' + key + ': ' + value),
  '',
  '## Findings',
  ...(findings.length ? findings.map(x => '- **' + x.severity.toUpperCase() + '** [' + x.type + '] ' + x.url + ' — ' + x.detail) : ['- No issues detected by these checks.']),
  '',
  '## Indexing status',
  ...(indexing.length ? indexing.map(x => '- ' + x.url + ' — ' + (x.error || [x.verdict, x.coverageState, x.indexingState].filter(Boolean).join('; '))) : ['- No URL inspection data available.']),
  '',
  '## JSON-LD validation',
  ...schemaResults.map(x => '- ' + x.url + ' — ' + x.validJsonLdBlocks + '/' + x.jsonLdBlocks + ' valid blocks'),
]
await fs.writeFile('seo-monitor-report.md', lines.join('\n'))
console.log('SEO monitoring summary:', JSON.stringify(summary))
