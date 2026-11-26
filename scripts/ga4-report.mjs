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
  })
  const token = await auth.json()
  if (!auth.ok) throw new Error('Google OAuth failed: ' + (token.error_description || token.error))
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 27)
  const date = d => d.toISOString().slice(0, 10)
  const api = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/' + propertyId + ':runReport', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token.access_token, 'content-type': 'application/json' },
    body: JSON.stringify({
      dateRanges: [{ startDate: date(start), endDate: date(end) }],
      dimensions: [{ name: 'date' }, { name: 'landingPagePlusQueryString' }, { name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' }, { name: 'bounceRate' }, { name: 'screenPageViews' }],
      limit: 1000,
    }),
  })
  const data = await api.json()
  if (!api.ok) throw new Error('GA4 API failed: ' + (data.error?.message || api.status))
  const report = { generatedAt: new Date().toISOString(), propertyId, startDate: date(start), endDate: date(end), dimensions: data.dimensionHeaders || [], metrics: data.metricHeaders || [], rows: data.rows || [], totals: data.totals || [] }
  await fs.writeFile('ga4-report.json', JSON.stringify(report, null, 2))
  const metrics = report.metrics.map(x => x.name)
  const lines = ['# Mediazz Hub — GA4 performance report', '', 'Property: ' + propertyId, 'Date range: ' + report.startDate + ' to ' + report.endDate, '', '## Landing page and channel data', '| Date | Landing page | Channel | ' + metrics.join(' | ') + ' |', '|---|---|---|' + metrics.map(() => '---:').join('|') + '|']
  for (const row of report.rows) lines.push('| ' + row.dimensionValues.map(x => x.value).join(' | ') + ' | ' + row.metricValues.map(x => x.value).join(' | ') + ' |')
  await fs.writeFile('ga4-report.md', lines.join('\n'))
  console.log('GA4 report generated; rows:', report.rows.length)
}
