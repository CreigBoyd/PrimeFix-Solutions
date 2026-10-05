import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { SITE, mailHref, telHref } from '../config/site'

const UPDATED = 'October 5, 2026'

export default function Privacy() {
  usePageTitle(
    'Privacy Policy',
    'How PrimeFix Solutions collects, uses and protects the information you share through our website.'
  )

  return (
    <section className="privacy-page">
      <div className="wrap privacy-wrap">
        <Link to="/" className="privacy-back">← Back to home</Link>

        <header className="privacy-header">
          <span className="kicker">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="privacy-updated">Last updated: {UPDATED}</p>
        </header>

        <div className="privacy-body">
          <p>
            This policy explains what information {SITE.name} ("we", "us") collects through{' '}
            <strong>primefix.vip</strong>, how we use it, and the choices you have. We keep it short and plain on purpose.
          </p>

          <section className="policy-block">
            <h2>1. Information we collect</h2>
            <h3>Information you give us</h3>
            <ul>
              <li><strong>Estimate, booking and service requests</strong> (contact form, consultation booking, cost estimator, maintenance plans, service explorer and the chat assistant): your name, phone number, optional email address, the service you are interested in, and any details you write in your message.</li>
              <li><strong>Newsletter:</strong> your email address and the date you subscribed.</li>
              <li><strong>Reviews:</strong> your name, the service, your star rating and the text of your review.</li>
              <li><strong>Calls, texts and email:</strong> if you contact us directly, we receive your phone number or email address and the content of your message.</li>
            </ul>
            <h3>Information collected automatically</h3>
            <ul>
              <li><strong>Analytics (only if you accept cookies):</strong> anonymous usage data such as pages viewed, device type and approximate location, collected by Google Analytics with IP anonymization turned on. If you decline, analytics never loads.</li>
              <li><strong>Your cookie choice:</strong> saved in your browser's local storage so we do not ask you again.</li>
              <li><strong>Security and rate limiting:</strong> to stop spam and abuse, our server briefly keeps a one-way hashed form of your IP address with a request counter. Our hosting provider may also keep standard server logs.</li>
            </ul>
            <p>
              The service-area (ZIP code) checker runs entirely in your browser. The ZIP code you type is not sent to us or stored.
            </p>
          </section>

          <section className="policy-block">
            <h2>2. How we use it</h2>
            <ul>
              <li>To reply to your request, prepare estimates, and schedule consultations and work.</li>
              <li>To send you a confirmation email when you give us an email address with a request.</li>
              <li>To send seasonal maintenance reminders if you subscribed to the newsletter. Every email can be unsubscribed from, or you can ask us to remove you at any time.</li>
              <li>To publish customer reviews on our Reviews page. We only publish a review after we have approved it.</li>
              <li>To understand how the site is used and improve it (analytics, with your consent), and to keep the site secure.</li>
            </ul>
            <p>We do not use your information for automated decision-making.</p>
          </section>

          <section className="policy-block">
            <h2>3. Who we share it with</h2>
            <p>
              <strong>We do not sell or rent your personal information.</strong> We share it only with the
              service providers needed to run the site and our business:
            </p>
            <ul>
              <li><strong>Our web hosting and email provider,</strong> which delivers your form submissions to us and our confirmation emails to you.</li>
              <li><strong>Google</strong> (Analytics, only if you accept cookies).</li>
              <li>Professionals or authorities where the law requires it, or to protect our rights and safety.</li>
            </ul>
          </section>

          <section className="policy-block">
            <h2>4. How long we keep it</h2>
            <p>
              We keep service requests and related correspondence for as long as needed to respond to you, perform
              any work, and meet our business, tax and legal record-keeping needs. Newsletter addresses are kept until
              you unsubscribe. Rate-limiting data is short-lived. You can ask us to delete your information at any
              time (see "Your choices").
            </p>
          </section>

          <section className="policy-block">
            <h2>5. Cookies and local storage</h2>
            <p>
              We use a single optional analytics cookie set (Google Analytics) and only after you click Accept on the
              cookie banner. We store your banner choice in local storage. The site is also installable as an app
              and caches pages and images on your device so it loads faster; you can clear this in your browser
              settings. To change your cookie choice, clear this site's data in your browser and the banner will
              appear again.
            </p>
          </section>

          <section className="policy-block">
            <h2>6. Security</h2>
            <p>
              The site is served over HTTPS and form submissions are sent to our server over an encrypted connection.
              We limit who can see submissions and use input checks and anti-spam measures. No method of transmission
              or storage is completely secure, so we cannot guarantee absolute security. Please do not send sensitive
              information such as payment card numbers or government IDs through the website forms.
            </p>
          </section>

          <section className="policy-block">
            <h2>7. Your choices</h2>
            <p>
              You can ask to see, correct or delete the personal information we hold about you, or to be removed from
              our newsletter, by contacting us below. Depending on where you live, you may have additional rights under
              local law; we will honor valid requests as required.
            </p>
          </section>

          <section className="policy-block">
            <h2>8. Children</h2>
            <p>
              Our website is intended for property owners and managers and is not directed to children under 13. We do
              not knowingly collect information from children.
            </p>
          </section>

          <section className="policy-block">
            <h2>9. Changes to this policy</h2>
            <p>
              If we change how we handle information, we will update this page and the "Last updated" date above.
            </p>
          </section>

          <section className="policy-block">
            <h2>10. Contact us</h2>
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
