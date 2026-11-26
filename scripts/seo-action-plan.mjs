import fs from 'node:fs/promises'

async function readJson(path) {
  try { return JSON.parse(await fs.readFile(path, 'utf8')) }
  catch { return null }
}

const [audit, monitor, aeo] = await Promise.all([
  readJson('seo-audit-report.json'),
  readJson('seo-monitor-report.json'),
  readJson('aeo-readiness-report.json'),
])
const actions = []
const add = (priority, category, url, issue, recommendedAction, approval = 'not_required_for_reporting') => {
  actions.push({ id: 'SEO-' + String(actions.length + 1).padStart(3, '0'), priority, category, url: url || '', issue, recommendedAction, productionChange: false, approval })
}

for (const item of audit?.findings || []) {
  const detail = String(item.detail || '')
  if (item.severity === 'error') add('P0', 'technical', item.item, detail, 'Investigate and resolve this technical error before making content changes.')
  else if (item.severity === 'warning') {
    const action = /title/i.test(detail) ? 'Prepare a unique, intent-matched title for this page.' :
      /description/i.test(detail) ? 'Prepare a unique meta description aligned with the page search intent.' :
      /canonical/i.test(detail) ? 'Verify the canonical URL points to the preferred live URL.' :
      /noindex/i.test(detail) ? 'Confirm whether this page should be indexable; remove noindex only if it is intended for search.' :
      'Review this warning and prepare a page-specific technical fix.'
    add('P1', 'technical-seo', item.item, detail, action, 'required_before_production_change')
  }
}
for (const item of monitor?.findings || []) {
  if (item.severity === 'critical') add('P0', item.type || 'monitoring', item.url, item.detail, 'Investigate immediately and restore the affected URL or resource.')
  else if (item.severity === 'warning') add('P1', item.type || 'monitoring', item.url, item.detail, 'Review the affected URL and prepare a targeted correction.', 'required_before_production_change')
}
for (const item of aeo?.findings || []) {
  add('P2', 'aeo-readiness', item.url, item.signal + ': ' + item.detail, 'Review this AEO signal after the page content/rendered DOM is inspected; do not infer missing content from a client-rendered HTML shell.', 'content_update_deferred')
}

const summary = {
  totalActions: actions.length,
  p0: actions.filter(x => x.priority === 'P0').length,
  p1: actions.filter(x => x.priority === 'P1').length,
  p2: actions.filter(x => x.priority === 'P2').length,
  productionChangesApplied: 0,
  note: 'This action plan is read-only. It does not edit production content or metadata. Changes requiring content decisions remain queued until the site content update phase.',
}
const report = { generatedAt: new Date().toISOString(), summary, actions }
await fs.writeFile('seo-action-plan.json', JSON.stringify(report, null, 2))
const lines = [
  '# Mediazz Hub — SEO action plan',
  '',
  'Generated: ' + report.generatedAt,
  '',
  '## Summary',
  ...Object.entries(summary).map(([key, value]) => '- ' + key + ': ' + value),
  '',
  '## Prioritized actions',
  ...(actions.length
    ? actions.map(item => '- **' + item.priority + '** [' + item.category + '] ' + (item.url || 'Site-wide') + ' — ' + item.issue + ' Action: ' + item.recommendedAction + ' Approval: ' + item.approval)
    : ['- No actionable technical SEO or AEO issues were detected in the current reports.']),
  '',
]
await fs.writeFile('seo-action-plan.md', lines.join('\n'))
console.log('SEO action plan generated:', JSON.stringify(summary))
