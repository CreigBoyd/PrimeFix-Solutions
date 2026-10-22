import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SERVICES as SERVICE_PAGES } from '../data/serviceContent'
import logo from '../assets/primefix-solutions-logo-dark-bg.svg'
import { SITE, telHref, mailHref } from '../config/site'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faClock, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faPinterestP, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons'

const SOCIAL_DEFS = [
  { key: 'instagram', label: 'Instagram', icon: faInstagram },
  { key: 'facebook', label: 'Facebook', icon: faFacebookF },
  { key: 'pinterest', label: 'Pinterest', icon: faPinterestP },
  { key: 'linkedin', label: 'LinkedIn', icon: faLinkedinIn },
  { key: 'x', label: 'X (Twitter)', icon: faXTwitter },
]

const SERVICES = SERVICE_PAGES

export default function Footer() {
  const socialLinks = SOCIAL_DEFS.map((d) => ({ ...d, url: SITE.social?.[d.key] })).filter((d) => d.url)
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
            <h3>Services</h3>
            <ul>
              {SERVICES.map((svc) => (
                <li key={svc.slug}>
                  <Link to={`/services/${svc.slug}`}>{svc.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-col" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              <li><a href="#portfolio" onClick={(e) => handleNavClick(e, '#portfolio')}>Recent work</a></li>
              <li><Link to="/portfolio-transformations">Before &amp; after</Link></li>
              <li><Link to="/maintenance-plans">Maintenance plans</Link></li>
              <li><Link to="/cost-estimator">Cost estimator</Link></li>
              <li><Link to="/service-areas">Service areas</Link></li>
              <li><Link to="/guides">Guides</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </nav>

          <div className="footer-col footer-contact">
            <h3>Get in touch</h3>
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
          <span suppressHydrationWarning>© {new Date().getFullYear()} PrimeFix Solutions. Licensed &amp; insured — license # on request.</span>
          <button type="button" className="footer-top-btn" onClick={scrollTop}>
            Back to top <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </footer>
  )
}