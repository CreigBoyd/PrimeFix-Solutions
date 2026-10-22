// Local preview that behaves like the live Apache setup: every page is its own file, unknown URLs get the 404 page.
// (Plain `vite preview` serves the home page for every URL, which causes false errors with prerendered pages.)
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.env.PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json',
  '.vcf': 'text/vcard',
}

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0].split('#')[0])
    if (p.includes('..')) { res.writeHead(400); return res.end() }
    let file = path.join(root, p)
    const isDir = existsSync(file) && statSync(file).isDirectory()
    // Like Apache/LiteSpeed: a folder URL without the trailing slash is redirected to the slash version.
    if (isDir && p !== '/' && !p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end() }
    if (isDir) file = path.join(file, 'index.html')
    let status = 200
    if (!existsSync(file)) { file = path.join(root, '404.html'); status = 404 }
    const ext = path.extname(file)
    const headers = { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' }
    let body = readFileSync(file)
    // Compress text files like Apache's mod_deflate does on the live site, so local speed tests are realistic.
    if (['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt', '.webmanifest'].includes(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      body = zlib.gzipSync(body)
      headers['Content-Encoding'] = 'gzip'
    }
    headers['Content-Length'] = body.length
    res.writeHead(status, headers)
    res.end(body)
  })
  .listen(port, () => console.log(`\n  Preview (prerendered site): http://localhost:${port}/\n`))
