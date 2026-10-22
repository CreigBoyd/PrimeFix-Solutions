import { Link } from 'react-router-dom'
import { SITE, telHref } from '../config/site'

export function Breadcrumb({ trail }) {
  return (
    <nav className="lp-crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {trail.map((t) => (
        <span key={t.label}>
          <span aria-hidden="true"> / </span>
          {t.to ? <Link to={t.to}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export default function PageCta({ heading = 'Ready to get started?' }) {
  return (
    <section className="lp-cta">
      <h2>{heading}</h2>
      <p>Tell us about the job and we will get back to you with a straight answer on price and timing. Estimates are free.</p>
      <div className="lp-cta-actions">
        <Link to="/contact" className="btn btn-primary">Request a free estimate</Link>
        <a href={telHref} className="btn btn-outline">Call {SITE.phoneDisplay}</a>
      </div>
    </section>
  )
}
