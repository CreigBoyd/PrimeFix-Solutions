import { useState } from 'react'

const TIERS = [
  {
    name: 'Essential Care',
    price: 49,
    period: 'month',
    desc: 'Core seasonal upkeep to protect your home from sudden weather or neglect.',
    features: [
      'Semi-annual general home inspection',
      'Spring gutter clearing & flushing',
      'Fall winterization checkup',
      'Priority scheduling for repairs',
      '10% off all standard labor rates'
    ]
  },
  {
    name: 'Complete Protection',
    price: 99,
    period: 'month',
    popular: true,
    desc: 'Our most popular comprehensive package for complete peace of mind year-round.',
    features: [
      'Bi-monthly (every 2 months) home checkups',
      'Spring & Fall gutter cleanings',
      'Full winterization & draft sealing',
      'HVAC filter replacements provided',
      'Emergency storm-damage priority',
      '15% off all labor & free minor fixes'
    ]
  },
  {
    name: 'Estate / Commercial',
    price: 189,
    period: 'month',
    desc: 'Tailored high-frequency care for large properties, multi-units, or busy owners.',
    features: [
      'Monthly comprehensive walkthroughs',
      'Unlimited seasonal gutter servicing',
      'Full seasonal grounds & yard upkeep checks',
      'Priority 24/7 emergency dispatch',
      'Zero trip charges on any service',
      'Dedicated account manager'
    ]
  }
]

const ADDONS = [
  { id: 'hvac', name: 'HVAC Tune-up Package', price: 15 },
  { id: 'pest', name: 'Quarterly Pest Shield Inspection', price: 20 },
  { id: 'dryer', name: 'Annual Dryer Vent Deep Clean', price: 10 }
]

