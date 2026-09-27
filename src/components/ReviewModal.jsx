import { useEffect, useState } from 'react'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StarRating from './StarRating'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isExiting) triggerClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isExiting])

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
      const res = await fetch(`${API_BASE}/submit-review.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong submitting that. Please try again.')
      }

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
      <style>{`
        @keyframes reviewModalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes reviewModalFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes reviewModalSwingIn {
          0% { transform: perspective(1200px) rotateY(-24deg) rotateX(14deg) translateZ(-100px) scale(0.85); opacity: 0; }
          100% { transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0) scale(1); opacity: 1; }
        }
        @keyframes reviewModalSlideOut {
          0% { transform: perspective(1200px) translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: perspective(1200px) translateY(80vh) rotate(6deg) scale(0.92); opacity: 0; }
        }

        .review-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(14, 42, 56, 0.78);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex; justify-content: center; align-items: center;
          padding: 20px;
          perspective: 1400px;
        }
        .review-modal-overlay.open { animation: reviewModalFadeIn 0.4s ease forwards; }
        .review-modal-overlay.exiting { animation: reviewModalFadeOut 0.45s ease forwards; pointer-events: none; }

        .review-modal-card {
          width: 100%; max-width: 520px;
          max-height: 88vh;
          overflow-y: auto;
          background: var(--bg-card, #fff);
          border: 1px solid var(--border, rgba(14,42,56,0.1));
          border-radius: 14px;
          padding: 32px;
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.35);
        }
        .review-modal-overlay.open .review-modal-card { animation: reviewModalSwingIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards; }
        .review-modal-overlay.exiting .review-modal-card { animation: reviewModalSlideOut 0.45s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }

        .review-modal-close {
          position: absolute; top: 14px; right: 14px;
          background: var(--bg, rgba(0,0,0,0.05));
          border: none; color: var(--text-soft, #4A6572);
          cursor: pointer; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: all 0.2s ease;
        }
        .review-modal-close:hover { color: var(--text, #0E2A38); background: rgba(0,0,0,0.1); transform: scale(1.08); }

        .review-modal-card h3 { margin: 0 0 4px; color: var(--text, #0E2A38); font-family: 'Newsreader', serif; font-size: 1.5rem; font-weight: 600; }
        .review-modal-card p.review-modal-sub { margin: 0 0 22px; color: var(--text-soft, #4A6572); font-size: 0.92rem; }

        .review-modal-form { display: flex; flex-direction: column; gap: 16px; }

        .review-modal-success {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 10px; padding: 20px 8px 6px;
        }
        .review-modal-success svg { width: 40px; height: 40px; color: var(--teal-bright, #17998D); }
        .review-modal-success h3 { font-size: 1.3rem; }
      `}</style>

      <div
        className={`review-modal-overlay ${isOpen && !isExiting ? 'open' : ''} ${isExiting ? 'exiting' : ''}`}
        onClick={triggerClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
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
