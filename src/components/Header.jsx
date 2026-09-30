// src/components/Header.jsx
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/primefix-solutions-logo-dark-bg.svg'
import JellyButton from './JellyButton'
import { pageImports } from '../routes/pageRegistry'

const NAV_GROUPS = [
  {
    label: 'Services & Process',
    items: [
      { label: 'Our Services', href: '#services', isAnchor: true },
      { label: 'How We Work', href: '#process', isAnchor: true },
    ],
  },
  {
    label: 'Portfolio & Reviews',
    items: [
      { label: 'Work Portfolio', href: '#portfolio', isAnchor: true },
      { label: 'Client Reviews', href: '/reviews', isAnchor: false, importKey: 'reviews' },
    ],
  },
  {
    label: 'Help & Contact',
    items: [
      { label: 'FAQ', href: '/faq', isAnchor: false, importKey: 'faq' },
      { label: 'Contact Us', href: '#contact', isAnchor: true },
    ],
  },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  // Closes mobile drawer and removes focus so desktop dropdowns collapse instantly
  const closeMenu = () => {
    setMenuOpen(false)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  // Automatically close and clear focus whenever the route changes
  useEffect(() => {
    closeMenu()
  }, [location.pathname])

  useEffect(() => {
    if (!isHome) return

    const anchorHrefs = ['#services', '#portfolio', '#process', '#contact']
    const sections = anchorHrefs
      .map((href) => document.querySelector(href))
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
        <Link 
          to="/" 
          className="brand" 
          aria-label="PrimeFix Solutions home" 
          onClick={handleBrandClick}
          onMouseEnter={pageImports.home}
          onTouchStart={pageImports.home}
        >
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

        {/* Desktop Dropdown Navigation */}
        <nav className="primary" aria-label="Primary">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="nav-dropdown">
              <button type="button" className="dropdown-trigger">
                {group.label}
                <svg className="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div className="dropdown-menu">
                {group.items.map((item) =>
                  item.isAnchor ? (
                    <a
                      key={item.href}
                      className={`dropdown-item${activeId === item.href ? ' active' : ''}`}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="dropdown-item"
                      onClick={closeMenu}
                      onMouseEnter={item.importKey ? pageImports[item.importKey] : undefined}
                      onTouchStart={item.importKey ? pageImports[item.importKey] : undefined}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
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

      {/* Mobile Navigation Drawer */}
      <div id="mobile-nav" className={menuOpen ? 'open' : ''}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mobile-group">
            <span className="mobile-group-title">{group.label}</span>
            {group.items.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.href}
                  href={item.href}
                  className={activeId === item.href ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeMenu}
                  onMouseEnter={item.importKey ? pageImports[item.importKey] : undefined}
                  onTouchStart={item.importKey ? pageImports[item.importKey] : undefined}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        ))}
        <a href="tel:5550102000" onClick={closeMenu}><strong>(555) 010-2000</strong></a>
      </div>
    </header>
  )
}