// Turns the built single-page app into real HTML for every page (so Google and social previews see full content).
// Runs automatically as the last step of `npm run build`.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { getPages } from './routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const serverEntry = readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f))
if (!serverEntry) throw new Error('dist-ssr/entry-server.js not found. Run the SSR build first.')
const { render } = await import(pathToFileURL(path.join(ssrDir, serverEntry)).href)

const template = readFileSync(path.join(dist, 'index.html'), 'utf8')

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const setMeta = (html, re, replacement) => (re.test(html) ? html.replace(re, replacement) : html)

// Preload the two fonts every page needs (filenames are hashed, so find them in dist/assets).
const assets = existsSync(path.join(dist, 'assets')) ? readdirSync(path.join(dist, 'assets')) : []
const fontPreloads = ['public-sans-latin-400-normal', 'public-sans-latin-600-normal', 'newsreader-latin-500-normal', 'playwrite-is-latin']
  .map((n) => assets.find((f) => f.startsWith(n) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `    <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n')

// The home page's main image is the hero photo: tell the browser to fetch it immediately.
const heroSmall = assets.find((f) => f.startsWith('hero-renovation-480') && f.endsWith('.webp'))
const heroLarge = assets.find((f) => f.startsWith('hero-renovation-863') && f.endsWith('.webp'))
const heroPreload =
  heroSmall && heroLarge
    ? `    <link rel="preload" as="image" fetchpriority="high" imagesrcset="/assets/${heroSmall} 480w, /assets/${heroLarge} 863w" imagesizes="(max-width: 900px) 92vw, 520px" />`
    : ''

function build(route, { html, seo }) {
  let out = template
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  if (seo.title) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
    out = setMeta(out, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(seo.title)}"`)
    out = setMeta(out, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(seo.title)}"`)
  }
  if (seo.description) {
    out = setMeta(out, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(seo.description)}"`)
    out = setMeta(out, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(seo.description)}"`)
    out = setMeta(out, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(seo.description)}"`)
  }
  if (seo.canonical) {
    out = setMeta(out, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${esc(seo.canonical)}"`)
    out = setMeta(out, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${esc(seo.canonical)}"`)
  }
  out = setMeta(out, /<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow'}"`)
  const extra =
    (fontPreloads ? fontPreloads + '\n' : '') +
    (route === '/' && heroPreload ? heroPreload + '\n' : '') +
    seo.jsonLd.map((j) => `    <script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')
  out = out.replace('</head>', `${extra}\n  </head>`)
  return out
}

function write(file, html) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const routes = getPages().map((p) => p.path)
let count = 0
for (const route of routes) {
  const result = await render(route === '/' ? '/' : route + '/')
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  write(file, build(route, result))
  count++
}

// Real 404 page (served with a 404 status by .htaccess)
const nf = await render('/page-not-found/')
nf.seo.noindex = true
nf.seo.canonical = ''
write(path.join(dist, '404.html'), build('/404', nf))

rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${count} pages + 404.html`)
