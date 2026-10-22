import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import useJsonLd from '../hooks/useJsonLd'
import { SITE } from '../config/site'
import { GUIDES, getGuide } from '../data/guides'
import { getService } from '../data/serviceContent'
import PageCta, { Breadcrumb } from '../components/PageCta'
import NotFound from './NotFound'
import './seo-pages.css'

const ORIGIN = 'https://primefix.vip'

export default function GuidePage() {
  const { slug } = useParams()
  const guide = getGuide(slug)

  usePageTitle(guide ? guide.title : 'Page not found', guide?.metaDescription, { noindex: !guide })

  const url = `${ORIGIN}/guides/${slug}/`
  useJsonLd(
    `guide-${slug}`,
    guide && [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.metaDescription,
        datePublished: guide.published,
        dateModified: guide.published,
        mainEntityOfPage: url,
        image: `${ORIGIN}/og-image.jpg`,
        author: { '@type': 'Organization', name: SITE.name },
        publisher: { '@type': 'Organization', name: SITE.name, url: ORIGIN },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${ORIGIN}/guides/` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ]
  )

  if (!guide) return <NotFound />
  const service = getService(guide.service)
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3)
  const date = new Date(guide.published + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <article className="lp-page">
      <div className="wrap lp-wrap lp-article">
        <Breadcrumb trail={[{ label: 'Guides', to: '/guides' }, { label: guide.title }]} />
        <header className="lp-header">
          <span className="kicker">Guide</span>
          <h1>{guide.title}</h1>
          <p className="lp-muted">{date} · {guide.minutes} min read</p>
          <p className="lp-lead">{guide.intro}</p>
        </header>

        {guide.sections.map((s) => (
          <section key={s.heading} className="lp-block">
            <h2>{s.heading}</h2>
            {(s.paragraphs || []).map((p) => <p key={p}>{p}</p>)}
            {s.bullets && (
              <ul className="lp-list">
                {s.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </section>
        ))}

        {service && (
          <section className="lp-block">
            <p>
              Need a hand? See our <Link to={`/services/${service.slug}`}>{service.name.toLowerCase()} services</Link> or{' '}
              <Link to="/contact">request a free estimate</Link>.
            </p>
          </section>
        )}

        {others.length > 0 && (
          <section className="lp-block">
            <h2>More guides</h2>
            <ul className="lp-chips">
              {others.map((g) => <li key={g.slug}><Link to={`/guides/${g.slug}`}>{g.title}</Link></li>)}
            </ul>
          </section>
        )}

        <PageCta />
      </div>
    </article>
  )
}
