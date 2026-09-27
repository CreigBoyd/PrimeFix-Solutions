import { useState } from 'react'

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:30 AM – 11:30 AM',
  '1:00 PM – 2:00 PM',
  '2:30 PM – 3:30 PM',
  '4:00 PM – 5:00 PM',
]

export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1) // 1: Type & Date/Time, 2: Details & Confirm
  const [consultType, setConsultType] = useState('On-site Quote')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleNext = (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) {
      alert('Please choose a date and time slot.')
      return
    }
    setStep(2)
  }

  const handleFinalSubmit = (e) => {
    e.preventDefault()
    if (!name || !phone) {
      alert('Please provide your name and phone number.')
      return
    }
    setSubmitted(true)
  }

  const resetAndClose = () => {
    setStep(1)
    setSelectedDate('')
    setSelectedSlot('')
    setName('')
    setPhone('')
    setAddress('')
    setSubmitted(false)
    onClose()
  }

  // Get tomorrow's date as min value for date picker
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDateStr = tomorrow.toISOString().split('T')[0]

  return (
    <div className="booking-modal-overlay" onClick={resetAndClose}>
      <style>{`
        .booking-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 19, 28, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
        }
        .booking-modal-card {
          background: var(--bg-card, #132231);
          border: 1px solid var(--border, #20364d);
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          padding: 32px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          position: relative;
          color: var(--text, #fff);
          animation: modalScaleIn 0.25s ease forwards;
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .booking-close-btn {
          position: absolute;
          top: 20px; right: 20px;
          background: none; border: none;
          color: var(--text-soft, #94a3b8);
          font-size: 1.25rem; cursor: pointer;
        }
        .booking-close-btn:hover { color: #fff; }
        .booking-header h3 { font-size: 1.4rem; margin-bottom: 6px; }
        .booking-header p { font-size: 0.9rem; color: var(--text-soft, #94a3b8); margin-bottom: 24px; }
        
        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        .type-option {
          padding: 12px;
          background: var(--bg, #0a131c);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }
        .type-option.active {
          border-color: var(--teal, #128077);
          background: rgba(18, 128, 119, 0.15);
          color: var(--teal-bright, #2dd4bf);
        }
        .booking-form-group {
          margin-bottom: 16px;
        }
        .booking-form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .booking-input, .booking-select {
          width: 100%;
          padding: 12px;
          background: var(--bg, #0a131c);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-size: 0.95rem;
          outline: none;
        }
        .booking-input:focus, .booking-select:focus {
          border-color: var(--teal, #128077);
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }
        .slot-btn {
          padding: 10px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-soft);
          font-size: 0.82rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.15s;
        }
        .slot-btn.selected {
          background: var(--teal);
          color: #fff;
          border-color: var(--teal);
          font-weight: 600;
        }
        .success-state {
          text-align: center;
          padding: 24px 0;
        }
        .success-state h4 { font-size: 1.5rem; color: var(--teal-bright, #2dd4bf); margin-bottom: 12px; }
        .success-state p { font-size: 0.950rem; color: var(--text-soft); line-height: 1.5; margin-bottom: 24px; }
      `}</style>

      <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close-btn" onClick={resetAndClose} aria-label="Close modal">&times;</button>

        {!submitted ? (
          <div>
            <div className="booking-header">
              <h3>{step === 1 ? 'Schedule a Consultation' : 'Where should we meet or call?'}</h3>
              <p>{step === 1 ? 'Pick your preferred meeting type, date, and 1-hour window.' : 'Provide your contact details to lock in your appointment.'}</p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNext}>
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
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  Continue to Details
                </button>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit}>
                <div className="booking-form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="booking-input"
                    required
                  />
                </div>

                <div className="booking-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="booking-input"
                      required
                    />
                  </div>
                )}

                <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', color: 'var(--text-soft)' }}>
                  🗓️ <strong>{consultType}</strong> on <span style={{ color: '#fff' }}>{selectedDate}</span> ({selectedSlot})
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn" style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', borderRadius: '8px' }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="success-state">
            <h4>You're Booked! 🎉</h4>
            <p>We've reserved your slot for <strong>{selectedDate}</strong> between <strong>{selectedSlot}</strong>. We'll send a confirmation text/call to <strong>{phone}</strong> shortly.</p>
            <button type="button" onClick={resetAndClose} className="btn btn-primary" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}