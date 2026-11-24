const baseUrl = (process.env.SITE_URL || 'https://mediazhub.com').replace(/\/+$/, '')
const timeoutMs = 20000

async function fetchText(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'MediazzHub-SEO-Audit/1.0' },
    })
    return { response, text: await response.text() }
  } finally {
    clearTimeout(timer)
  }
}

function metaContent(html, name) {
  const tag = html.match(new RegExp('<meta\\b(?=[^>]*(?:name|property)=["\\']' + name + '["\\'])[^>]*>', 'i'))?.[0]
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || ''
}

function inspectHtml(html) {
  return {
    title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '',
    description: metaContent(html, 'description'),
    canonical: html.match(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["']/i)?.[1] || '',
    h1Count: (html.match(/<h1\b/gi) || []).length,
    robots: metaContent(html, 'robots'),
    jsonLdCount: (html.match(/application\/ld\+json/gi) || []).length,
  }
}

const findings = []
const pageResults = []
let sitemapText = ''

try {
  const { response, text } = await fetchText(new URL('/sitemap.xml', baseUrl).toString())
  sitemapText = text
  if (!response.ok) findings.push({ severity: 'error', item: 'sitemap.xml', detail: 'HTTP ' + response.status })
} catch (error) {
  findings.push({ severity: 'error', item: 'sitemap.xml', detail: String(error) })
}

const urls = [...sitemapText.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
  .map(match => match[1].trim())
  .filter(url => url.startsWith(baseUrl))

if (!urls.length) findings.push({ severity: 'error', item: 'sitemap.xml', detail: 'No same-domain URLs found' })

for (const url of urls) {
  try {
    const { response, text } = await fetchText(url)
    const seo = inspectHtml(text)
    pageResults.push({ url, status: response.status, ...seo })
    if (!response.ok) findings.push({ severity: 'error', item: url, detail: 'HTTP ' + response.status })
    if (!seo.title) findings.push({ severity: 'warning', item: url, detail: 'Missing title tag' })
    if (!seo.description) findings.push({ severity: 'warning', item: url, detail: 'Missing meta description' })
    if (!seo.canonical) findings.push({ severity: 'warning', item: url, detail: 'Missing canonical URL' })
    if (seo.h1Count !== 1) findings.push({ severity: 'warning', item: url, detail: 'Expected one H1; found ' + seo.h1Count })
    if (/noindex/i.test(seo.robots)) findings.push({ severity: 'warning', item: url, detail: 'Page has noindex directive' })
    if (!seo.jsonLdCount) findings.push({ severity: 'info', item: url, detail: 'No JSON-LD found in initial HTML' })
  } catch (error) {
    findings.push({ severity: 'error', item: url, detail: String(error) })
  }
}

try {
  const { response, text } = await fetchText(new URL('/robots.txt', baseUrl).toString())
  if (!response.ok) findings.push({ severity: 'warning', item: 'robots.txt', detail: 'HTTP ' + response.status })
  else if (!text.includes('sitemap.xml')) findings.push({ severity: 'warning', item: 'robots.txt', detail: 'Sitemap directive not found' })
} catch (error) {
  findings.push({ severity: 'warning', item: 'robots.txt', detail: String(error) })
}

const counts = {
  pagesChecked: pageResults.length,
  errors: findings.filter(item => item.severity === 'error').length,
  warnings: findings.filter(item => item.severity === 'warning').length,
  notes: findings.filter(item => item.severity === 'info').length,
}
const report = { generatedAt: new Date().toISOString(), site: baseUrl, counts, pages: pageResults, findings }
const fs = await import('node:fs/promises')
await fs.writeFile('seo-audit-report.json', JSON.stringify(report, null, 2))

const lines = [
  '# Mediazz Hub — SEO technical audit',
  '',
  'Generated: ' + report.generatedAt,
  'Site: ' + baseUrl,
  '',
  '## Summary',
  '- Pages checked: ' + counts.pagesChecked,
  '- Errors: ' + counts.errors,
  '- Warnings: ' + counts.warnings,
  '- Informational notes: ' + counts.notes,
  '',
  '## Findings',
  ...(findings.length ? findings.map(item => '- **' + item.severity.toUpperCase() + '** — ' + item.item + ': ' + item.detail) : ['- No technical issues detected by this basic audit.']),
  '',
  '## Page checks',
  '| URL | HTTP | Title | Description | Canonical | H1 count | JSON-LD |',
  '|---|---:|---|---|---|---:|---:|',
  ...pageResults.map(page => '| ' + page.url + ' | ' + page.status + ' | ' + (page.title ? 'Yes' : 'No') + ' | ' + (page.description ? 'Yes' : 'No') + ' | ' + (page.canonical ? 'Yes' : 'No') + ' | ' + page.h1Count + ' | ' + page.jsonLdCount + ' |'),
  '',
  '> Technical baseline only; keyword positions require Google Search Console data.',
]
await fs.writeFile('seo-audit-report.md', lines.join('\n'))
console.log(JSON.stringify(counts, null, 2))
if (counts.errors > 0) process.exitCode = 1
