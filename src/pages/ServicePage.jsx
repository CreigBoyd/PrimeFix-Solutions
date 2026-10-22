import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import useJsonLd from '../hooks/useJsonLd'
import { SITE } from '../config/site'
import { SERVICES, getService } from '../data/serviceContent'
import { AREAS } from '../data/areas'
import Credentials from '../components/Credentials'
import { SERVICE_IMAGES } from '../data/serviceImages'
import PageCta, { Breadcrumb } from '../components/PageCta'
import NotFound from './NotFound'
import './seo-pages.css'

const ORIGIN = 'https://primefix.vip'

export default function ServicePage() {
  const { slug } = useParams()
  const service = getService(slug)

  usePageTitle(service ? service.title : 'Page not found', service?.metaDescription, { noindex: !service })

  const url = `${ORIGIN}/services/${slug}/`
  useJsonLd(
    `service-${slug}`,
    service && [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        serviceType: service.name,
        description: service.metaDescription,
        url,
        provider: { '@type': 'LocalBusiness', '@id': ORIGIN, name: SITE.name },
        areaServed: AREAS.map((a) => ({ '@type': 'City', name: `${a.name}, ${a.state}` })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${ORIGIN}/services/` },
          { '@type': 'ListItem', position: 3, name: service.name, item: url },
        ],
      },
    ]
  )

  if (!service) return <NotFound />
  const related = service.related.map(getService).filter(Boolean)
  const photo = SERVICE_IMAGES[service.slug]

  return (
    <article className="lp-page">
      <div className="wrap lp-wrap">
        <Breadcrumb trail={[{ label: 'Services', to: '/services' }, { label: service.name }]} />

        <header className={`lp-header${photo ? ' lp-header-photo' : ''}`}>
          <div>
            <span className="kicker">{service.name}</span>
            <h1>{service.headline}</h1>
            <p className="lp-lead">{service.intro}</p>
          </div>
          {photo && (
            <img src={photo.src} alt={photo.alt} width="800" height="500" fetchpriority="high" decoding="async" />
          )}
        </header>

        <div className="lp-two">
          <section className="lp-block" aria-labelledby="covers-h">
            <h2 id="covers-h">What we handle</h2>
            <ul className="lp-list">
              {service.covers.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </section>
          <section className="lp-block" aria-labelledby="signs-h">
            <h2 id="signs-h">Signs it is time to call</h2>
            <ul className="lp-list">
              {service.signs.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </section>
        </div>

        <section className="lp-block" aria-labelledby="faq-h">
          <h2 id="faq-h">Common questions</h2>
          <div className="lp-faq">
            {service.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="lp-block" aria-labelledby="where-h">
          <h2 id="where-h">Where we work</h2>
          <p className="lp-muted">{service.name} for homes and rental properties in:</p>
          <ul className="lp-chips">
            {AREAS.map((a) => (
              <li key={a.slug}><Link to={`/service-areas/${a.slug}`}>{a.name}, {a.state}</Link></li>
            ))}
          </ul>
        </section>

        <Credentials />

        {related.length > 0 && (
          <section className="lp-block" aria-labelledby="rel-h">
            <h2 id="rel-h">Related services</h2>
            <ul className="lp-chips">
              {related.map((r) => (
                <li key={r.slug}><Link to={`/services/${r.slug}`}>{r.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <PageCta />
      </div>
    </article>
  )
}
