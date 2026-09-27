import React, { useState } from 'react'
import ServiceModal from './ServiceModal'

const SERVICES = [
  {
    title: 'Carpentry',
    badge: 'Top Rated',
    desc: 'Framing, trim, and deck work built to outlast the warranty on the materials.',
    items: ['Decks & porches', 'Trim & finish carpentry', 'Framing repairs', 'Rot & structural repair'],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l6-6m0 0l7-7a2 2 0 000-3 2 2 0 00-3 0l-7 7m3 3l-3-3m0 0L4.5 15a2 2 0 000 3l1.5 1.5a2 2 0 003 0l4.5-4.5" stroke="currentColor" strokeWidth="1.5" />
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
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 4l9 8M6 11v9h12v-9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Yard & grounds',
    badge: 'Seasonal Care',
    desc: 'Regular mowing and seasonal cleanups that keep a property looking cared for.',
    items: ['Mowing & trimming', 'Spring & fall cleanup', 'Mulching & bed work', 'Brush & branch clearing'],
    imageUrl: 'https://images.unsplash.com/photo-1686663048931-6df69f577a2f?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeLinejoin="round">
        <path d="M12 3c3 2.5 5 6 5 9a5 5 0 01-10 0c0-3 2-6.5 5-9z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      <svg viewBox="0 0 24 24" fill="none" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a5 5 0 01-6.8 6.8L5 21H3v-2L12.7 9.3a5 5 0 016.8-6.8l-3.8 3.8z" stroke="currentColor" strokeWidth="1.5" />
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
      <svg viewBox="0 0 24 24" fill="none" strokeLinejoin="round">
        <path d="M4 21l6.5-1.5L19 11a2.5 2.5 0 00-3.5-3.5L7 16l-3 5z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.5 7.5l3 3" stroke="currentColor" strokeWidth="1.5" />
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
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
        <path d="M12 2v20M4.5 5.5l15 13M19.5 5.5l-15 13M4 12h16" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
]

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  return (
    <section id="services">
      <style>{`
        .service-card-interactive {
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .service-card-interactive:hover {
          transform: translateY(-4px);
          border-color: var(--teal-bright);
          box-shadow: 0 20px 40px rgba(14, 42, 56, 0.14);
        }
        .service-card-action {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--teal-deep);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: gap 0.2s ease, color 0.2s ease;
        }
        :root[data-theme="dark"] .service-card-action {
          color: var(--teal-bright);
        }
        .service-card-interactive:hover .service-card-action {
          gap: 10px;
        }
      `}</style>

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
              onClick={() => setActiveService(service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveService(service)}
            >
              <div className="icon-badge">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <button className="service-card-action" type="button">
                View service details 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {}
      <ServiceModal 
        service={activeService} 
        isOpen={Boolean(activeService)} 
        onClose={() => setActiveService(null)} 
      />
    </section>
  )
}