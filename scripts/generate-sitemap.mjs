// Regenerates public/sitemap.xml. Runs automatically before `npm run build` (see "prebuild" in package.json).
import { writeFileSync } from 'node:fs'
import { getPages } from './routes.mjs'

const ORIGIN = 'https://primefix.vip'
const today = new Date().toISOString().slice(0, 10)
const pages = getPages().filter((p) => p.sitemap !== false)

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .map(
      (p) =>
        `  <url><loc>${ORIGIN}${p.path === '/' ? '' : p.path + '/'}</loc><lastmod>${today}</lastmod><changefreq>${p.freq}</changefreq><priority>${p.priority.toFixed(1)}</priority></url>`
    )
    .join('\n') +
  '\n</urlset>\n'

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml written (${pages.length} URLs)`)
