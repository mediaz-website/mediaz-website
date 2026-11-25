import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const baseUrl = 'https://mediazhub.com'
const pages = [
  {
    path: '/',
    title: 'Creative Media Production House in Indore | Mediazz Hub',
    description: 'Mediazz Hub is a creative media production house in Indore, offering commercial shoots, product photography, video production, reels and ad films for brands.',
  },
  {
    path: '/about',
    title: 'About Mediazz Hub | Mediazz Hub',
    description: 'Discover Mediazz Hub, an Indore-based creative media production house with 500+ completed projects since 2023.',
  },
  {
    path: '/services',
    title: 'Services | Mediazz Hub',
    description: "Explore Mediazz Hub's AI media production and on-ground production services, from AI videos and automation to commercial shoots, photography and films.",
  },
  {
    path: '/services/ai-media-production',
    title: 'AI Media Production & Technology Solutions in Indore | Mediazz Hub',
    description: 'Mediazz Hub provides AI media production and video editing worldwide, alongside professional on-ground shoots across India, AI voiceovers, images, automation and digital solutions.',
  },
  {
    path: '/portfolio',
    title: 'Portfolio | Mediazz Hub',
    description: "Explore Mediazz Hub's portfolio of on-ground media production, AI videos, digital creatives and media automation projects.",
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
let generated = 0

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
  generated += 1
}

console.log('Generated route-specific SEO HTML for ' + generated + ' routes.')
