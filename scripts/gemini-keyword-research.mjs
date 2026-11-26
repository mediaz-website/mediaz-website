import fs from 'node:fs/promises'

const apiKey = (process.env.GEMINI_API_KEY || '').trim()
if (!apiKey) {
  console.log('Keyword research skipped: GEMINI_API_KEY is not configured.')
} else {
  const site = (process.env.SITE_URL || 'https://mediazhub.com').replace(/\/+$/, '')
  const sitemapResponse = await fetch(site + '/sitemap.xml', { signal: AbortSignal.timeout(20000) })
  if (!sitemapResponse.ok) throw new Error('Cannot read sitemap: HTTP ' + sitemapResponse.status)
  const sitemap = await sitemapResponse.text()
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(x => x[1].trim()).slice(0, 30)
  const pages = []
  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'MediazzHub-Keyword-Research/1.0' } })
      if (!response.ok) continue
      const html = await response.text()
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
      const description = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || ''
      const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(x => x[1].replace(/<[^>]+>/g, '').trim()).slice(0, 3)
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1200)
      pages.push({ url, title, description, h1, visibleTextSample: text })
    } catch (error) {
      console.warn('Page context skipped:', url, error.message)
    }
  }

  const prompt = `You are an SEO keyword strategist. Research the current search landscape for Mediazz Hub (https://mediazhub.com), an Indore-based creative media production house serving brands and businesses across India.

Use Google Search grounding to investigate:
- High-intent service keywords for commercial video production, product photography/video, brand shoots, ad shoots, reels/video production, creative media production, and AI media production.
- Local intent around Indore and Madhya Pradesh, plus national India intent.
- Search intent and buyer stage for each cluster.
- Current competing businesses/pages appearing in relevant search results and their positioning/content angles.
- Content gaps and AEO question opportunities.

Return a concise but useful Markdown report with:
1. Keyword clusters in a table: keyword, geography (Indore/MP/India), intent, buyer stage, priority, and why it matters.
2. Competitor SERP snapshot with business/page name, URL, apparent positioning and content gap (only competitors actually found in search).
3. 15 question-style AEO queries customers may ask.
4. Top 10 content/landing-page opportunities, but do not draft or publish website copy.
5. Data limitations and what requires Search Console validation.

Rules: Do not invent search volume, CPC, rankings, traffic, or competitor facts. If exact volume is unavailable, write "not available"; use qualitative demand signals only when supported by search results. Separate observed facts from hypotheses. Exclude mediazhub.com from competitor list. Keep recommendations relevant to an Indian production house. Output Markdown only.

Current website pages for context:
${JSON.stringify(pages)}`

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
  const errors = []
  let result = null
  for (const model of models) {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(apiKey), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 7000 },
        }),
        signal: AbortSignal.timeout(120000),
      })
      const data = await response.json()
      if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + (data.error?.message || 'Gemini API error'))
      const candidate = data.candidates?.[0]
      const report = (candidate?.content?.parts || []).map(x => x.text || '').join('').trim()
      if (!report) throw new Error('Gemini returned an empty keyword research report.')
      const metadata = candidate?.groundingMetadata || {}
      const sources = (metadata.groundingChunks || []).map(chunk => chunk.web).filter(Boolean).map(web => ({ title: web.title || '', uri: web.uri || '' }))
      const queries = metadata.webSearchQueries || []
      const suggestions = metadata.searchEntryPoint?.renderedContent || ''
      result = { model, report, sources, queries, suggestions }
      break
    } catch (error) {
      errors.push(model + ': ' + error.message)
      console.warn('Keyword research model failed:', model, error.message)
    }
  }
  if (!result) throw new Error('Keyword research failed on all models. ' + errors.join(' | '))

  const generatedAt = new Date().toISOString()
  const lines = [
    '# Mediazz Hub — Keyword & Competitor Research',
    '',
    'Generated: ' + generatedAt,
    'Model: ' + result.model,
    '',
    result.report,
    '',
    '## Grounding sources',
    ...(result.sources.length ? result.sources.map(x => '- [' + (x.title || x.uri) + '](' + x.uri + ')') : ['- No source links returned by grounding metadata.']),
    '',
    '## Google Search queries used',
    ...(result.queries.length ? result.queries.map(x => '- ' + x) : ['- No query metadata returned.']),
    '',
  ]
  if (result.suggestions) lines.push('## Google Search suggestions', '', result.suggestions)
  await fs.writeFile('keyword-research-report.md', lines.join('\n'))
  await fs.writeFile('keyword-research-report.json', JSON.stringify({ generatedAt, model: result.model, report: result.report, sources: result.sources, queries: result.queries, searchSuggestionsHtml: result.suggestions }, null, 2))
  console.log('Keyword research report generated; grounded sources:', result.sources.length, 'search queries:', result.queries.length)
}
