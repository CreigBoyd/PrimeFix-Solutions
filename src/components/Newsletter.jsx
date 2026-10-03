import { useState } from 'react'
import { isValidEmail } from '../utils/validation'
import { postJSON } from '../utils/api'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [touched, setTouched] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const validate = (value) => {
    if (!value.trim()) return 'Enter your email address.'
    return isValidEmail(value) ? '' : 'Enter a valid email address.'
  }

  const handleChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (touched) setFieldError(validate(value))
  }

  const handleBlur = () => {
    setTouched(true)
    setFieldError(validate(email))
  }

  const triggerShake = () => {
    setShake(true)
    window.setTimeout(() => setShake(false), 450)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const message = validate(email)
    if (message) {
      setTouched(true)
      setFieldError(message)
      triggerShake()
      return
    }

    setStatus('loading')
    setError('')

    try {
      await postJSON('subscribe.php', { email, company })

      setStatus('success')
      setEmail('')
      setTouched(false)
      setFieldError('')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div className="newsletter-blob"></div>
      <div className="wrap newsletter-inner">
        <div className="newsletter-copy">
          <span className="kicker">Stay in the loop</span>
          <h2 id="newsletter-heading">Seasonal reminders, before you need them.</h2>
          <p>One short email when it's time to book gutter cleaning, winterizing, or spring turnover — never more than that.</p>
        </div>

        <div className="newsletter-form-wrap">
          {status === 'success' ? (
            <div className="newsletter-success">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              You're on the list — thanks for subscribing.
            </div>
          ) : (
            <form
              className={`newsletter-form${shake ? ' shake' : ''}${touched && fieldError ? ' invalid' : ''}`}
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hp-field"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />
              <input
                type="email"
                className="newsletter-input"
                placeholder="you@email.com"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched && fieldError)}
                aria-describedby={fieldError ? 'newsletter-error' : undefined}
                aria-label="Email address"
              />
              <button className="newsletter-btn" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}

          {touched && fieldError && <p className="newsletter-error" id="newsletter-error">{fieldError}</p>}
          {status === 'error' && <p className="newsletter-error">{error}</p>}
          {status !== 'success' && !(touched && fieldError) && (
            <p className="newsletter-fineprint">No spam. Reply to any email to unsubscribe.</p>
          )}
        </div>
      </div>
    </section>
  )
}