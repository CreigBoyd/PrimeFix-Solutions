// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './style.css'
import { initConsoleBanner } from './utils/consoleBanner'
import { initAnalytics } from './utils/analytics'
import { pageImports } from './routes/pageRegistry'
import { initSmoothScroll } from './utils/smoothScroll'

initConsoleBanner()
initAnalytics()

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => {})
  })
}

const container = document.getElementById('root')
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

function chunkForPath(path) {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/') return pageImports.home
  if (p === '/services') return pageImports.servicesHub
  if (p.startsWith('/services/') && p !== '/services-explorer') return pageImports.servicePage
  if (p === '/service-areas') return pageImports.areasHub
  if (p.startsWith('/service-areas/')) return pageImports.areaPage
  if (p === '/guides') return pageImports.guidesHub
  if (p.startsWith('/guides/')) return pageImports.guidePage
  const map = {
    '/services-explorer': pageImports.services,
    '/reviews': pageImports.reviews,
    '/maintenance-plans': pageImports.maintenance,
    '/portfolio-transformations': pageImports.portfolio,
    '/cost-estimator': pageImports.estimator,
    '/faq': pageImports.faq,
    '/privacy-policy': pageImports.privacy,
    '/terms': pageImports.terms,
    '/about': pageImports.about,
    '/contact': pageImports.contact,
  }
  return map[p] || pageImports.notFound
}

const startScrollFeel = () => (window.requestIdleCallback || ((fn) => setTimeout(fn, 300)))(() => initSmoothScroll())

// Ensure chunk loading finishes before calling hydrateRoot
const loader = chunkForPath(window.location.pathname)

if (container && container.hasChildNodes()) {
  Promise.resolve(loader ? loader() : null)
    .catch(() => {})
    .then(() => {
      ReactDOM.hydrateRoot(container, app)
      requestAnimationFrame(() => {
        startScrollFeel()
      })
    })
} else if (container) {
  ReactDOM.createRoot(container).render(app)
  startScrollFeel()
}