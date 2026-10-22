import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { SERVICES } from '../data/serviceContent'
import PageCta, { Breadcrumb } from '../components/PageCta'
import './seo-pages.css'

export default function ServicesHub() {
  usePageTitle(
    'Home Repair & Maintenance Services',
    'Roofing, carpentry, painting, handyman repairs, yard care and seasonal upkeep in Essex County, MA. See what PrimeFix Solutions handles.'
  )
  return (
    <section className="lp-page">
      <div className="wrap lp-wrap">
        <Breadcrumb trail={[{ label: 'Services' }]} />
        <header className="lp-header">
          <span className="kicker">Services</span>
          <h1>Home repair and maintenance services</h1>
          <p className="lp-lead">One crew for the repairs and upkeep that keep a house in good shape. Pick a service to see what we handle and the questions we hear most.</p>
        </header>
        <div className="lp-grid">
          {SERVICES.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="lp-card">
              <h3>{s.name}</h3>
              <p>{s.covers.slice(0, 3).join(' \u00b7 ')}</p>
            </Link>
          ))}
        </div>
        <p className="lp-muted lp-after">Not sure which fits? Try the <Link to="/cost-estimator">cost estimator</Link> or <Link to="/contact">contact us</Link>.</p>
        <PageCta />
      </div>
    </section>
  )
}
