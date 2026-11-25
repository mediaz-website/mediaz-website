const SITE_URL = 'https://mediazhub.com'
const STATIC_PATHS = [
  '/', '/about', '/services', '/portfolio', '/contact',
  '/services/ai-media-production', '/privacy-policy', '/terms-of-service',
]

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function renderSitemap(paths) {
  const uniquePaths = [...new Set(paths)]
  const urls = uniquePaths.map((path) => '  <url><loc>' + escapeXml(SITE_URL + path) + '</loc></url>').join('\n')
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n'
}

export async function onRequestGet({ env }) {
  const paths = [...STATIC_PATHS]
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const anonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY

  if (supabaseUrl && anonKey) {
    try {
      const endpoint = new URL('/rest/v1/projects', supabaseUrl)
      endpoint.search = new URLSearchParams({
        select: 'slug',
        is_published: 'eq.true',
        slug: 'not.is.null',
        order: 'sort_order.asc',
      }).toString()
      const response = await fetch(endpoint, {
        headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey, Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Supabase returned HTTP ' + response.status)
      const projects = await response.json()
      for (const project of projects) {
        const slug = typeof project.slug === 'string' ? project.slug.trim() : ''
        if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) paths.push('/portfolio/' + slug)
      }
    } catch (error) {
      console.error('Dynamic portfolio sitemap query failed; serving static URLs.', error)
    }
  }

  return new Response(renderSitemap(paths), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}