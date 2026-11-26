import fs from 'node:fs/promises'

const site = (process.env.SITE_URL || 'https://mediazhub.com').replace(/\/+$/, '')
const timeout = 20000
const typeNames = new Set()
const pages = []
const findings = []

function strip(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim()
}
function tags(html, tag) {
  return [...html.matchAll(new RegExp('<' + tag + '\\b[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'gi'))]
    .map(x => strip(x[1])).filter(Boolean)
}
function meta(html, name) {
  const candidates = [...html.matchAll(/<meta\b[^>]*>/gi)].map(x => x[0])
  const tag = candidates.find(candidate => {
    const key = candidate.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1]
    return key?.toLowerCase() === name.toLowerCase()
  })
  return tag?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || ''
}
function collectTypes(value, out = []) {
  if (!value || typeof value !== 'object') return out
  if (Array.isArray(value)) { for (const item of value) collectTypes(item, out); return out }
  const type = value['@type']
  if (Array.isArray(type)) out.push(...type.map(String))
  else if (type) out.push(String(type))
  if (value['@graph']) collectTypes(value['@graph'], out)
  return out
}

const sitemapResponse = await fetch(site + '/sitemap.xml', { signal: AbortSignal.timeout(timeout) })
if (!sitemapResponse.ok) throw new Error('Sitemap request failed: HTTP ' + sitemapResponse.status)
const xml = await sitemapResponse.text()
const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(x => x[1].trim()).slice(0, 50)

for (const url of urls) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: { 'user-agent': 'MediazzHub-AEO-Audit/1.0' } })
    const html = await response.text()
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
    const description = meta(html, 'description')
    const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || ''
    const h1 = tags(html, 'h1')
    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(x => ({ level: Number(x[1]), text: strip(x[2]) })).filter(x => x.text)
    const paragraphs = tags(html, 'p')
    const faqHeadings = headings.filter(x => x.text.includes('?'))
    const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    const types = []
    let invalidJsonLd = 0
    for (const block of jsonLd) {
      try { types.push(...collectTypes(JSON.parse(block[1]))) }
      catch { invalidJsonLd++ }
    }
    const normalizedTypes = [...new Set(types)]
    for (const type of normalizedTypes) typeNames.add(type)
    const wordCount = strip(html).split(/\s+/).filter(Boolean).length
    const clientRenderedApp = /<div\s+id=["']root["']\s*>\s*<\/div>/i.test(html) && /type=["']module["'][^>]*src=/i.test(html)
    const signals = {
      hasTitle: Boolean(title),
      hasDescription: Boolean(description),
      hasCanonical: Boolean(canonical),
      oneH1: clientRenderedApp ? null : h1.length === 1,
      hasQuestionHeadings: clientRenderedApp ? null : faqHeadings.length > 0,
      hasFaqSchema: normalizedTypes.includes('FAQPage') || (clientRenderedApp ? null : false),
      hasServiceSchema: normalizedTypes.includes('Service') || (clientRenderedApp ? null : false),
      hasOrganizationSchema: normalizedTypes.includes('Organization') || normalizedTypes.includes('LocalBusiness'),
      hasBreadcrumbSchema: normalizedTypes.includes('BreadcrumbList') || (clientRenderedApp ? null : false),
      hasOpenGraph: Boolean(meta(html, 'og:title') || meta(html, 'og:description')),
      hasEnoughVisibleText: clientRenderedApp ? null : wordCount >= 120,
      hasAnswerParagraphs: clientRenderedApp ? null : paragraphs.some(p => p.split(/\s+/).length >= 15 && p.split(/\s+/).length <= 90),
    }
    const knownSignals = Object.values(signals).filter(value => value !== null)
    const score = knownSignals.filter(Boolean).length
    const page = { url, status: response.status, clientRenderedApp, title, description, h1, headings, paragraphCount: paragraphs.length, visibleWordCount: wordCount, schemaTypes: normalizedTypes, invalidJsonLd, signals, readinessIndicators: score + '/' + knownSignals.length, unverifiedSignals: Object.entries(signals).filter(([, value]) => value === null).map(([key]) => key) }
    pages.push(page)
    for (const [key, value] of Object.entries(signals)) {
      if (value === false) findings.push({ url, signal: key, detail: 'Missing or not detected in the initial HTML.' })
    }
    if (invalidJsonLd) findings.push({ url, signal: 'invalidJsonLd', detail: invalidJsonLd + ' invalid JSON-LD block(s).' })
    if (!response.ok) findings.push({ url, signal: 'httpStatus', detail: 'HTTP ' + response.status })
  } catch (error) {
    findings.push({ url, signal: 'fetch', detail: error.message })
  }
}

