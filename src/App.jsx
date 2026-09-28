import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { faPhone, faEnvelope, faClipboardCheck, faLink, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import EmergencyBanner from './components/EmergencyBanner'
import Header from './components/Header'
import Footer from './components/Footer'
import { RootContextMenu, MenuCard } from './components/ContextMenu'
import Home from './pages/Home'
import Reviews from './pages/Reviews'
import ServiceExplorer from './pages/ServiceExplorer'
import MaintenancePlans from './pages/MaintenancePlans'
import BeforeAfterPortfolio from './pages/BeforeAfterPortfolio'
import CostEstimator from './pages/CostEstimator'
import FAQ from './pages/FAQ'
import { initSmoothScroll } from './utils/smoothScroll'
import NotFound from './pages/NotFound'
import Chatbot from './components/Chatbot'

const siteMenuItems = [
  {
    menuItemType: 'button',
    labelText: 'Call us',
    icon: { faIcon: faPhone },
    onClick: () => { window.location.href = 'tel:5550102000' },
  },
  {
    menuItemType: 'button',
    labelText: 'Email us',
    icon: { faIcon: faEnvelope },
    onClick: () => { window.location.href = 'mailto:hello@primefixsolutions.com' },
  },
  {
    menuItemType: 'button',
    labelText: 'Get a free estimate',
    icon: { faIcon: faClipboardCheck },
    onClick: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }),
  },
  { menuItemType: 'seperator' },
  {
    menuItemType: 'button',
    labelText: 'Copy page link',
    icon: { faIcon: faLink },
    onClick: () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).catch(() => {})
      }
    },
  },
  {
    menuItemType: 'button',
    labelText: 'Scroll to top',
    icon: { faIcon: faArrowUp },
    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
]

export default function App() {
  const { pathname } = useLocation()

  // Reset scroll position to top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const cleanup = initSmoothScroll()
    return cleanup
  }, [])

  return (
    <>
      <EmergencyBanner />
      <Header />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/services-explorer" element={<ServiceExplorer />} />
          <Route path="/maintenance-plans" element={<MaintenancePlans />} />
          <Route path="/portfolio-transformations" element={<BeforeAfterPortfolio />} />
          <Route path="/cost-estimator" element={<CostEstimator />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
<Chatbot />
      <RootContextMenu
        holdMs={650}
        menu={() => <MenuCard items={siteMenuItems} size={1.0} maxWidthRem={22} enableTextSelection={false} />}
      />
    </>
  )
}