// src/components/Services.jsx
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import ServiceModal from './ServiceModal'

const SERVICES = [
  {
    title: 'Carpentry',
    badge: 'Top Rated',
    desc: 'Framing, trim, and deck work built to outlast the warranty on the materials.',
    items: ['Decks & porches', 'Trim & finish carpentry', 'Framing repairs', 'Rot & structural repair'],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  {
    title: 'Roofing',
    badge: 'Emergency Service',
    desc: 'From one missing shingle to a full tear-off — keeping the roof doing its job.',
    items: ['Shingle repair & replacement', 'Flashing & leak repair', 'Gutter installation', 'Storm damage assessment'],
    imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'Yard & grounds',
    badge: 'Seasonal Care',
    desc: 'Regular mowing and seasonal cleanups that keep a property looking cared for.',
    items: ['Mowing & trimming', 'Spring & fall cleanup', 'Mulching & bed work', 'Brush & branch clearing'],
    imageUrl: 'https://images.unsplash.com/photo-1686663048931-6df69f577a2f?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: 'Handyman & repairs',
    badge: 'Same-Day Repairs',
    desc: 'The punch list that never gets shorter — we knock it out in one visit.',
    items: ['Drywall & interior repair', 'Doors, locks & hardware', 'Fixture installs', 'General repairs'],
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    title: 'Painting & finishing',
    badge: 'Popular',
    desc: 'Interior and exterior painting that protects the surface as much as it looks good.',
    items: ['Interior painting', 'Exterior painting & staining', 'Deck sealing', 'Trim & touch-up work'],
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: 'Seasonal upkeep',
    badge: 'Preventative Plan',
    desc: 'Standing appointments that catch small problems before they become big ones.',
    items: ['Gutter cleaning', 'Winterizing', 'Spring turnover', 'Snow-load roof checks'],
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
]

export default function Services() {
  const [activeService, setActiveService] = useState(null)
  const lastClosedAt = useRef(0)

  const handleCardClick = (e, service) => {
    if (e && e.stopPropagation) e.stopPropagation()

    // Block opening if already open or closed less than 400ms ago (swallows click bleed-through)
    if (activeService || Date.now() - lastClosedAt.current < 400) {
      return
    }

    setActiveService(service)
  }

  const handleClose = () => {
    lastClosedAt.current = Date.now()
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setActiveService(null)
  }

  return (
    <section id="services">

      <div className="wrap">
        <div className="section-head">
          <span className="kicker">What we do</span>
          <h2>Six trades. One crew you only call once.</h2>
          <p>From a leaking roof to an overgrown yard, we cover the full range of building and property maintenance — everything a property needs, in one place.</p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <div 
              className="service-card service-card-interactive" 
              key={service.title}
              onClick={(e) => handleCardClick(e, service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCardClick(e, service)
                }
              }}
            >
              <div className="service-card-image-wrap">
                <img 
                  src={service.imageUrl} 
                  alt={`PrimeFix Solutions ${service.title} service`} 
                  loading="lazy" 
                  decoding="async"
                  width="800"
                  height="533"
                />
              </div>
              <div className="service-card-content">
                <div className="icon-badge">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <span className="service-card-action">
                  View service details 
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="services-text-link-bar">
          <Link to="/services-explorer" className="services-text-link">
            <span>Explore all handyman tasks &amp; custom estimate builder</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <ServiceModal 
        service={activeService} 
        isOpen={Boolean(activeService)} 
        onClose={handleClose} 
      />
    </section>
  )
}