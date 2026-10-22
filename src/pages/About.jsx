import usePageTitle from '../hooks/usePageTitle'
import { SITE } from '../config/site'
import { ABOUT } from '../data/about'
import Credentials from '../components/Credentials'
import PageCta, { Breadcrumb } from '../components/PageCta'
import './seo-pages.css'

export default function About() {
  const hasStory = ABOUT.story.length > 0
  // Stay out of Google's index until the page has real content.
  usePageTitle(
    'About Us',
    `About ${SITE.name}: who we are, how we work, and the area we serve in Essex County, MA.`,
    { noindex: !hasStory }
  )
  const { owner } = ABOUT

  return (
    <section className="lp-page">
      <div className="wrap lp-wrap">
        <Breadcrumb trail={[{ label: 'About' }]} />
        <header className="lp-header">
          <span className="kicker">About</span>
          <h1>About {SITE.name}</h1>
          {hasStory && <p className="lp-lead">{ABOUT.story[0]}</p>}
        </header>

        {ABOUT.story.length > 1 && (
          <section className="lp-block">
            {ABOUT.story.slice(1).map((p) => <p key={p}>{p}</p>)}
          </section>
        )}

        {owner.name && (
          <section className="lp-block lp-owner">
            {owner.photo && <img src={owner.photo} alt={owner.name} width="240" height="240" loading="lazy" />}
            <div>
              <h2>{owner.name}</h2>
              {owner.role && <p className="lp-muted">{owner.role}</p>}
              {owner.bio && <p>{owner.bio}</p>}
            </div>
          </section>
        )}

        {ABOUT.facts.length > 0 && (
          <section className="lp-block">
            <dl className="lp-facts">
              {ABOUT.facts.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
          </section>
        )}

        <section className="lp-block" aria-labelledby="how-h">
          <h2 id="how-h">How we work</h2>
          <ul className="lp-list">
            <li><strong>Free estimates.</strong> We look at the job and give you a straight answer on price and timing before anything starts.</li>
            <li><strong>In writing.</strong> Scope, price, schedule and payment terms are agreed in writing before work begins.</li>
            <li><strong>Honest scoping.</strong> If a repair will do, we will not sell you a replacement. If a job needs a licensed specialist, we will say so.</li>
          </ul>
        </section>

        <Credentials />
        <PageCta />
      </div>
    </section>
  )
}
