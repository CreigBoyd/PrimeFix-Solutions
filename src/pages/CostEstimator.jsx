import { useState } from 'react'

const ESTIMATE_CONFIGS = {
  'Carpentry & Decks': {
    base: 2500,
    unitName: 'Approx. Square Footage',
    min: 100,
    max: 800,
    step: 50,
    defaultVal: 300,
    costPerUnit: 35, // per sq ft
    desc: 'Estimated for standard wood/composite material and labor.'
  },
  'Roofing & Shingles': {
    base: 4000,
    unitName: 'Approx. Home Footprint (Sq Ft)',
    min: 1000,
    max: 3500,
    step: 100,
    defaultVal: 1800,
    costPerUnit: 4.5, // per sq ft
    desc: 'Estimated for full tear-off and architectural shingle replacement.'
  },
  'Interior Painting': {
    base: 800,
    unitName: 'Number of Rooms',
    min: 1,
    max: 10,
    step: 1,
    defaultVal: 3,
    costPerUnit: 350, // per room
    desc: 'Includes walls, baseboards, and standard prep work.'
  },
  'Handyman & Repairs': {
    base: 250,
    unitName: 'Estimated Hours of Work',
    min: 2,
    max: 16,
    step: 2,
    defaultVal: 4,
    costPerUnit: 95, // per hour
    desc: 'General household repairs, fixtures, and touch-ups.'
  }
}

export default function CostEstimator() {
  const [selectedService, setSelectedService] = useState('Carpentry & Decks')
  const [quantity, setQuantity] = useState(ESTIMATE_CONFIGS['Carpentry & Decks'].defaultVal)
  const [submitted, setSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' })

  const config = ESTIMATE_CONFIGS[selectedService]

  // Handle service switch to reset slider to safe defaults
  const handleServiceChange = (serviceName) => {
    setSelectedService(serviceName)
    setQuantity(ESTIMATE_CONFIGS[serviceName].defaultVal)
  }

  // Calculate rough estimate range (-10% to +15%)
  const calculatedBase = config.base + (quantity * config.costPerUnit)
  const lowEnd = Math.round(calculatedBase * 0.9)
  const highEnd = Math.round(calculatedBase * 1.15)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!contactInfo.name || !contactInfo.phone) {
      alert('Please enter your name and phone number so we can verify your estimate.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px', minHeight: '80vh', color: 'var(--text, #fff)' }}>
      <div className="wrap" style={{ maxWidth: '850px' }}>
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="kicker">Instant Project Estimator</span>
          <h2>Get an instant ballpark estimate.</h2>
          <p>Select your project type and size below to see estimated pricing instantly. No waiting around.</p>
        </div>

        {!submitted ? (
          <div style={{ background: 'var(--bg-card, #132231)', border: '1px solid var(--border, #20364d)', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            
            {/* Step 1: Choose Service */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', color: 'var(--teal-bright, #2dd4bf)', letterSpacing: '0.05em' }}>
                1. Select Project Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {Object.keys(ESTIMATE_CONFIGS).map((key) => {
                  const active = selectedService === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleServiceChange(key)}
                      style={{
                        padding: '14px 16px',
                        background: active ? 'var(--teal)' : 'var(--bg, #0a131c)',
                        border: `1px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
                        borderRadius: '10px',
                        color: active ? '#fff' : 'var(--text-soft)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {key}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Slider or Quantity Selector */}
            <div style={{ marginBottom: '40px', background: 'var(--bg, #0a131c)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  2. {config.unitName}
                </label>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal-bright)' }}>
                  {quantity} {selectedService === 'Interior Painting' ? 'rooms' : selectedService === 'Handyman & Repairs' ? 'hrs' : 'sq ft'}
                </span>
              </div>
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer', marginBottom: '8px' }}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0 }}>{config.desc}</p>
            </div>

            {/* Live Price Box */}
            <div style={{ background: 'linear-gradient(135deg, rgba(18,128,119,0.15), rgba(14,90,84,0.3))', border: '2px solid var(--teal)', borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal-bright)', fontWeight: 700 }}>Estimated Investment Range</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                ${lowEnd.toLocaleString()} –${highEnd.toLocaleString()}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-soft)', maxWidth: '500px', margin: '0 auto' }}>
                *This is an automated ballpark estimate based on standard averages. Final on-site quotes are always 100% free and customized to your specific property.
              </p>
            </div>

            {/* Step 3: Lead Capture to Lock In */}
            <form onSubmit={handleSubmit} style={{ borderTop: '1px solid var(--border)', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Want to lock in this estimate or schedule an on-site walkthrough?</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}
              >
                Send Me This Estimate &amp; Schedule Free Quote
              </button>
            </form>

          </div>
        ) : (
          <div style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '48px', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--teal-bright)', marginBottom: '16px' }}>Estimate Saved! 🎉</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
              Thanks <strong>{contactInfo.name}</strong>! We've recorded your estimate for <strong>{selectedService}</strong> (${lowEnd.toLocaleString()} –${highEnd.toLocaleString()}). We will reach out to <strong>{contactInfo.phone}</strong> shortly to confirm a time for our free on-site walkthrough.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="btn btn-primary"
              style={{ padding: '12px 24px', cursor: 'pointer' }}
            >
              Calculate Another Project
            </button>
          </div>
        )}
      </div>
    </div>
  )
}