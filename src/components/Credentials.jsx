import { SITE } from '../config/site'

/** Shows license / registration / insurance details. Renders nothing until you fill in SITE.credentials. */
export default function Credentials() {
  const { hicNumber, csLicense, insurance } = SITE.credentials || {}
  const rows = [
    hicNumber && ['MA Home Improvement Contractor registration', hicNumber],
    csLicense && ['MA Construction Supervisor License', csLicense],
    insurance && ['Insurance', insurance],
  ].filter(Boolean)
  if (!rows.length) return null

  return (
    <section className="lp-block" aria-labelledby="creds-h">
      <h2 id="creds-h">Licensing &amp; insurance</h2>
      <dl className="lp-facts">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
