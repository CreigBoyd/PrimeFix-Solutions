import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { SITE, mailHref, telHref } from '../config/site'

const UPDATED = 'October 5, 2026'

export default function Terms() {
  usePageTitle(
    'Terms of Service',
    'The terms that apply to using the PrimeFix Solutions website and to estimates and service work we provide.'
  )

  return (
    <section className="privacy-page">
      <div className="wrap privacy-wrap">
        <Link to="/" className="privacy-back">← Back to home</Link>

        <header className="privacy-header">
          <span className="kicker">Legal</span>
          <h1>Terms of Service</h1>
          <p className="privacy-updated">Last updated: {UPDATED}</p>
        </header>

        <div className="privacy-body">
          <p>
            These terms apply to your use of <strong>primefix.vip</strong> and to estimates and services provided by{' '}
            {SITE.name} ("we", "us"). By using the website or requesting an estimate, you agree to them. If you do
            not agree, please do not use the site.
          </p>

          <section className="policy-block">
            <h2>1. Using this website</h2>
            <ul>
              <li>The website is provided for general information and to help you contact us and request estimates.</li>
              <li>Please give accurate information in our forms and do not submit anything unlawful, abusive or misleading, or attempt to disrupt or probe the site or its security.</li>
              <li>Content on this site, including text, logos and photographs, belongs to {SITE.name} or its licensors. You may not copy or reuse it commercially without our written permission.</li>
            </ul>
          </section>

          <section className="policy-block">
            <h2>2. Estimates, ballpark figures and the cost estimator</h2>
            <p>
              The online cost estimator, service explorer and any figures shown on this site are{' '}
              <strong>general ballpark ranges only</strong>. They are not quotes, offers or guarantees of price. A
              firm price is given only in a written estimate or agreement after we understand your project and,
              where needed, inspect the property. Actual cost depends on conditions, materials, access, permits and
              scope.
            </p>
          </section>

          <section className="policy-block">
            <h2>3. Booking a consultation</h2>
            <p>
              A consultation request is not a confirmed appointment until we confirm it with you by phone, text or
              email. Consultation windows fall within our business hours ({SITE.hours}). If you need to
              reschedule or cancel, please tell us as early as you can so we can offer the time to someone else.
            </p>
          </section>

          <section className="policy-block">
            <h2>4. Service work</h2>
            <ul>
              <li><strong>Written agreement.</strong> Work begins only after you and we agree on the scope, price, schedule and payment terms in writing. Those terms, together with these terms, form the agreement for the job. If they conflict, the written agreement for the job controls.</li>
              <li><strong>Changes.</strong> Changes to the scope, materials or schedule are agreed in writing and may change the price and timeline.</li>
              <li><strong>Access and conditions.</strong> You confirm that you own the property or are authorized to have the work done, and that we will have safe access. Hidden conditions such as rot, structural damage, or code or safety issues found once work begins may require additional work, which we will explain to you before proceeding.</li>
              <li><strong>Permits and approvals.</strong> Where a permit or approval (including from a landlord, condominium association or town) is required, we will tell you who is responsible for obtaining it as part of the written agreement.</li>
              <li><strong>Weather and delays.</strong> Exterior work depends on the weather, and schedules can also be affected by material availability. Dates we give are good-faith estimates unless the written agreement says otherwise.</li>
              <li><strong>Payment.</strong> Deposits, progress payments and the due date for the balance are set out in your written estimate or agreement.</li>
            </ul>
          </section>

          <section className="policy-block">
            <h2>5. Workmanship and warranty</h2>
            <p>
              We stand behind our work. Any workmanship warranty, including its length and what it covers, is stated in
              your written agreement. Warranties do not cover normal wear and tear, damage caused by misuse, neglect,
              accidents or severe weather, or work done by others after we finish. Manufacturer warranties on
              materials and products are provided by the manufacturer.
            </p>
          </section>

          <section className="policy-block">
            <h2>6. Emergency and storm-damage requests</h2>
            <p>
              For urgent repairs we will do our best to respond quickly, but availability depends on our crews and
              conditions. Emergency work is generally temporary protection (such as tarping or securing) unless we agree
              otherwise in writing. If there is danger to life or a fire, gas leak or electrical hazard, call 911 first.
            </p>
          </section>

          <section className="policy-block">
            <h2>7. Maintenance plans</h2>
            <p>
              The maintenance plan information on this site is a summary. The services included, visit frequency,
              pricing, billing and cancellation terms for any plan are confirmed in a written plan agreement before you
              are enrolled.
            </p>
          </section>

          <section className="policy-block">
            <h2>8. Reviews and photos</h2>
            <p>
              If you submit a review, you confirm it is honest and based on your own experience, and you allow us to
              publish it on this site after we approve it. We may decline to publish reviews that are abusive,
              off-topic or unverifiable. We will only show photos of your property in our portfolio with your permission.
            </p>
          </section>

          <section className="policy-block">
            <h2>9. Limits of liability</h2>
            <p>
              The website is provided "as is" and we do not promise it will always be available or error-free. To the
              fullest extent permitted by law, we are not liable for indirect or consequential losses arising from
              your use of the website, and our liability for service work is limited to the amount you paid us for
              the work in question, except where the law does not allow such a limit (for example, for our own
              negligence causing personal injury). Nothing in these terms limits any rights you have under
              consumer protection law.
            </p>
          </section>

          <section className="policy-block">
            <h2>10. Privacy</h2>
            <p>
              How we handle your information is described in our <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </section>

          <section className="policy-block">
            <h2>11. Governing law and changes</h2>
            <p>
              These terms are governed by the laws of the Commonwealth of Massachusetts. We may update them from time
              to time; the version on this page, with its "Last updated" date, applies to your use of the site. Work
              under a signed agreement is governed by that agreement's terms.
            </p>
          </section>

          <section className="policy-block">
            <h2>12. Contact us</h2>
            <p>
              {SITE.name}<br />
              Email: <a href={mailHref}>{SITE.email}</a><br />
              Phone: <a href={telHref}>{SITE.phoneDisplay}</a><br />
              Hours: {SITE.hours}
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
