import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { faPhone, faEnvelope, faClipboardCheck, faLink, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import Header from './components/Header'
import Footer from './components/Footer'
import { RootContextMenu, MenuCard } from './components/ContextMenu'
import Home from './pages/Home'
import Reviews from './pages/Reviews'
import { initSmoothScroll } from './utils/smoothScroll'

// Right-click (or long-press on touch) anywhere on the page to bring this
// up. Swap any of these actions out for whatever's actually useful —
// nothing here is tied to a specific element, so it's just this one list.
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
    onClick: () => navigator.clipboard?.writeText(window.location.href),
  },
  {
    menuItemType: 'button',
    labelText: 'Scroll to top',
    icon: { faIcon: faArrowUp },
    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
]

export default function App() {
  useEffect(() => {
    const cleanup = initSmoothScroll()
    return cleanup
  }, [])

  return (
    <>
      <Header />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </main>
      <Footer />

      <RootContextMenu
        holdMs={650}
        menu={() => <MenuCard items={siteMenuItems} size={1.0} maxWidthRem={22} enableTextSelection={false} />}
      />
    </>
  )
}
