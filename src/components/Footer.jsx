import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/primefix-solutions-logo-dark-bg.svg'
import { SITE, telHref, mailHref } from '../config/site'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faClock, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons'

const SOCIAL_DEFS = [
  { key: 'facebook', label: 'Facebook', icon: faFacebookF },
  { key: 'instagram', label: 'Instagram', icon: faInstagram },
  { key: 'linkedin', label: 'LinkedIn', icon: faLinkedinIn },
  { key: 'x', label: 'X (Twitter)', icon: faXTwitter },
]

const SERVICES = [
  'Carpentry',
  'Roofing',
  'Yard & grounds',
  'Handyman & repairs',
  'Painting & finishing',
  'Seasonal upkeep',
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

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleBrandClick = (e) => {
    e.preventDefault()
    if (!isHome) navigate('/')
    scrollTop()
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

            <p className="footer-signature cursive">Every trade. One team.</p>
            <p className="footer-blurb">
              Carpentry, roofing, repairs, painting, and grounds work, handled by one crew that
              shows up when it says it will.
            </p>

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

          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              {SERVICES.map((name) => (
                <li key={name}>
                  <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>{name}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-col" aria-label="Explore">
            <h5>Explore</h5>
            <ul>
              <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')}>Recent work</a></li>
              <li><Link to="/portfolio-transformations">Before &amp; after</Link></li>
              <li><Link to="/maintenance-plans">Maintenance plans</Link></li>
              <li><Link to="/cost-estimator">Cost estimator</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </nav>

          <div className="footer-col footer-contact">
            <h5>Get in touch</h5>
            <ul>
              <li>
                <FontAwesomeIcon icon={faPhone} className="footer-ico" />
                <a href={telHref}>{SITE.phoneDisplay}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="footer-ico" />
                <a href={mailHref}>{SITE.email}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faClock} className="footer-ico" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
            <a
              href="#contact"
              className="btn btn-primary footer-cta"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Get a free estimate
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PrimeFix Solutions. Licensed &amp; insured — license # on request.</span>
          <button type="button" className="footer-top-btn" onClick={scrollTop}>
            Back to top <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  )
}
