import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STEPS = [
  { num: 1, title: 'Reach out', desc: "Call, text, or send the form below. Tell us what's going on." },
  { num: 2, title: 'Walk the property', desc: 'We come out, take a look, and give you a written estimate — free, no pressure.' },
  { num: 3, title: 'Get it scheduled', desc: 'You get a real date and a clear scope of work before anything starts.' },
  { num: 4, title: 'Walkthrough & clean finish', desc: 'We review the finished work with you and leave the site tidy.' },
]

const ZONES = [
  {
    id: 'all',
    name: 'All Systems',
    subtitle: 'Unified Building Optimization',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    ),
    badge: '100% Coverage',
    metrics: [
      { label: 'Overall Efficiency', value: '98.4%' },
      { label: 'Unplanned Down-time', value: '-85%' },
      { label: 'Asset Lifespan', value: '+35%' },
      { label: 'Response Target', value: '< 2 hrs' }
    ],
    features: [
      'Comprehensive 360° facility optimization',
      'Unified HVAC, Roofing, Plumbing & Grounds service',
      'Proactive inspection & rapid emergency dispatch',
      'Lower total operating costs and energy overhead'
    ],
    description: 'PrimeFix synchronizes every key structural and mechanical system, turning reactive building repairs into a predictable, optimized property asset.'
  },
  {
    id: 'hvac',
    name: 'HVAC',
    subtitle: 'Climate Control & Air Quality',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    ),
    badge: '99.2% Air Quality',
    metrics: [
      { label: 'Airflow Balancing', value: '+38%' },
      { label: 'Filter Life Monitor', value: 'Active' },
      { label: 'Thermal Waste', value: '-24%' },
      { label: 'RTU Reliability', value: '99.9%' }
    ],
    features: [
      'Smart duct balancing & airflow calibration',
      'Rooftop RTU preventative maintenance & coil cleaning',
      'IoT temperature & humidity sensor integration',
      'Scheduled filter swaps & emergency fan repair'
    ],
    description: 'Continuous tuning for commercial & residential climate systems to cut energy waste, eliminate cold/hot spots, and prevent sudden summer burnouts.'
  },
  {
    id: 'roofing',
    name: 'Roofing',
    subtitle: 'Envelope Seal & Weatherproofing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    badge: '100% Water Tight',
    metrics: [
      { label: 'Thermal Loss Prevention', value: '94%' },
      { label: 'Scupper Flow', value: 'Clear' },
      { label: 'Roof Deck Life', value: '+8 Yrs' },
      { label: 'Leak Defense', value: 'Optimal' }
    ],
    features: [
      'Infrared thermal leak scans & seam inspections',
      'Parapet, flashing, & rubber membrane restoration',
      'High-capacity scupper & internal drain clearing',
      'Reflective protective roof coatings & sealants'
    ],
    description: 'Fortifying your building envelope against harsh storms, thermal loss, and hidden leaks before small drips turn into costly structural repairs.'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    subtitle: 'Hydraulic Flow & Pressure Safety',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
    ),
    badge: 'Balanced Pressure',
    metrics: [
      { label: 'Backflow Safety', value: '100%' },
      { label: 'PSI Target', value: '48 PSI' },
      { label: 'Riser Longevity', value: '+12 Yrs' },
      { label: 'Burst Risk', value: '< 0.01%' }
    ],
    features: [
      'Certified backflow preventer testing & rebuilds',
      'Main pressure regulation & pipe stress relief',
      'Hydro-jetting stack maintenance & grease trap care',
      'Sump pump fail-safe testing & water heater checks'
    ],
    description: 'Maintaining smooth hydraulic balance across main water lines and waste risers to prevent catastrophic bursts, backed-up drains, and pressure dips.'
  },
  {
    id: 'grounds',
    name: 'Grounds',
    subtitle: 'Drainage, Safety & Perimeter',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    badge: 'Zero Hazard Zone',
    metrics: [
      { label: 'Site Drainage Rate', value: '100%' },
      { label: 'Night Visibility', value: '100 FC' },
      { label: 'Walkway Safety', value: 'Passed' },
      { label: 'Foundation Health', value: 'Optimal' }
    ],
    features: [
      'French drain clearing & catch basin silt management',
      'Security lighting & walkway luminaire upkeep',
      'Foundation grading & concrete expansion joint sealing',
      'Seasonal debris clearing & trip hazard mitigation'
    ],
    description: 'Keeping exterior walkways safe, flood-free, and well-lit, protecting your foundation while boosting overall curb appeal.'
  }
]

