import { useEffect } from 'react'

/**
 * Adds a <script type="application/ld+json"> block to <head> for the current page and removes it when the page
 * unmounts. Pass an object (or array of objects). `key` keeps blocks from different pages from colliding.
 */
export default function useJsonLd(key, data) {
  // Prerender (Node): collect the schema so scripts/prerender.mjs can write it into the static HTML.
  if (typeof document === 'undefined' && data) {
    const seo = (globalThis.__SEO__ = globalThis.__SEO__ || { jsonLd: [] })
    seo.jsonLd.push(...(Array.isArray(data) ? data : [data]))
  }

  useEffect(() => {
    if (!data) return undefined
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.pageSchema = key
    el.textContent = JSON.stringify(data)
    document.head.appendChild(el)
    return () => el.remove()
  }, [key, JSON.stringify(data)])
}
