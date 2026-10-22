import usePageTitle from '../hooks/usePageTitle'
import { SITE, telHref, mailHref } from '../config/site'
import Contact from '../components/Contact'
import { Breadcrumb } from '../components/PageCta'
import './seo-pages.css'

export default function ContactPage() {
  usePageTitle(
    'Contact & Free Estimates',
    `Request a free estimate from ${SITE.name}. Call ${SITE.phoneDisplay} or send a message. Serving ${SITE.serviceAreaLabel}.`
  )
  return (
    <>
      <section className="lp-page lp-contact-top">
        <div className="wrap lp-wrap">
          <Breadcrumb trail={[{ label: 'Contact' }]} />
          <header className="lp-header">
            <span className="kicker">Contact</span>
            <h1>Contact PrimeFix Solutions</h1>
            <p className="lp-lead">Tell us about the job and we will get back to you. Estimates are free.</p>
          </header>
          <dl className="lp-facts">
            <div><dt>Phone</dt><dd><a href={telHref}>{SITE.phoneDisplay}</a></dd></div>
            <div><dt>Email</dt><dd><a href={mailHref}>{SITE.email}</a></dd></div>
            <div><dt>Hours</dt><dd>{SITE.hours}</dd></div>
            <div><dt>Service area</dt><dd>{SITE.serviceAreaLabel}</dd></div>
          </dl>
        </div>
      </section>
      <Contact />
    </>
  )
}
