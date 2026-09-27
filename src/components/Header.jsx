import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!isHome) return

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
  }, [isHome])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    closeMenu()
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        const targetSection = document.querySelector(href)
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const targetSection = document.querySelector(href)
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleBrandClick = (e) => {
    e.preventDefault()
    closeMenu()
    if (!isHome) {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleEstimateClick = (e) => {
    e.preventDefault()
    closeMenu()
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        const contactSection = document.querySelector('#contact')
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const contactSection = document.querySelector('#contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 861px)')
    const handleViewportChange = (event) => {
      if (event.matches) setMenuOpen(false)
    }

    if (desktopQuery.matches) setMenuOpen(false)
    desktopQuery.addEventListener('change', handleViewportChange)
    return () => desktopQuery.removeEventListener('change', handleViewportChange)
  }, [])

  return (
    <header className="site">
      <div className="wrap header-row">
        <Link to="/" className="brand" aria-label="PrimeFix Solutions home" onClick={handleBrandClick}>
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
        </Link>

        <nav className="primary" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className={`nav-link${activeId === link.href ? ' active' : ''}`}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
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
          <JellyButton href="#contact" onClick={handleEstimateClick}>
            Get a free estimate
          </JellyButton>
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
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        
        <Link to="/reviews" onClick={closeMenu}>Reviews</Link>
        <a href="tel:5550102000" onClick={closeMenu}><strong>(555) 010-2000</strong></a>
      </div>
    </header>
  )
}