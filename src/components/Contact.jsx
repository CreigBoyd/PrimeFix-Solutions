import { useState } from 'react'
import { isValidEmail, isValidPhone } from '../utils/validation'
import { SITE, telHref, mailHref } from '../config/site'
import { postJSON } from '../utils/api'
import { TIME_SLOTS, localDateValue, validateBooking } from '../utils/booking'

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

  // Zip Code Checker state
  const [zipInput, setZipInput] = useState('')
  const [zipStatus, setZipStatus] = useState(null) // 'success' | 'out-of-area' | null

  // Booking Modal State
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1) // 1: Type & Date/Time, 2: Details & Confirm
  const [consultType, setConsultType] = useState('On-site Quote')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingName, setBookingName] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingAddress, setBookingAddress] = useState('')
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const handleZipCheck = (e) => {
    e.preventDefault()
    const cleaned = zipInput.trim()
    if (!cleaned) return

    if (cleaned.startsWith('019') || cleaned.startsWith('018') || ['01913', '01950', '01984', '01830', '01832', '01833', '01922', '01938'].includes(cleaned)) {
      setZipStatus('success')
    } else {
      setZipStatus('out-of-area')
    }
  }

  const validateField = (name, value) => {
    const validator = FIELD_VALIDATORS[name]
    return validator ? validator(value) : ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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

    // Honeypot check
    if (form.company) {
      setStatus('success')
      setForm(INITIAL_FORM)
      return
    }

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
      await postJSON('send-mail.php', form)

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

  // Booking handlers
  const handleBookingNext = (e) => {
    e.preventDefault()
    const problem = validateBooking(selectedDate, selectedSlot)
    if (problem) {
      setBookingError(problem)
      return
    }
    setBookingError('')
    setBookingStep(2)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!bookingName.trim() || !isValidPhone(bookingPhone)) {
      setBookingError('Please provide your name and a valid phone number.')
      return
    }

    setBookingSubmitting(true)
    setBookingError('')

    try {
      const messageContent = [
        `Requested Consultation Slot: ${consultType}`,
        `Date: ${selectedDate}`,
        `Time Window: ${selectedSlot}`,
        bookingAddress ? `Property Address: ${bookingAddress}` : null
      ].filter(Boolean).join('\n')

      await postJSON('send-mail.php', {
        name: bookingName,
        phone: bookingPhone,
        service: `Consultation request (${consultType})`,
        message: messageContent,
      })

      setBookingSubmitted(true)
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setBookingSubmitting(false)
    }
  }

  const resetBookingModal = () => {
    setBookingOpen(false)
    setBookingStep(1)
    setSelectedDate('')
    setSelectedSlot('')
    setBookingName('')
    setBookingPhone('')
    setBookingAddress('')
    setBookingSubmitted(false)
    setBookingError('')
  }

  // Tomorrow date for min selector
  const minDateStr = localDateValue(1)

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
              <div><span className="label">Call or text</span><a href={telHref}>{SITE.phoneDisplay}</a></div>
            </div>
            <div className="contact-row">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 6l8 7 8-7" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div><span className="label">Email</span><a href={mailHref}>{SITE.email}</a></div>
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

            {/* Live Booking CTA Trigger Box */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, var(--teal, #128077), var(--teal-deep, #0e5a54))',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(18,128,119,0.25)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Schedule Consultation Slot
              </button>
            </div>
          </div>

          <form className={`estimate${shake ? ' shake' : ''}`} onSubmit={handleSubmit} noValidate>
            
            {/* Service Area Zip Code Checker Widget */}
            <div style={{ background: 'var(--bg, rgba(255,255,255,0.02))', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 18px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Want to check if we service your neighborhood first?
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter 5-digit zip"
                  maxLength={5}
                  value={zipInput}
                  onChange={(e) => {
                    setZipInput(e.target.value)
                    if (zipStatus) setZipStatus(null)
                  }}
                  style={{ flex: 1, padding: '10px 12px', background: 'var(--bg-card, #132231)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleZipCheck}
                  className="btn"
                  style={{ padding: '10px 16px', fontSize: '0.85rem', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Check Zip
                </button>
              </div>

              {zipStatus === 'success' && (
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--teal-bright, #2dd4bf)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Good news! You're in our service area. Feel free to request your estimate below.
                </div>
              )}

              {zipStatus === 'out-of-area' && (
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#f87171', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  We may still travel to your location depending on the project. Give us a call!
                </div>
              )}
            </div>

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

      {/* Booking Modal Overlay */}
      {bookingOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 19, 28, 0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '16px'
        }} onClick={resetBookingModal}>

          <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={resetBookingModal} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-soft)', fontSize: '1.25rem', cursor: 'pointer' }}
              aria-label="Close booking modal"
            >
              &times;
            </button>

            {!bookingSubmitted ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{bookingStep === 1 ? 'Schedule a Consultation' : 'Where should we meet or call?'}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>{bookingStep === 1 ? 'Pick your preferred meeting type, date, and 1-hour window.' : 'Provide your contact details to lock in your appointment.'}</p>
                </div>

                {bookingStep === 1 ? (
                  <form onSubmit={handleBookingNext}>
                    <div className="type-selector">
                      <button
                        type="button"
                        className={`type-option ${consultType === 'On-site Quote' ? 'active' : ''}`}
                        onClick={() => setConsultType('On-site Quote')}
                      >
                        🏠 On-site Quote
                      </button>
                      <button
                        type="button"
                        className={`type-option ${consultType === 'Phone Call' ? 'active' : ''}`}
                        onClick={() => setConsultType('Phone Call')}
                      >
                        📞 Phone Call
                      </button>
                    </div>

                    <div className="booking-form-group">
                      <label>Select Date</label>
                      <input
                        type="date"
                        min={minDateStr}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="booking-input"
                        required
                      />
                    </div>

                    <div className="booking-form-group">
                      <label>Select 1-Hour Time Window</label>
                      <div className="slots-grid">
                        {TIME_SLOTS.map(({ label }) => (
                          <button
                            type="button"
                            key={label}
                            className={`slot-btn ${selectedSlot === label ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(label)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {bookingError && (
                      <p role="alert" style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '12px' }}>{bookingError}</p>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontWeight: 700, cursor: 'pointer' }}>
                      Continue to Details
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleBookingSubmit}>
                    <div className="booking-form-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="booking-input"
                        required
                      />
                    </div>

                    <div className="booking-form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="booking-input"
                        required
                      />
                    </div>

                    {consultType === 'On-site Quote' && (
                      <div className="booking-form-group">
                        <label>Property Address</label>
                        <input
                          type="text"
                          placeholder="123 Main St, City, State"
                          value={bookingAddress}
                          onChange={(e) => setBookingAddress(e.target.value)}
                          className="booking-input"
                          required
                        />
                      </div>
                    )}

                    <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', color: 'var(--text-soft)' }}>
                      🗓️ <strong>{consultType}</strong> on <span style={{ color: '#fff' }}>{selectedDate}</span> ({selectedSlot})
                    </div>

                    {bookingError && (
                      <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '16px' }}>{bookingError}</p>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="button" onClick={() => setBookingStep(1)} className="btn" style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', borderRadius: '8px' }}>
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={bookingSubmitting}
                        style={{ flex: 2, padding: '12px', fontWeight: 700, cursor: bookingSubmitting ? 'not-allowed' : 'pointer', opacity: bookingSubmitting ? 0.7 : 1 }}
                      >
                        {bookingSubmitting ? 'Booking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--teal-bright, #2dd4bf)', marginBottom: '12px' }}>Request Received! 🎉</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-soft)', lineHeight: 1.5, marginBottom: '24px' }}>
                  We've received your request for <strong>{selectedDate}</strong> between <strong>{selectedSlot}</strong>. We'll call or text <strong>{bookingPhone}</strong> to confirm your appointment.
                </p>
                <button type="button" onClick={resetBookingModal} className="btn btn-primary" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}