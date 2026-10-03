import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/primefix-solutions-logo-dark-bg.svg'
import { SITE, telHref, mailHref } from '../config/site'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons'

const SOCIAL_DEFS = [
  { key: 'facebook', label: 'Facebook', icon: faFacebookF },
  { key: 'instagram', label: 'Instagram', icon: faInstagram },
  { key: 'linkedin', label: 'LinkedIn', icon: faLinkedinIn },
  { key: 'x', label: 'X (Twitter)', icon: faXTwitter },
]

export default function Footer() {
  const socialLinks = SOCIAL_DEFS.map((d) => ({ ...d, url: SITE.social[d.key] })).filter((d) => d.url)
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
            <Link to="/" onClick={handleBrandClick} className="footer-brand-link">
              <img
                src={logo}
                alt="PrimeFix Solutions Logo"
                loading="lazy"
                className="primefix-footer-logo"
                width="42"
                height="42"
              />
              <strong>PrimeFix Solutions</strong>
            </Link>
            <p>Carpentry, roofing, repairs, painting, and grounds work — every trade, one team.</p>
            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map(({ key, label, icon, url }) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
            )}
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
                <li><a href={telHref}>{SITE.phoneDisplay}</a></li>
                <li><a href={mailHref}>{SITE.email}</a></li>
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