const summary = {
  pagesChecked: pages.length,
  clientRenderedPages: pages.filter(page => page.clientRenderedApp).length,
  averageReadinessIndicators: pages.length
    ? Number((pages.reduce((sum, page) => sum + Number(page.readinessIndicators.split('/')[0]), 0) / pages.length).toFixed(1))
    : 0,
  unverifiedPageSignals: pages.reduce((sum, page) => sum + page.unverifiedSignals.length, 0),
  schemaTypesFound: [...typeNames].sort(),
  pagesWithFaqSignals: pages.filter(page => page.signals.hasQuestionHeadings || page.signals.hasFaqSchema).length,
  pagesWithServiceSchema: pages.filter(page => page.signals.hasServiceSchema).length,
  findings: findings.length,
}
const report = {
  generatedAt: new Date().toISOString(),
  site,
  note: 'Readiness indicators are heuristic checks on fetched HTML, not Google ranking scores and not a measurement of AI-answer visibility. For client-rendered React pages, content and page-specific schema signals are marked unverified rather than missing because this static fetch does not execute JavaScript.',
  summary,
  pages,
  findings,
}
await fs.writeFile('aeo-readiness-report.json', JSON.stringify(report, null, 2))
const lines = [
  '# Mediazz Hub — AEO readiness audit',
  '',
  'Generated: ' + report.generatedAt,
  '> ' + report.note,
  '',
  '## Summary',
  '- Pages checked: ' + summary.pagesChecked,
  '- Client-rendered pages: ' + summary.clientRenderedPages,
  '- Average readiness indicators (verified signals only): ' + summary.averageReadinessIndicators,
  '- Unverified signals on client-rendered pages: ' + summary.unverifiedPageSignals,
  '- Schema types found: ' + (summary.schemaTypesFound.join(', ') || 'none'),
  '- Pages with FAQ/question signals: ' + summary.pagesWithFaqSignals,
  '- Pages with Service schema: ' + summary.pagesWithServiceSchema,
  '- Findings: ' + summary.findings,
  '',
  '## Page-level checks',
  '| Page | HTTP | Indicators | Render mode | Schema types | FAQ/question signals |',
  '|---|---:|---:|---|---|---|',
  ...pages.map(page => '| ' + page.url + ' | ' + page.status + ' | ' + page.readinessIndicators + ' | ' + (page.clientRenderedApp ? 'React (unverified)' : 'HTML') + ' | ' + (page.schemaTypes.join(', ') || 'none detected in HTML') + ' | ' + (page.signals.hasQuestionHeadings === null || page.signals.hasFaqSchema === null ? 'Unverified' : page.signals.hasQuestionHeadings || page.signals.hasFaqSchema ? 'Yes' : 'No') + ' |'),
  '',
  '## Findings',
  ...(findings.length ? findings.map(x => '- ' + x.url + ' — **' + x.signal + '**: ' + x.detail) : ['- No missing signals detected by this heuristic audit.']),
  '',
  '## Measurement limitation',
  'Google does not provide a complete official report of how often a site is cited in every AI answer engine. This report measures on-page readiness signals only; actual AI answer visibility requires separate, repeatable external sampling.',
]
await fs.writeFile('aeo-readiness-report.md', lines.join('\n'))
console.log('AEO readiness report generated:', JSON.stringify(summary))