/* --- MODAL WRAPPER --- */
function BlueprintModal({ isOpen, onClose }) {
  const [activeZone, setActiveZone] = useState('all')
  const currentZoneData = ZONES.find((z) => z.id === activeZone) || ZONES[0]
  const isSelected = (id) => activeZone === 'all' || activeZone === id

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Lock background scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(5, 12, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          backgroundColor: '#0c1822',
          border: '1px solid var(--border, rgba(23, 153, 141, 0.25))',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          overflowY: 'auto',
          padding: '32px'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header inside modal */}
        <div className="blueprint-header" style={{ marginBottom: '24px' }}>
          <div className="blueprint-header-title">
            <span className="kicker" style={{ margin: 0 }}>Interactive Blueprint</span>
            <h3 style={{ fontSize: '1.75rem', color: '#fff', margin: '4px 0' }}>PrimeFix System Optimization Matrix</h3>
            <p style={{ color: 'var(--text-soft, #94a3b8)', margin: 0 }}>
              Select a facility subsystem to view real-time architectural diagnostics and optimization specs.
            </p>
          </div>

          <div className="blueprint-tabs" style={{ marginTop: '16px' }}>
            {ZONES.map((zone) => (
              <button
                key={zone.id}
                className={`blueprint-tab ${activeZone === zone.id ? 'active' : ''}`}
                onClick={() => setActiveZone(zone.id)}
              >
                {zone.icon}
                <span>{zone.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Grid Content */}
        <div className="blueprint-grid-layout">
          {/* Blueprint Canvas */}
          <div className="blueprint-stage">
            <div className="blueprint-hud-bar">
              <span className="blueprint-hud-tag">
                SYS-MAP // {activeZone.toUpperCase()}_VIEW
              </span>
              <div className="blueprint-hud-status">
                <span className="blueprint-pulse-dot" />
                <span>LIVE OPTIMIZATION ACTIVE</span>
              </div>
            </div>

            <svg
              viewBox="0 0 800 520"
              className="blueprint-svg"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <defs>
                <pattern id="bpGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(23, 153, 141, 0.12)" strokeWidth="1" />
                </pattern>

                <linearGradient id="hvacGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#17998D" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
                </linearGradient>

                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="800" height="520" fill="url(#bpGrid)" />
              <circle cx="400" cy="270" r="220" fill="none" stroke="rgba(23, 153, 141, 0.08)" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="400" cy="270" r="140" fill="none" stroke="rgba(23, 153, 141, 0.06)" strokeWidth="1" />

              <g opacity="0.4" fill="#17998D" fontSize="10" fontFamily="monospace">
                <text x="30" y="480">X: 42.8021° N</text>
                <text x="30" y="495">Y: 71.0589° W</text>
                <text x="700" y="495">GRID: ISO-3D</text>
              </g>

              {/* GROUNDS LAYER */}
              <g
                className={`bp-zone-group ${isSelected('grounds') ? 'active' : 'dim'}`}
                onClick={() => setActiveZone('grounds')}
                style={{ cursor: 'pointer' }}
              >
                <polygon
                  points="400,450 720,290 400,150 80,290"
                  fill={isSelected('grounds') ? 'rgba(47, 122, 79, 0.12)' : 'rgba(10, 26, 32, 0.4)'}
                  stroke={isSelected('grounds') ? '#2F7A4F' : 'rgba(231,241,239,0.12)'}
                  strokeWidth={isSelected('grounds') ? '2.5' : '1'}
                  filter={activeZone === 'grounds' ? 'url(#neonGlow)' : 'none'}
                />
                <path
                  d="M 120 310 L 400 450 L 680 310"
                  fill="none"
                  stroke="#6FA77F"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className={isSelected('grounds') ? 'bp-dash-animate' : ''}
                />
                <circle cx="260" cy="380" r="6" fill="#2F7A4F" stroke="#fff" strokeWidth="1.5" />
                <circle cx="540" cy="380" r="6" fill="#2F7A4F" stroke="#fff" strokeWidth="1.5" />
              </g>

              {/* BUILDING STRUCTURE */}
              <polygon points="180,270 400,380 400,210 180,100" fill="rgba(16, 38, 46, 0.85)" stroke="rgba(231,241,239,0.2)" strokeWidth="1" />
              <polygon points="400,380 620,270 620,100 400,210" fill="rgba(10, 26, 32, 0.9)" stroke="rgba(231,241,239,0.2)" strokeWidth="1" />

              {/* PLUMBING LAYER */}
              <g
                className={`bp-zone-group ${isSelected('plumbing') ? 'active' : 'dim'}`}
                onClick={() => setActiveZone('plumbing')}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d="M 400 360 L 400 130"
                  fill="none"
                  stroke={isSelected('plumbing') ? '#17998D' : 'rgba(23,153,141,0.2)'}
                  strokeWidth={isSelected('plumbing') ? '4' : '2'}
                  filter={activeZone === 'plumbing' ? 'url(#neonGlow)' : 'none'}
                />
                <circle cx="400" cy="360" r="8" fill="#128077" stroke="#fff" strokeWidth="2" />
              </g>

              {/* ROOFING LAYER */}
              <g
                className={`bp-zone-group ${isSelected('roofing') ? 'active' : 'dim'}`}
                onClick={() => setActiveZone('roofing')}
                style={{ cursor: 'pointer' }}
              >
                <polygon
                  points="180,100 400,10 620,100 400,190"
                  fill={isSelected('roofing') ? 'rgba(23, 153, 141, 0.25)' : 'rgba(16, 38, 46, 0.7)'}
                  stroke={isSelected('roofing') ? '#17998D' : 'rgba(231,241,239,0.3)'}
                  strokeWidth={isSelected('roofing') ? '3' : '1.5'}
                  filter={activeZone === 'roofing' ? 'url(#neonGlow)' : 'none'}
                />
              </g>

              {/* HVAC LAYER */}
              <g
                className={`bp-zone-group ${isSelected('hvac') ? 'active' : 'dim'}`}
                onClick={() => setActiveZone('hvac')}
                style={{ cursor: 'pointer' }}
              >
                <polygon
                  points="340,75 380,55 410,70 370,90"
                  fill={isSelected('hvac') ? '#17998D' : 'rgba(23, 153, 141, 0.4)'}
                  stroke="#fff"
                  strokeWidth="1.5"
                  filter={activeZone === 'hvac' ? 'url(#neonGlow)' : 'none'}
                />
              </g>

              {/* CALLOUT BADGES */}
              <g transform="translate(470, 45)" onClick={() => setActiveZone('hvac')} style={{ cursor: 'pointer' }}>
                <rect x="0" y="0" width="110" height="26" rx="4" fill="rgba(10,26,32,0.9)" stroke="#17998D" strokeWidth="1" />
                <text x="10" y="17" fill="#2dd4bf" fontSize="11" fontWeight="bold">HVAC // RTU-1</text>
              </g>

              <g transform="translate(110, 50)" onClick={() => setActiveZone('roofing')} style={{ cursor: 'pointer' }}>
                <rect x="0" y="0" width="125" height="26" rx="4" fill="rgba(10,26,32,0.9)" stroke="#17998D" strokeWidth="1" />
                <text x="10" y="17" fill="#2dd4bf" fontSize="11" fontWeight="bold">ROOF // SEAL-MAX</text>
              </g>

              <g transform="translate(480, 290)" onClick={() => setActiveZone('plumbing')} style={{ cursor: 'pointer' }}>
                <rect x="0" y="0" width="130" height="26" rx="4" fill="rgba(10,26,32,0.9)" stroke="#17998D" strokeWidth="1" />
                <text x="10" y="17" fill="#2dd4bf" fontSize="11" fontWeight="bold">PLUMB // RISER-01</text>
              </g>

              <g transform="translate(130, 420)" onClick={() => setActiveZone('grounds')} style={{ cursor: 'pointer' }}>
                <rect x="0" y="0" width="135" height="26" rx="4" fill="rgba(10,26,32,0.9)" stroke="#2F7A4F" strokeWidth="1" />
                <text x="10" y="17" fill="#6FA77F" fontSize="11" fontWeight="bold">GROUNDS // DRAIN</text>
              </g>
            </svg>
          </div>

          {/* Dynamic Telemetry Panel */}
          <div className="blueprint-info-card">
            <div className="blueprint-info-header">
              <div className="blueprint-info-title">
                <div className="blueprint-info-icon">{currentZoneData.icon}</div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                    {currentZoneData.name} Optimization
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--teal-bright, #2dd4bf)', fontWeight: 600 }}>
                    {currentZoneData.subtitle}
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(120deg, var(--teal-bright, #2dd4bf), #2F7A4F)',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                {currentZoneData.badge}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-soft, #94a3b8)', lineHeight: '1.55', margin: '12px 0' }}>
              {currentZoneData.description}
            </p>

            <div className="blueprint-metrics-grid">
              {currentZoneData.metrics.map((m, idx) => (
                <div key={idx} className="blueprint-metric-box">
                  <div className="blueprint-metric-val">{m.value}</div>
                  <div className="blueprint-metric-lbl">{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border, rgba(255,255,255,0.1))', paddingTop: '16px', marginTop: '16px' }}>
              <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-soft, #94a3b8)', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Optimized Deliverables
              </h5>
              <ul className="blueprint-feature-list">
                {currentZoneData.features.map((feat, idx) => (
                  <li key={idx} className="blueprint-feature-item">
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --- MAIN PROCESS COMPONENT --- */
export default function Process() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="process" className="band">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">How it works</span>
          <h2>Four steps, start to finish.</h2>
        </div>

        {/* Core Steps Grid */}
        <div className="process-list">
          {STEPS.map((step) => (
            <div className="process-step" key={step.num}>
              <span className="num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* --- SLEEK INTERACTIVE BLUEPRINT TRIGGER BANNER --- */}
        <div 
          style={{
            marginTop: '48px',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(23, 153, 141, 0.08), rgba(12, 24, 34, 0.95))',
            border: '1px solid var(--border, rgba(23, 153, 141, 0.3))',
            borderRadius: '16px',
            padding: '32px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = 'var(--teal-bright, #2dd4bf)'
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(23, 153, 141, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--border, rgba(23, 153, 141, 0.3))'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)'
          }}
        >
          <div style={{ flex: '1 1 420px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--teal-bright, #2dd4bf)',
                background: 'rgba(23, 153, 141, 0.15)',
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(23, 153, 141, 0.3)'
              }}>
                <span className="blueprint-pulse-dot" style={{ width: '6px', height: '6px' }} />
                System Diagnostic Matrix
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: '4px 0 8px 0', fontWeight: 700 }}>
              Explore the PrimeFix Building Optimization Architecture
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-soft, #94a3b8)', margin: 0, lineHeight: 1.5 }}>
              Click to launch our interactive 3D blueprint matrix covering HVAC, Roofing, Plumbing, and Grounds telemetry.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: '12px 22px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              whiteSpace: 'nowrap',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            <span>Launch Interactive Matrix</span>
          </button>
        </div>

        {/* Maintenance Plan CTA Card */}
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, var(--bg-card, #132231), var(--bg, #0a131c))',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: '16px',
          padding: '32px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '580px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--teal-bright, #2dd4bf)', fontWeight: 700, letterSpacing: '0.05em' }}>
              Looking for long-term peace of mind?
            </span>
            <h3 style={{ fontSize: '1.35rem', marginTop: '6px', marginBottom: '8px', color: '#fff' }}>
              Explore our Seasonal Property Maintenance Plans
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-soft, #94a3b8)', margin: 0, lineHeight: 1.5 }}>
              Never worry about seasonal gutter clearings, winterization, or sudden upkeep again. Build a custom maintenance schedule tailored to your property.
            </p>
          </div>
          <Link
            to="/maintenance-plans"
            className="btn btn-secondary"
            style={{
              padding: '12px 22px',
              fontWeight: 700,
              fontSize: '0.9rem',
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

      {/* RENDER MODAL OVERLAY */}
      <BlueprintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}