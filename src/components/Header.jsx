import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/primefix-solutions-logo-dark-bg.svg'
import JellyButton from './JellyButton'

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Process' },
  
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('')

  const closeMenu = () => setMenuOpen(false)

  // Scroll-spy: highlight whichever section is currently in the "reading
  // band" of the viewport as the user scrolls.
  useEffect(() => {
    const sections = NAV_LINKS
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Actual scrolling is handled by the global listener in
  // utils/smoothScroll.js (attached once in App.jsx) — this just closes the
  // mobile menu on tap so it doesn't linger open over the page.
  const handleNavClick = () => closeMenu()

  useEffect(() => {
  const desktopQuery = window.matchMedia('(min-width: 861px)')

  const handleViewportChange = (event) => {
    if (event.matches) {
      setMenuOpen(false)
    }
  }

  // Also handles loading or rendering while already on desktop
  if (desktopQuery.matches) {
    setMenuOpen(false)
  }

  desktopQuery.addEventListener('change', handleViewportChange)

  return () => {
    desktopQuery.removeEventListener('change', handleViewportChange)
  }
}, [])


  return (
    <header className="site">
      <div className="wrap header-row">
        <a href="#top" className="brand" aria-label="PrimeFix Solutions home">
           <img
  src={logo}
  alt=""
  className="primefix-logo"
  width="42"
  height="42"
/>

          <span className="brand-name">
            PrimeFix Solutions
            <span>Building &amp; Property Maintenance</span>
          </span>
        </a>

        <nav className="primary" aria-label="Primary">
  {NAV_LINKS.map((link) => (
    <a
      key={link.href}
      className={`nav-link${activeId === link.href ? ' active' : ''}`}
      href={link.href}
      onClick={handleNavClick}
    >
      {link.label}
    </a>
  ))}
  <Link to="/reviews" className="nav-link">
    Reviews
  </Link>
</nav>

        <div className="header-actions">
          <a className="phone-link" href="tel:5550102000">(555) 010-2000</a>
          <JellyButton href="#contact">Get a free estimate</JellyButton>
          <button
  type="button"
  className="menu-toggle"
  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={menuOpen}
  aria-controls="mobile-nav"
  onClick={() => setMenuOpen((open) => !open)}
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 6h18M3 12h18M3 18h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</button>

        </div>
      </div>

      <div id="mobile-nav" className={menuOpen ? 'open' : ''}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={activeId === link.href ? 'active' : ''}
            onClick={handleNavClick}
          >
            {link.label}
          </a>
        ))}
        <a href="tel:5550102000" onClick={closeMenu}><strong>(555) 010-2000</strong></a>
      </div>
    </header>
  )
}
