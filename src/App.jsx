// src/App.jsx
import { lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { faPhone, faEnvelope, faClipboardCheck, faLink, faArrowUp } from '@fortawesome/free-solid-svg-icons'

// Core fixed components
import EmergencyBanner from './components/EmergencyBanner'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import MobileActionBar from './components/MobileActionBar'
import ScrollToTop from './components/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'
import { RootContextMenu, MenuCard } from './components/ContextMenu'
import logoSvg from './assets/primefix-solutions-logo-dark-bg.svg'

// Centralized Route Registry
import { pageImports } from './routes/pageRegistry'

// Dynamic Route Chunks linked to Registry
const Home = lazy(pageImports.home)
const Reviews = lazy(pageImports.reviews)
const ServiceExplorer = lazy(pageImports.services)
const MaintenancePlans = lazy(pageImports.maintenance)
const BeforeAfterPortfolio = lazy(pageImports.portfolio)
const CostEstimator = lazy(pageImports.estimator)
const FAQ = lazy(pageImports.faq)
const NotFound = lazy(pageImports.notFound)

export default function App() {
  const navigate = useNavigate()

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
      onClick: () => {
        const contactSection = document.querySelector('#contact')
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' })
        } else {
          navigate('/cost-estimator')
        }
      },
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

  const handleOpenEstimate = () => {
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/cost-estimator')
    }
  }

  return (
    <>
      <ScrollToTop />
      <EmergencyBanner />
      <Header />
      <main id="top">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/services-explorer" element={<ServiceExplorer />} />
            <Route path="/maintenance-plans" element={<MaintenancePlans />} />
            <Route path="/portfolio-transformations" element={<BeforeAfterPortfolio />} />
            <Route path="/cost-estimator" element={<CostEstimator />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
      <MobileActionBar onOpenEstimate={handleOpenEstimate} />
     <RootContextMenu
  holdMs={650}
  menu={() => (
    <MenuCard
      logo={logoSvg}
      title="PrimeFix Solutions"
      items={siteMenuItems}
      size={1.0}
      maxWidthRem={22}
      enableTextSelection={false}
    />
  )}
/>
    </>
  )
}