import { useEffect, useRef, useState } from 'react'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StarRating from './StarRating'
import { postJSON } from '../utils/api'

const SERVICE_OPTIONS = [
  'Carpentry',
  'Roofing',
  'Yard & grounds',
  'Handyman & repairs',
  'Painting & finishing',
  'Seasonal upkeep',
  'Other',
]

const INITIAL_FORM = {
  name: '',
  service: SERVICE_OPTIONS[0],
  rating: 0,
  quote: '',
  company: '', // honeypot
}

export default function ReviewModal({ isOpen, onClose }) {
  const [isExiting, setIsExiting] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [touched, setTouched] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [shake, setShake] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const triggerClose = () => {
    if (isExiting) return
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose?.()
      // Reset for next time it's opened, once the exit animation finishes.
      setForm(INITIAL_FORM)
      setTouched({})
      setFieldErrors({})
      setStatus('idle')
    }, 480)
  }

  // Always call the latest triggerClose from the keydown handler without re-subscribing.
  const closeRef = useRef(triggerClose)
  closeRef.current = triggerClose
  const cardRef = useRef(null)
  const returnFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return undefined
    }

    returnFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    // Move focus into the dialog.
    const focusables = () =>
      cardRef.current
        ? [...cardRef.current.querySelectorAll('button, [href], input:not(.hp-field), select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled)
        : []
    focusables()[0]?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      returnFocusRef.current?.focus?.()
    }
  }, [isOpen])

  if (!isOpen && !isExiting) return null

  const validators = {
    name: (v) => (v.trim() ? '' : 'Please enter your name.'),
    rating: (v) => (v > 0 ? '' : 'Pick a star rating.'),
    quote: (v) => (v.trim().length >= 10 ? '' : 'A few more words would help other readers.'),
  }

  const validateField = (name, value) => validators[name]?.(value) ?? ''

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const setRating = (n) => {
    setForm((prev) => ({ ...prev, rating: n }))
    setTouched((prev) => ({ ...prev, rating: true }))
    setFieldErrors((prev) => ({ ...prev, rating: validateField('rating', n) }))
  }

  const triggerShake = () => {
    setShake(true)
    window.setTimeout(() => setShake(false), 450)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = {}
    Object.keys(validators).forEach((name) => {
      const message = validateField(name, form[name])
      if (message) errors[name] = message
    })
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setTouched({ name: true, rating: true, quote: true })
      triggerShake()
      return
    }

    setStatus('loading')
    setError('')

    try {
      await postJSON('submit-review.php', form)

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const fieldStateClass = (name) => {
    if (touched[name] && fieldErrors[name]) return 'field invalid'
    if (name === 'rating') {
      if (touched.rating && form.rating > 0) return 'field valid'
      return 'field'
    }
    if (touched[name] && form[name].trim()) return 'field valid'
    return 'field'
  }

  return (
    <>

      <div
        className={`review-modal-overlay ${isOpen && !isExiting ? 'open' : ''} ${isExiting ? 'exiting' : ''}`}
        onClick={triggerClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <div className="review-modal-card" ref={cardRef} onClick={(e) => e.stopPropagation()}>
          <button className="review-modal-close" onClick={triggerClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {status === 'success' ? (
            <div className="review-modal-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <h3>Thanks for the review!</h3>
              <p className="review-modal-sub">
                It's been sent off for a quick check before it goes live — usually within a day or two.
              </p>
            </div>
          ) : (
            <>
              <h3 id="review-modal-title">Leave a review</h3>
              <p className="review-modal-sub">Tell us how it went — it helps other homeowners, and it helps us too.</p>

              <form className={`review-modal-form${shake ? ' shake' : ''}`} onSubmit={handleSubmit} noValidate>
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

                <div className={fieldStateClass('name')}>
                  <label htmlFor="review-name">Name</label>
                  <div className="field-control">
                    <input
                      id="review-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.name && fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                </div>

                <div className="field">
                  <label htmlFor="review-service">Which service?</label>
                  <select id="review-service" name="service" value={form.service} onChange={handleChange}>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className={fieldStateClass('rating')}>
                  <label>Rating</label>
                  <StarRating value={form.rating} onChange={setRating} interactive size={24} />
                  {touched.rating && fieldErrors.rating && <span className="field-error">{fieldErrors.rating}</span>}
                </div>

                <div className={fieldStateClass('quote')}>
                  <label htmlFor="review-quote">Your review</label>
                  <textarea
                    id="review-quote"
                    name="quote"
                    placeholder="What did we help with, and how'd it go?"
                    value={form.quote}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.quote && fieldErrors.quote && <span className="field-error">{fieldErrors.quote}</span>}
                </div>

                {status === 'error' && <p className="form-error">{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending…' : (
                    <>
                      Submit review <FontAwesomeIcon icon={faPaperPlane} style={{ marginLeft: 6 }} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}
