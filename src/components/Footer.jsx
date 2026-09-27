import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/primefix-solutions-logo-dark-bg.svg'

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const handleNavClick = (e, href) => {
    e.preventDefault()
    if (!isHome) {
      navigate('/', { state: { scrollTo: href } })
    } else {
      let target = null
      try {
        target = document.querySelector(href)
      } catch {
        target = document.getElementById(href.replace(/^#/, ''))
      }
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleBrandClick = (e) => {
    e.preventDefault()
    if (!isHome) {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="site">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" onClick={handleBrandClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
              <img
                src={logo}
                alt=""
                className="primefix-footer-logo"
                width="42"
                height="42"
              />
              <div>
                <strong>PrimeFix Solutions</strong>
                <p>Carpentry, roofing, repairs, painting, and grounds work — every trade, one team.</p>
              </div>
            </Link>
          </div>
          <div className="footer-links">
            <div>
              <h5>Site</h5>
              <ul>
                <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Services</a></li>
                <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')}>Portfolio</a></li>
                <li><a href="#process" onClick={(e) => handleNavClick(e, '#process')}>Process</a></li>
                <li><Link to="/reviews">Reviews</Link></li>
                <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h5>Contact</h5>
              <ul>
                <li><a href="tel:5550102000">(555) 010-2000</a></li>
                <li><a href="mailto:hello@primefixsolutions.com">hello@primefixsolutions.com</a></li>
                <li><span>Mon–Sat, 7am–6pm</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PrimeFix Solutions. Licensed &amp; insured — license # on request.</span>
          <span>Every trade. One team.</span>
        </div>
      </div>
    </footer>
  )
}