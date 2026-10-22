// src/components/ServiceModal.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES as SERVICE_PAGES } from '../data/serviceContent'
import defaultModalImage from '../assets/service-handyman.webp'

export default function ServiceModal({
  service = null,
  isOpen = false,
  onClose,
  onCtaClick
}) {
  const [isExiting, setIsExiting] = useState(false)
  const [renderService, setRenderService] = useState(service)

  // Keep active service data persistent during exit animation
  useEffect(() => {
    if (service) {
      setRenderService(service)
    }
  }, [service])

  // Manage body scroll locking when opened
  useEffect(() => {
    if (isOpen) {
      setIsExiting(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const triggerClose = () => {
    if (isExiting) return
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      if (onClose) onClose()
    }, 480) // Matches 480ms exit animation duration
  }

  // Handle Escape keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isExiting) {
        triggerClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isExiting])

  if (!isOpen && !isExiting) return null

  const activeService = service || renderService

  const {
    title = 'Commercial & Residential Painting',
    badge = 'Popular',
    desc = 'Full interior and exterior painting services for homes and commercial buildings.',
    imageUrl = defaultModalImage,
    modalImageUrl,
    items = [],
    ctaText = 'Get Free Estimate'
  } = activeService || {}

  const handleCta = (e) => {
    triggerClose()
    if (onCtaClick) {
      onCtaClick(e)
    } else {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div
      className={`primefix-modal-overlay ${isOpen && !isExiting ? 'open' : ''} ${isExiting ? 'exiting' : ''}`}
      onClick={triggerClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="primefix-modal-title"
    >

      <div className="primefix-3d-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="primefix-modal-left"
          style={{ backgroundImage: `url(${modalImageUrl || imageUrl})` }}
        >
          {badge && <div className="primefix-modal-badge">{badge}</div>}
        </div>

        <div className="primefix-modal-right">
          <button
            className="primefix-modal-close"
            onClick={triggerClose}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>

          <div>
            <h3 id="primefix-modal-title">{title}</h3>
            <p className="desc">{desc}</p>

            {items && items.length > 0 && (
              <ul className="primefix-modal-list">
                {items.map((item, idx) => (
                  <li key={idx} className="primefix-modal-item">
                    <span className="primefix-modal-icon">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="primefix-modal-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCta}
              style={{ width: '100%', padding: '12px 20px', fontWeight: 700 }}
            >
              {ctaText}
            </button>
            {(() => {
              const page = SERVICE_PAGES.find((s) => s.name === renderService?.title)
              return page ? (
                <Link
                  to={`/services/${page.slug}`}
                  style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--teal-bright)', fontWeight: 600 }}
                >
                  See the full {page.name.toLowerCase()} page &rarr;
                </Link>
              ) : null
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}