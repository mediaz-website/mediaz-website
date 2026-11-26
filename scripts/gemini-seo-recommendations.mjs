import fs from 'node:fs/promises'

const apiKey = (process.env.GEMINI_API_KEY || '').trim()
const inputFiles = ['seo-audit-report.json', 'ga4-report.json']
if (!apiKey) {
  console.log('Gemini recommendations skipped: GEMINI_API_KEY is not configured.')
} else {
  const inputs = {}
  for (const file of inputFiles) {
    try {
      inputs[file] = JSON.parse(await fs.readFile(file, 'utf8'))
    } catch {
      inputs[file] = { status: 'not_available', message: file + ' was not generated in this run.' }
    }
  }

  const compact = {
    generatedAt: new Date().toISOString(),
    technicalSeo: {
      site: inputs['seo-audit-report.json'].site,
      counts: inputs['seo-audit-report.json'].counts,
      pages: (inputs['seo-audit-report.json'].pages || []).map(page => ({
        url: page.url, status: page.status, title: page.title,
        description: page.description, canonical: page.canonical,
        h1Count: page.h1Count, jsonLdCount: page.jsonLdCount,
      })),
      findings: (inputs['seo-audit-report.json'].findings || []).slice(0, 100),
      searchConsole: {
        status: inputs['seo-audit-report.json'].googleSearchConsole?.status,
        dateRange: [
          inputs['seo-audit-report.json'].googleSearchConsole?.startDate,
          inputs['seo-audit-report.json'].googleSearchConsole?.endDate,
        ],
        rows: (inputs['seo-audit-report.json'].googleSearchConsole?.rows || []).slice(0, 100),
        inspections: (inputs['seo-audit-report.json'].googleSearchConsole?.urlInspections || []).slice(0, 30),
      },
    },
    ga4: {
      status: inputs['ga4-report.json'].rows ? 'available' : inputs['ga4-report.json'].status || 'not_available',
      dateRange: [inputs['ga4-report.json'].startDate, inputs['ga4-report.json'].endDate],
      metrics: inputs['ga4-report.json'].metrics,
      rows: (inputs['ga4-report.json'].rows || []).slice(0, 100),
      totals: inputs['ga4-report.json'].totals,
    },
  }

  const prompt = `You are a senior technical SEO, AEO and analytics strategist for Mediazz Hub (mediazhub.com), an India-based creative media production house serving businesses. Analyse the supplied technical SEO, Google Search Console and GA4 data.

Return a practical report in Markdown with:
1. Executive summary (only evidence-based).
2. Top 5 priority recommendations, each with priority (P0/P1/P2), evidence from the data, exact action, expected impact, and effort (S/M/L).
3. AEO improvements (help pages answer buyer-intent questions clearly; structured data only where appropriate).
4. Content and landing-page opportunities based on query/page performance.
5. Measurement/data-quality issues and what additional data is needed.
6. A 7-day action plan.

Rules: Do not invent metrics, rankings, traffic, queries or problems. If data has zero rows, explicitly say the period returned no rows and do not infer zero traffic or no demand. Separate observed facts from hypotheses. Do not recommend changing site code automatically. Keep recommendations specific to Mediazz Hub's services and buyer audience. Cite the relevant page URL/query when present. Output valid Markdown only.

DATA:
${JSON.stringify(compact)}`

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + encodeURIComponent(apiKey)
  const requestBody = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 6000 },
  })

  let response
  let result
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: requestBody,
        signal: AbortSignal.timeout(120000),
      })
      const responseText = await response.text()
      try {
        result = JSON.parse(responseText)
      } catch {
        throw new Error('Gemini returned a non-JSON response (HTTP ' + response.status + ').')
      }

      if (response.ok) break

      const apiError = new Error('Gemini API failed: ' + (result.error?.message || response.status))
      const retryable = response.status === 429 || response.status >= 500
      if (!retryable || attempt === maxAttempts) throw apiError
      console.warn('Gemini API returned HTTP ' + response.status + '; retrying (' + (attempt + 1) + '/' + maxAttempts + ').')
    } catch (error) {
      const retryable = error.name === 'TimeoutError' || error.name === 'AbortError' ||
        error.cause?.code === 'UND_ERR_HEADERS_TIMEOUT' ||
        error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
        error.cause?.code === 'UND_ERR_SOCKET' ||
        error.message === 'fetch failed'
      if (!retryable || attempt === maxAttempts) {
        throw new Error('Gemini request failed after ' + attempt + ' attempt(s): ' + error.message)
      }
      console.warn('Gemini request attempt ' + attempt + ' failed: ' + error.message + '; retrying.')
    }

    const delayMs = 3000 * (2 ** (attempt - 1))
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }

  if (!response?.ok) throw new Error('Gemini API request did not succeed after retries.')
  const report = (result.candidates?.[0]?.content?.parts || []).map(part => part.text || '').join('').trim()
  if (!report) throw new Error('Gemini returned an empty recommendation report.')
  await fs.writeFile('gemini-seo-recommendations.md', '# Mediazz Hub — Gemini SEO & AEO Recommendations\n\nGenerated: ' + new Date().toISOString() + '\n\n' + report + '\n')
  await fs.writeFile('gemini-seo-recommendations.json', JSON.stringify({ generatedAt: new Date().toISOString(), model: 'gemini-3.8-flash', report }, null, 2))
  console.log('Gemini SEO recommendations generated.')
}
