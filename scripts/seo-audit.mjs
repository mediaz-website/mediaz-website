import { createSign } from 'node:crypto'

const baseUrl = (process.env.SITE_URL || 'https://mediazhub.com').replace(/\/+$/, '')
const timeoutMs = 20000

async function fetchText(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'MediazzHub-SEO-Audit/1.0', ...(options.headers || {}) },
    })
    return { response, text: await response.text() }
  } finally {
    clearTimeout(timer)
  }
}

function metaContent(html, name) {
  const tag = html.match(/<meta\b[^>]*>/gi)?.find(candidate => {
    const lower = candidate.toLowerCase()
    const value = name.toLowerCase()
    return lower.includes('name="' + value + '"') || lower.includes("name='" + value + "'") ||
      lower.includes('property="' + value + '"') || lower.includes("property='" + value + "'")
  })
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || ''
}

function inspectHtml(html) {
  return {
    title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '',
    description: metaContent(html, 'description'),
    canonical: html.match(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["']/i)?.[1] || '',
    h1Count: (html.match(/<h1\\b/gi) || []).length,
    robots: metaContent(html, 'robots'),
    jsonLdCount: (html.match(/application\/ld\+json/gi) || []).length,
  }
}

function base64url(value) {
  return Buffer.from(value).toString('base64url')
}

async function getSearchConsoleData() {
  const rawCredentials = process.env.GSC_SERVICE_ACCOUNT_JSON
  if (!rawCredentials) return { status: 'not_configured', rows: [], property: '' }

  const credentials = JSON.parse(rawCredentials)
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const unsignedToken = header + '.' + claim
  const signer = createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()
  const assertion = unsignedToken + '.' + signer.sign(credentials.private_key, 'base64url')

  const tokenResult = await fetchText('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  const tokenData = JSON.parse(tokenResult.text)
  if (!tokenResult.response.ok || !tokenData.access_token) {
    throw new Error('Google token request failed: ' + (tokenData.error_description || tokenData.error || tokenResult.response.status))
  }

  const headers = { authorization: 'Bearer ' + tokenData.access_token, 'content-type': 'application/json' }
  const sitesResult = await fetchText('https://searchconsole.googleapis.com/webmasters/v3/sites', { headers })
  const sitesData = JSON.parse(sitesResult.text)
  if (!sitesResult.response.ok) throw new Error('Search Console sites request failed: ' + sitesResult.response.status)

  const candidates = [
    'sc-domain:mediazhub.com',
    'https://mediazhub.com/',
    'https://www.mediazhub.com/',
  ]
  const property = candidates.find(candidate => (sitesData.siteEntry || []).some(site => site.siteUrl === candidate))
  if (!property) {
    const available = (sitesData.siteEntry || []).map(site => site.siteUrl)
    throw new Error('No matching Search Console property found. Accessible properties: ' + (available.join(', ') || 'none'))
  }

  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 2)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 27)
  const formatDate = date => date.toISOString().slice(0, 10)
  const queryResult = await fetchText(
    'https://searchconsole.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(property) + '/searchAnalytics/query',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        startDate: formatDate(start),
        endDate: formatDate(end),
        dimensions: ['query', 'page'],
        rowLimit: 1000,
        type: 'web',
      }),
    },
  )
  const queryData = JSON.parse(queryResult.text)
  if (!queryResult.response.ok) throw new Error('Search Analytics request failed: ' + queryResult.response.status + ' ' + (queryData.error?.message || ''))
  return {
    status: 'connected',
    property,
    startDate: formatDate(start),
    endDate: formatDate(end),
    rows: queryData.rows || [],
  }
}

const findings = []
const pageResults = []
let sitemapText = ''
let gsc = { status: 'not_configured', rows: [], property: '' }

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

try {
  gsc = await getSearchConsoleData()
  if (gsc.status === 'connected') {
    console.log('Google Search Console connected. Rows received:', gsc.rows.length)
  } else {
    console.log('Google Search Console secret not configured; skipping performance data.')
  }
} catch (error) {
  gsc = { status: 'error', rows: [], property: '' }
  findings.push({ severity: 'warning', item: 'Google Search Console', detail: String(error) })
}

const counts = {
  pagesChecked: pageResults.length,
  errors: findings.filter(item => item.severity === 'error').length,
  warnings: findings.filter(item => item.severity === 'warning').length,
  notes: findings.filter(item => item.severity === 'info').length,
}
const report = { generatedAt: new Date().toISOString(), site: baseUrl, counts, googleSearchConsole: gsc, pages: pageResults, findings }
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
  '## Google Search Console',
  '- Connection: ' + gsc.status,
  ...(gsc.status === 'connected' ? [
    '- Property: ' + gsc.property,
    '- Date range: ' + gsc.startDate + ' to ' + gsc.endDate,
    '- Search rows: ' + gsc.rows.length,
    '',
    '| Query | Page | Clicks | Impressions | CTR | Position |',
    '|---|---|---:|---:|---:|---:|',
    ...gsc.rows.slice(0, 100).map(row => '| ' + (row.keys?.[0] || '').replace(/\\|/g, ' ') + ' | ' + (row.keys?.[1] || '').replace(/\\|/g, ' ') + ' | ' + (row.clicks || 0) + ' | ' + (row.impressions || 0) + ' | ' + ((row.ctr || 0) * 100).toFixed(2) + '% | ' + (row.position || 0).toFixed(1) + ' |'),
  ] : []),
  '',
  '## Findings',
  ...(findings.length ? findings.map(item => '- **' + item.severity.toUpperCase() + '** — ' + item.item + ': ' + item.detail) : ['- No technical issues detected by this basic audit.']),
  '',
  '## Page checks',
  '| URL | HTTP | Title | Description | Canonical | H1 count | JSON-LD |',
  '|---|---:|---|---|---|---:|---:|',
  ...pageResults.map(page => '| ' + page.url + ' | ' + page.status + ' | ' + (page.title ? 'Yes' : 'No') + ' | ' + (page.description ? 'Yes' : 'No') + ' | ' + (page.canonical ? 'Yes' : 'No') + ' | ' + page.h1Count + ' | ' + page.jsonLdCount + ' |'),
  '',
  '> Technical baseline and Google Search Console query data. Search positions are averages, not guaranteed rankings.',
]
await fs.writeFile('seo-audit-report.md', lines.join('\n'))
console.log(JSON.stringify(counts, null, 2))
if (counts.errors > 0) process.exitCode = 1
