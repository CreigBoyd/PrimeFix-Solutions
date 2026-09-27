import { useState } from 'react'
import { isValidEmail, isValidPhone } from '../utils/validation'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const SERVICE_OPTIONS = [
  'Carpentry',
  'Roofing',
  'Yard & grounds',
  'Handyman & repairs',
  'Painting & finishing',
  'Seasonal upkeep',
  'Not sure yet',
]

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  service: SERVICE_OPTIONS[0],
  message: '',
  company: '', // honeypot — real visitors never see or fill this in
}

// One validator per field that needs it. Return '' for valid, or the
// message to show. Fields not listed here (service, message) aren't
// required, so they're never validated.
const FIELD_VALIDATORS = {
  name: (value) => (value.trim() ? '' : 'Please enter your name.'),
  phone: (value) => {
    if (!value.trim()) return 'Please enter a phone number.'
    return isValidPhone(value) ? '' : 'That phone number looks too short.'
  },
  email: (value) => {
    if (!value.trim()) return '' // optional field
    return isValidEmail(value) ? '' : 'That email address looks invalid.'
  },
}

function CheckIcon() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5v5.5M12 16.2v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [touched, setTouched] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const validateField = (name, value) => {
    const validator = FIELD_VALIDATORS[name]
    return validator ? validator(value) : ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Once a field has been touched, re-validate live as they type/fix it.
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const validateAll = () => {
    const errors = {}
    Object.keys(FIELD_VALIDATORS).forEach((name) => {
      const message = validateField(name, form[name])
      if (message) errors[name] = message
    })
    return errors
  }

  const triggerShake = () => {
    setShake(true)
    window.setTimeout(() => setShake(false), 450)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateAll()
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setTouched({ name: true, phone: true, email: true })
      triggerShake()
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch(`${API_BASE}/send-mail.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong sending that. Please call or text us instead.')
      }

      setStatus('success')
      setForm(INITIAL_FORM)
      setTouched({})
      setFieldErrors({})
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const fieldStateClass = (name) => {
    if (touched[name] && fieldErrors[name]) return 'field invalid'
    if (touched[name] && form[name].trim()) return 'field valid'
    return 'field'
  }

  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Get in touch</span>
          <h2>Tell us what needs doing.</h2>
          <p>Estimates are free and there's no pressure to book. Reach out however's easiest.</p>
        </div>

        <div className="contact-wrap">
          <div className="contact-card">
            <h3>Direct contact</h3>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.4-1.4a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.7 2.1z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div><span className="label">Call or text</span><a href="tel:5550102000">(555) 010-2000</a></div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 6l8 7 8-7" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div><span className="label">Email</span><a href="mailto:hello@primefixsolutions.com">hello@primefixsolutions.com</a></div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div><span className="label">Hours</span><span>Mon–Sat, 7am–6pm</span></div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <div><span className="label">Response time</span><span>Within 24 hours</span></div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div><span className="label">Credentials</span><span>Licensed &amp; fully insured</span></div>
            </div>
          </div>

          <form className={`estimate${shake ? ' shake' : ''}`} onSubmit={handleSubmit} noValidate>
            {/* Honeypot: hidden from real visitors via CSS, bots fill it in */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="hp-field"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="form-row">
              <div className={fieldStateClass('name')}>
                <label htmlFor="name">Name</label>
                <div className="field-control">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.name && fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  />
                  {touched.name && fieldErrors.name && <AlertIcon />}
                  {touched.name && !fieldErrors.name && form.name.trim() && <CheckIcon />}
                </div>
                {touched.name && fieldErrors.name && (
                  <span className="field-error" id="name-error">{fieldErrors.name}</span>
                )}
              </div>

              <div className={fieldStateClass('phone')}>
                <label htmlFor="phone">Phone</label>
                <div className="field-control">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.phone && fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  />
                  {touched.phone && fieldErrors.phone && <AlertIcon />}
                  {touched.phone && !fieldErrors.phone && form.phone.trim() && <CheckIcon />}
                </div>
                {touched.phone && fieldErrors.phone && (
                  <span className="field-error" id="phone-error">{fieldErrors.phone}</span>
                )}
              </div>
            </div>

            <div className={fieldStateClass('email')}>
              <label htmlFor="email">Email</label>
              <div className="field-control">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.email && fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                />
                {touched.email && fieldErrors.email && <AlertIcon />}
                {touched.email && !fieldErrors.email && form.email.trim() && <CheckIcon />}
              </div>
              {touched.email && fieldErrors.email && (
                <span className="field-error" id="email-error">{fieldErrors.email}</span>
              )}
            </div>

            <div>
              <label htmlFor="service">What do you need done?</label>
              <select id="service" name="service" value={form.service} onChange={handleChange}>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message">A bit about the job</label>
              <textarea
                id="message"
                name="message"
                placeholder="Address, what's going on, and any timing to work around..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {status === 'error' && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Request estimate'}
            </button>

            <div id="form-success" className={status === 'success' ? 'show' : ''}>
              Thanks — that's on its way. We'll be in touch shortly to set up a time to take a look.
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
