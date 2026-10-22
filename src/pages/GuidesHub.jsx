import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { GUIDES } from '../data/guides'
import PageCta, { Breadcrumb } from '../components/PageCta'
import './seo-pages.css'

export default function GuidesHub() {
  usePageTitle(
    'Home Maintenance Guides',
    'Practical guides for New England homeowners: roof repair, ice dams, deck repair, and seasonal maintenance checklists from PrimeFix Solutions.'
  )
  return (
    <section className="lp-page">
      <div className="wrap lp-wrap">
        <Breadcrumb trail={[{ label: 'Guides' }]} />
        <header className="lp-header">
          <span className="kicker">Guides</span>
          <h1>Home maintenance guides</h1>
          <p className="lp-lead">Plain-English answers to the questions New England homeowners ask us most, from roofs and decks to seasonal checklists.</p>
        </header>
        <div className="lp-grid">
          {GUIDES.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="lp-card">
              <h3>{g.title}</h3>
              <p>{g.metaDescription}</p>
            </Link>
          ))}
        </div>
        <PageCta />
      </div>
    </section>
  )
}
