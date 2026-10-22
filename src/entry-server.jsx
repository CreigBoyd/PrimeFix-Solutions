// Used only at build time by scripts/prerender.mjs (not shipped to visitors).
import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

/** Renders the whole site for one URL and returns { html, seo }. */
export function render(url) {
  globalThis.__SEO__ = { jsonLd: [] }
  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString()
        cb()
      },
    })
    sink.on('finish', () => resolve({ html, seo: globalThis.__SEO__ }))
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink)
        },
        onShellError: reject,
        onError(err) {
          console.error(`  render error on ${url}:`, err?.message || err)
        },
      }
    )
  })
}
