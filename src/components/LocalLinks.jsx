import { Link } from 'react-router-dom'
import { SITE } from '../config/site'
import { AREAS } from '../data/areas'
import { GUIDES } from '../data/guides'
import '../pages/seo-pages.css'

/** Home-page block that links to the town pages and guides (good for visitors and for Google). */
export default function LocalLinks() {
  return (
    <section id="areas" className="band">
      <div className="wrap">
        <div className="section-head center">
          <span className="kicker">Service area</span>
          <h2>Serving {SITE.serviceAreaLabel}.</h2>
          <p>Find your town to see the services and local conditions we handle most.</p>
        </div>
        <ul className="lp-chips lp-chips-center">
          {AREAS.map((a) => (
            <li key={a.slug}><Link to={`/service-areas/${a.slug}`}>{a.name}, {a.state}</Link></li>
          ))}
          <li><Link to="/service-areas">All service areas</Link></li>
        </ul>

        <p className="lp-home-sub">Helpful guides for homeowners</p>
        <ul className="lp-chips lp-chips-center">
          {GUIDES.slice(0, 3).map((g) => (
            <li key={g.slug}><Link to={`/guides/${g.slug}`}>{g.title}</Link></li>
          ))}
          <li><Link to="/guides">All guides</Link></li>
        </ul>
      </div>
    </section>
  )
}
