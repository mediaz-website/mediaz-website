import { createSign } from 'node:crypto'
import fs from 'node:fs/promises'

const propertyId = (process.env.GA4_PROPERTY_ID || '').trim()
const rawCredentials = process.env.GSC_SERVICE_ACCOUNT_JSON
if (!propertyId || !rawCredentials) {
  console.log('GA4 skipped: GA4_PROPERTY_ID or service-account credentials are not configured.')
} else {
  if (!/^\d+$/.test(propertyId)) throw new Error('GA4_PROPERTY_ID must be numeric.')
  const credentials = JSON.parse(rawCredentials)
  const now = Math.floor(Date.now() / 1000)
  const enc = value => Buffer.from(value).toString('base64url')
  const unsigned = enc(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' + enc(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  signer.end()
  const assertion = unsigned + '.' + signer.sign(credentials.private_key, 'base64url')
  const auth = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    signal: AbortSignal.timeout(30000),
  })
  const token = await auth.json()
  if (!auth.ok) throw new Error('Google OAuth failed: ' + (token.error_description || token.error))

  const endpoint = 'https://analyticsdata.googleapis.com/v1beta/properties/' + propertyId + ':runReport'
  const headers = { authorization: 'Bearer ' + token.access_token, 'content-type': 'application/json' }
  const requestReport = async body => {
    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(45000) })
    const data = await response.json()
    if (!response.ok) throw new Error('GA4 API failed: HTTP ' + response.status + ' — ' + (data.error?.message || 'unknown error'))
    return data
  }

  // A 90-day window is more useful for a new/low-traffic property than a 28-day-only report.
  const [landing, events, summary] = await Promise.all([
    requestReport({
      dateRanges: [{ startDate: '90daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'landingPagePlusQueryString' }, { name: 'sessionDefaultChannelGroup' }],
      metrics: [
        { name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' },
        { name: 'bounceRate' }, { name: 'screenPageViews' }, { name: 'eventCount' }, { name: 'keyEvents' },
      ],
      limit: 1000,
    }),
    requestReport({
      dateRanges: [{ startDate: '90daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }, { name: 'keyEvents' }],
      limit: 250,
    }),
    requestReport({
      dateRanges: [{ startDate: '90daysAgo', endDate: 'yesterday' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' }, { name: 'screenPageViews' }, { name: 'eventCount' }, { name: 'keyEvents' }],
    }),
  ])

  const report = {
    generatedAt: new Date().toISOString(),
    propertyId,
    dateRange: '90daysAgo to yesterday',
    landingPageDimensions: landing.dimensionHeaders || [],
    landingPageMetrics: landing.metricHeaders || [],
    landingPageRows: landing.rows || [],
    landingPageTotals: landing.totals || [],
    eventDimensions: events.dimensionHeaders || [],
    eventMetrics: events.metricHeaders || [],
    eventRows: events.rows || [],
    summaryMetrics: summary.metricHeaders || [],
    summaryTotals: summary.totals || [],
    dataQuality: {
      landingPageRowsReturned: (landing.rows || []).length,
      eventRowsReturned: (events.rows || []).length,
      summaryTotalsReturned: (summary.totals || []).length,
      note: (landing.rows || []).length || (events.rows || []).length
        ? 'GA4 returned data for the requested period.'
        : 'No rows returned for the 90-day period. This does not prove zero traffic; check property timezone, data retention, tag deployment and processing delay.',
    },
  }
  await fs.writeFile('ga4-report.json', JSON.stringify(report, null, 2))

  const lines = [
    '# Mediazz Hub — GA4 performance report',
    '',
    'Property: ' + propertyId,
    'Date range: 90 days through yesterday (GA4 relative date range)',
    '',
    '## Data quality',
    '- Landing-page rows: ' + report.dataQuality.landingPageRowsReturned,
    '- Event rows: ' + report.dataQuality.eventRowsReturned,
    '- Summary totals returned: ' + report.dataQuality.summaryTotalsReturned,
    '- ' + report.dataQuality.note,
    '',
    '## Overall metrics',
    '| Metric | Value |',
    '|---|---:|',
    ...((report.summaryMetrics || []).map((metric, index) => '| ' + metric.name + ' | ' + (report.summaryTotals?.[0]?.metricValues?.[index]?.value ?? 'not returned') + ' |')),
    '',
    '## Landing pages and channels',
    '| Landing page | Channel | ' + (report.landingPageMetrics || []).map(x => x.name).join(' | ') + ' |',
    '|---|---|' + (report.landingPageMetrics || []).map(() => '---:').join('|') + '|',
    ...(report.landingPageRows.length
      ? report.landingPageRows.map(row => '| ' + row.dimensionValues.map(x => x.value).join(' | ') + ' | ' + row.metricValues.map(x => x.value).join(' | ') + ' |')
      : ['| No rows returned | — | — |']),
    '',
    '## Event performance',
    '| Event | ' + (report.eventMetrics || []).map(x => x.name).join(' | ') + ' |',
    '|---|' + (report.eventMetrics || []).map(() => '---:').join('|') + '|',
    ...(report.eventRows.length
      ? report.eventRows.map(row => '| ' + row.dimensionValues.map(x => x.value).join(' | ') + ' | ' + row.metricValues.map(x => x.value).join(' |') + ' |')
      : ['| No events returned | — | — |']),
    '',
    '> GA4 data can be delayed. A zero-row report must not be interpreted as proof of zero visitors or zero demand.',
  ]
  await fs.writeFile('ga4-report.md', lines.join('\n'))
  console.log('GA4 report generated; landing rows:', report.landingPageRows.length, 'event rows:', report.eventRows.length)
}
