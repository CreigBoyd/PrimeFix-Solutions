import { Link } from 'react-router-dom'

const STEPS = [
  { num: 1, title: 'Reach out', desc: "Call, text, or send the form below. Tell us what's going on." },
  { num: 2, title: 'Walk the property', desc: 'We come out, take a look, and give you a written estimate — free, no pressure.' },
  { num: 3, title: 'Get it scheduled', desc: 'You get a real date and a clear scope of work before anything starts.' },
  { num: 4, title: 'Walkthrough & clean finish', desc: 'We review the finished work with you and leave the site tidy.' },
]

export default function Process() {
  return (
    <section id="process" className="band">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">How it works</span>
          <h2>Four steps, start to finish.</h2>
        </div>
        <div className="process-list">
          {STEPS.map((step) => (
            <div className="process-step" key={step.num}>
              <span className="num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Classy Maintenance Plan Callout Banner */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, var(--bg-card, #132231), var(--bg, #0a131c))',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
        }}>
          <div style={{ maxWidth: '580px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--teal-bright, #2dd4bf)', fontWeight: 700, letterSpacing: '0.05em' }}>
              Looking for long-term peace of mind?
            </span>
            <h3 style={{ fontSize: '1.35rem', marginTop: '6px', marginBottom: '8px', color: '#fff' }}>
              Explore our Season Property Maintenance Plans
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-soft, #94a3b8)', margin: 0, lineHeight: 1.5 }}>
              Never worry about seasonal gutter clearings, winterization, or sudden upkeep again. Build a custom maintenance schedule tailored to your property.
            </p>
          </div>
          <Link
            to="/maintenance-plans"
            className="btn btn-primary"
            style={{
              padding: '14px 24px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Build Your Plan</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}