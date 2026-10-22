import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { SITE } from '../config/site'
import { AREAS } from '../data/areas'
import PageCta, { Breadcrumb } from '../components/PageCta'
import './seo-pages.css'

export default function AreasHub() {
  usePageTitle(
    'Service Areas',
    'PrimeFix Solutions serves Amesbury, Newburyport, Salisbury, Haverhill, Newbury and nearby Essex County, MA communities.'
  )
  return (
    <section className="lp-page">
      <div className="wrap lp-wrap">
        <Breadcrumb trail={[{ label: 'Service areas' }]} />
        <header className="lp-header">
          <span className="kicker">Service areas</span>
          <h1>Where we work</h1>
          <p className="lp-lead">We serve {SITE.serviceAreaLabel}. Choose your town to see the services and local conditions we deal with most.</p>
        </header>
        <div className="lp-grid">
          {AREAS.map((a) => (
            <Link key={a.slug} to={`/service-areas/${a.slug}`} className="lp-card">
              <h3>{a.name}, {a.state}</h3>
              <p>{a.notes[0]}</p>
            </Link>
          ))}
        </div>
        <p className="lp-muted lp-after">Do not see your town? Call {SITE.phoneDisplay} or <Link to="/contact">send a message</Link> and we will tell you whether we can help.</p>
        <PageCta />
      </div>
    </section>
  )
}
