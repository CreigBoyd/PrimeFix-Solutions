// Single list of every page on the site. Used by the sitemap generator and the prerenderer.
// Add a new static page here; services, towns and guides are picked up from their data files.
import { SERVICES } from '../src/data/serviceContent.js'
import { AREAS } from '../src/data/areas.js'
import { GUIDES } from '../src/data/guides.js'
import { ABOUT } from '../src/data/about.js'

export function getPages() {
  return [
    { path: '/', freq: 'weekly', priority: 1.0 },
    { path: '/services', freq: 'monthly', priority: 0.9 },
    ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, freq: 'monthly', priority: 0.9 })),
    { path: '/service-areas', freq: 'monthly', priority: 0.8 },
    ...AREAS.map((a) => ({ path: `/service-areas/${a.slug}`, freq: 'monthly', priority: 0.8 })),
    { path: '/guides', freq: 'weekly', priority: 0.7 },
    ...GUIDES.map((g) => ({ path: `/guides/${g.slug}`, freq: 'monthly', priority: 0.7 })),
    { path: '/contact', freq: 'monthly', priority: 0.8 },
    { path: '/portfolio-transformations', freq: 'monthly', priority: 0.7 },
    { path: '/maintenance-plans', freq: 'monthly', priority: 0.7 },
    { path: '/cost-estimator', freq: 'monthly', priority: 0.7 },
    { path: '/services-explorer', freq: 'monthly', priority: 0.6 },
    { path: '/reviews', freq: 'weekly', priority: 0.6 },
    { path: '/faq', freq: 'monthly', priority: 0.6 },
    // /about is noindex until it has a story, so it stays out of the sitemap until then.
    { path: '/about', freq: 'monthly', priority: 0.6, sitemap: ABOUT.story.length > 0 },
    { path: '/privacy-policy', freq: 'yearly', priority: 0.3 },
    { path: '/terms', freq: 'yearly', priority: 0.3 },
  ]
}