export default function MaintenancePlans() {
  const [selectedTier, setSelectedTier] = useState(TIERS[1])
  const [selectedAddons, setSelectedAddons] = useState([])
  const [frequency, setFrequency] = useState('monthly') // monthly | annual (15% discount)
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', email: '', address: '' })

  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id))
    } else {
      setSelectedAddons([...selectedAddons, addon])
    }
  }

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const rawBase = selectedTier.price + addonsTotal
  const finalPrice = frequency === 'annual' ? Math.round(rawBase * 0.85) : rawBase

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!clientInfo.name || !clientInfo.phone || !clientInfo.address) {
      alert('Please fill out all contact details to activate your plan.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('form_type', 'Maintenance Plan Activation')
      formData.append('tier', selectedTier.name)
      formData.append('frequency', frequency)
      formData.append('monthlyPrice', `$${finalPrice} / ${frequency === 'annual' ? 'mo (billed annually)' : 'month'}`)
      formData.append('addons', selectedAddons.map(a => a.name).join(', ') || 'None')
      formData.append('name', clientInfo.name)
      formData.append('phone', clientInfo.phone)
      formData.append('email', clientInfo.email || '')
      formData.append('address', clientInfo.address)

      await fetch('send-mail.php', {
        method: 'POST',
        body: formData
      })
      setSubscribed(true)
    } catch (err) {
      console.error(err)
      setSubscribed(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px', minHeight: '80vh', color: 'var(--text, #fff)' }}>
      <div className="wrap">
        <div className="section-head" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <span className="kicker">Property Maintenance Membership</span>
          <h2>Preventative care, custom-built for your home.</h2>
          <p>Lock in priority service, routine checkups, and exclusive labor discounts. Pick a core tier and customize your coverage below.</p>
        </div>

        {!subscribed ? (
          <>
            {/* Billing Frequency Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
              <div style={{ background: 'var(--bg-card, #132231)', border: '1px solid var(--border)', borderRadius: '30px', padding: '4px', display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  style={{ padding: '8px 20px', borderRadius: '24px', border: 'none', background: frequency === 'monthly' ? 'var(--teal)' : 'transparent', color: frequency === 'monthly' ? '#fff' : 'var(--text-soft)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('annual')}
                  style={{ padding: '8px 20px', borderRadius: '24px', border: 'none', background: frequency === 'annual' ? 'var(--teal)' : 'transparent', color: frequency === 'annual' ? '#fff' : 'var(--text-soft)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Annual Billing <span style={{ fontSize: '0.75rem', background: '#2dd4bf', color: '#0a131c', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px', fontWeight: 700 }}>Save 15%</span>
                </button>
              </div>
            </div>

            {/* Tiers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
              {TIERS.map((tier) => {
                const isSelected = selectedTier.name === tier.name
                return (
                  <div
                    key={tier.name}
                    onClick={() => setSelectedTier(tier)}
                    style={{
                      background: 'var(--bg-card, #132231)',
                      border: `2px solid ${isSelected ? 'var(--teal, #128077)' : 'var(--border, #20364d)'}`,
                      borderRadius: '16px',
                      padding: '32px',
                      position: 'relative',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 10px 30px rgba(18,128,119,0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tier.popular && (
                      <span style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--teal)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
                        Most Popular
                      </span>
                    )}
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{tier.name}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', minHeight: '40px', marginBottom: '20px' }}>{tier.desc}</p>
                    
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--teal-bright, #2dd4bf)', marginBottom: '24px' }}>
                      ${frequency === 'annual' ? Math.round(tier.price * 0.85) : tier.price}
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: 400 }}> / {frequency === 'annual' ? 'mo (billed annually)' : 'month'}</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tier.features.map((feat, idx) => (
                        <li key={idx} style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: isSelected ? 'none' : '1px solid var(--border)',
                        background: isSelected ? 'var(--teal)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--text)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isSelected ? 'Selected Plan' : 'Choose Plan'}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Custom Add-ons Section */}
            <div style={{ background: 'var(--bg-card, #132231)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Customize with Add-on Protection</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', marginBottom: '20px' }}>Enhance your chosen core tier with specialized routine services.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ADDONS.map((addon) => {
                  const checked = selectedAddons.find(a => a.id === addon.id)
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 18px', background: 'var(--bg, #0a131c)', border: `1px solid ${checked ? 'var(--teal)' : 'var(--border)'}`,
                        borderRadius: '10px', cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem', fontWeight: 600 }}>
                        <input type="checkbox" checked={Boolean(checked)} onChange={() => {}} style={{ width: '18px', height: '18px', accentColor: 'var(--teal)' }} />
                        {addon.name}
                      </div>
                      <span style={{ color: 'var(--teal-bright)', fontWeight: 700 }}>+${addon.price}/mo</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary & Sign Up Form Box */}
            <div style={{ background: 'linear-gradient(135deg, rgba(18,128,119,0.1), rgba(14,90,84,0.2))', border: '1px solid var(--teal)', borderRadius: '16px', padding: '36px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--teal-bright)', fontWeight: 700 }}>Summary</span>
                  <h3 style={{ fontSize: '1.4rem', marginTop: '4px' }}>{selectedTier.name} {selectedAddons.length > 0 && `+ ${selectedAddons.length} add-on(s)`}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>${finalPrice} <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: 400 }}>/ {frequency === 'annual' ? 'mo billed annually' : 'month'}</span></div>
                </div>
              </div>

              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Your Name *</label>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      style={{ width: '100%', padding: '12px', background: 'var(--bg, #0a131c)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px', background: 'var(--bg, #0a131c)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      style={{ width: '100%', padding: '12px', background: 'var(--bg, #0a131c)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Property Address *</label>
                  <input
                    type="text"
                    placeholder="123 Oak St, City, State"
                    value={clientInfo.address}
                    onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg, #0a131c)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '14px', fontWeight: 700, fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, marginTop: '10px' }}
                >
                  {submitting ? 'Activating Plan...' : 'Activate Maintenance Plan'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '48px', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--teal-bright)', marginBottom: '16px' }}>Welcome to Regular Care! 🎉</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you, <strong>{clientInfo.name}</strong>. Your membership request for <strong>{selectedTier.name}</strong> has been registered. We will call you at <strong>{clientInfo.phone}</strong> to coordinate your initial property walkthrough at {clientInfo.address}.
            </p>
            <button type="button" onClick={() => setSubscribed(false)} className="btn btn-primary" style={{ padding: '12px 24px', cursor: 'pointer' }}>
              Configure Another Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}