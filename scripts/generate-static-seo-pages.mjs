import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const baseUrl = 'https://mediazhub.com'
const pages = [
  {
    path: '/',
    title: 'Creative Media Production House in Indore | Mediazz Hub',
    description: 'Mediazz Hub is an Indore creative production house for commercial shoots, product photography, video production, reels and brand ads.',
  },
  {
    path: '/about',
    title: 'About Mediazz Hub',
    description: 'Discover Mediazz Hub, an Indore-based creative media production house with 500+ completed projects since 2023.',
  },
  {
    path: '/services',
    title: 'Services | Mediazz Hub',
    description: "Explore Mediazz Hub's AI media production, automation, commercial shoots, photography, video and film services.",
  },
  {
    path: '/services/ai-media-production',
    title: 'AI Media Production & Technology Solutions in Indore | Mediazz Hub',
    description: 'AI media production and video editing worldwide, with on-ground shoots across India, AI voiceovers, images and automation.',
  },
  {
    path: '/portfolio',
    title: 'Portfolio | Mediazz Hub',
    description: "Explore Mediazz Hub's on-ground productions, AI videos, digital creatives and media automation projects.",
  },
  {
    path: '/contact',
    title: 'Start a Project | Mediazz Hub',
    description: 'Share your creative production brief with Mediazz Hub.',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Mediazz Hub',
    description: 'Read how Mediazz Hub collects, uses, stores and protects information shared through mediazhub.com.',
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service | Mediazz Hub',
    description: 'Read the terms governing use of the Mediazz Hub website and enquiries for its creative production and digital services.',
  },
]

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error('Could not find ' + label + ' in dist/index.html')
  return html.replace(pattern, replacement)
}

const template = await readFile(resolve('dist/index.html'), 'utf8')
const sitemap = await readFile(resolve('public/sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const expectedUrls = pages.map((page) => baseUrl + (page.path === '/' ? '/' : page.path))

if (new Set(expectedUrls).size !== expectedUrls.length) {
  throw new Error('Duplicate route found in static SEO page configuration.')
}
if (sitemapUrls.length !== expectedUrls.length || expectedUrls.some((url) => !sitemapUrls.includes(url))) {
  throw new Error('public/sitemap.xml does not exactly match the configured static SEO routes.')
}

for (const page of pages) {
  const canonical = baseUrl + (page.path === '/' ? '/' : page.path)
  const title = escapeAttribute(page.title)
  const description = escapeAttribute(page.description)
  let html = template

  html = replaceRequired(html, /<title>[^<]*<\/title>/i, '<title>' + title + '</title>', 'title')
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, '<meta name="description" content="' + description + '" />', 'meta description')
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, '<link rel="canonical" href="' + canonical + '" />', 'canonical')
  html = replaceRequired(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, '<meta property="og:title" content="' + title + '" />', 'Open Graph title')
  html = replaceRequired(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, '<meta property="og:description" content="' + description + '" />', 'Open Graph description')
  html = replaceRequired(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, '<meta property="og:url" content="' + canonical + '" />', 'Open Graph URL')
  html = replaceRequired(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, '<meta name="twitter:title" content="' + title + '" />', 'Twitter title')
  html = replaceRequired(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, '<meta name="twitter:description" content="' + description + '" />', 'Twitter description')

  const outputPath = resolve('dist', page.path === '/' ? 'index.html' : page.path.slice(1) + '/index.html')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)

  const checks = [
    [/<title>[^<]+<\/title>/i, 'title'],
    [/name="description"\s+content="[^"]+"/i, 'description'],
    [/rel="canonical"\s+href="[^"]+"/i, 'canonical'],
    [/property="og:title"\s+content="[^"]+"/i, 'Open Graph title'],
    [/property="og:description"\s+content="[^"]+"/i, 'Open Graph description'],
    [/property="og:url"\s+content="[^"]+"/i, 'Open Graph URL'],
    [/name="twitter:title"\s+content="[^"]+"/i, 'Twitter title'],
    [/name="twitter:description"\s+content="[^"]+"/i, 'Twitter description'],
  ]
  for (const [pattern, label] of checks) {
    if (!pattern.test(html)) throw new Error('Generated page ' + page.path + ' is missing ' + label)
  }
  if ((html.match(/rel="canonical"/gi) || []).length !== 1) {
    throw new Error('Generated page ' + page.path + ' must contain exactly one canonical link.')
  }
}

console.log('Generated and validated route-specific SEO HTML for ' + pages.length + ' routes.')
