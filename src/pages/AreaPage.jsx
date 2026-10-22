import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import useJsonLd from '../hooks/useJsonLd'
import { SITE } from '../config/site'
import { SERVICES } from '../data/serviceContent'
import { AREAS, getArea } from '../data/areas'
import Credentials from '../components/Credentials'
import PageCta, { Breadcrumb } from '../components/PageCta'
import NotFound from './NotFound'
import './seo-pages.css'

const ORIGIN = 'https://primefix.vip'

export default function AreaPage() {
  const { slug } = useParams()
  const area = getArea(slug)

  usePageTitle(
    area ? `Handyman & Home Repair in ${area.name}, ${area.state}` : 'Page not found',
    area && `Roofing, carpentry, painting, handyman repairs and seasonal upkeep in ${area.name}, ${area.state}. Request a free estimate from PrimeFix Solutions.`,
    { noindex: !area }
  )

  const url = `${ORIGIN}/service-areas/${slug}/`
  useJsonLd(
    `area-${slug}`,
    area && {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'Service areas', item: `${ORIGIN}/service-areas/` },
        { '@type': 'ListItem', position: 3, name: area.name, item: url },
      ],
    }
  )

  if (!area) return <NotFound />
  const nearby = area.nearby.map(getArea).filter(Boolean)

  return (
    <article className="lp-page">
      <div className="wrap lp-wrap">
        <Breadcrumb trail={[{ label: 'Service areas', to: '/service-areas' }, { label: area.name }]} />

        <header className="lp-header">
          <span className="kicker">{area.name}, {area.state}</span>
          <h1>Handyman and home repair in {area.name}, {area.state}</h1>
          <p className="lp-lead">{area.intro}</p>
        </header>

        <section className="lp-block" aria-labelledby="notes-h">
          <h2 id="notes-h">What we see in {area.name}</h2>
          <ul className="lp-list">
            {area.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </section>

        <section className="lp-block" aria-labelledby="svc-h">
          <h2 id="svc-h">Services in {area.name}</h2>
          <div className="lp-grid">
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="lp-card">
                <h3>{s.name}</h3>
                <p>{s.covers.slice(0, 3).join(' \u00b7 ')}</p>
              </Link>
            ))}
          </div>
        </section>

        <Credentials />

        {nearby.length > 0 && (
          <section className="lp-block" aria-labelledby="near-h">
            <h2 id="near-h">Also serving nearby</h2>
            <ul className="lp-chips">
              {nearby.map((a) => (
                <li key={a.slug}><Link to={`/service-areas/${a.slug}`}>{a.name}, {a.state}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <PageCta heading={`Need work done in ${area.name}?`} />
      </div>
    </article>
  )
}
