import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ORIGIN = 'https://primefix.vip'

export const DEFAULT_TITLE = 'Prime Fix Solutions | Professional Handyman & Home Maintenance'
export const DEFAULT_DESCRIPTION =
  'Reliable carpentry, roofing, painting, handyman, and seasonal upkeep services. Licensed, insured, and serving your local area with free estimates.'

/**
 * Sets the tab title and meta description for the current page.
 * Pass no title (Home) to restore the site defaults.
 */
export default function usePageTitle(title, description, { noindex = false } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title ? `${title} | PrimeFix Solutions` : DEFAULT_TITLE

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description || DEFAULT_DESCRIPTION

    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = noindex ? 'noindex, follow' : 'index, follow'

    // Keep the canonical URL in step with the current route (index.html only knows the home page).
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = ORIGIN + (pathname === '/' ? '' : pathname.replace(/\/+$/, ''))
  }, [title, description, noindex, pathname])
}
