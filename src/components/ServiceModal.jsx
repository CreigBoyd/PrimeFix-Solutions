// src/components/ServiceModal.jsx
import React, { useEffect, useState } from 'react'

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
    imageUrl = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
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
      <style>{`
        /* Keyframes for Entrance Swing Animations */
        @keyframes primefixFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes primefixFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes primefix3dSwingIn {
          0% {
            transform: perspective(1200px) rotateY(-28deg) rotateX(16deg) translateZ(-120px) scale(0.82);
            opacity: 0;
          }
          100% {
            transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes primefix3dSlideOut {
          0% {
            transform: perspective(1200px) translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: perspective(1200px) translateY(115vh) rotate(8deg) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes primefixLeftSwingIn {
          0% {
            transform: translate(-35px, -15px) rotate(-8deg) scale(0.92);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes primefixLeftSlideOut {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(-10px, 30px) rotate(-4deg);
          }
        }

        @keyframes primefixRightUnfoldIn {
          0% {
            opacity: 0;
            transform: rotateY(-40deg);
          }
          100% {
            opacity: 1;
            transform: rotateY(0deg) translateY(0);
          }
        }

        @keyframes primefixBadgePopIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Overlay Backdrop */
        .primefix-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 19, 28, 0.82);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          perspective: 1400px;
        }

        .primefix-modal-overlay.open {
          animation: primefixFadeIn 0.45s ease forwards;
        }

        .primefix-modal-overlay.exiting {
          animation: primefixFadeOut 0.48s ease forwards;
          pointer-events: none;
        }

        /* 3D Modal Shell */
        .primefix-3d-modal {
          width: 100%;
          max-width: 760px;
          min-height: 400px;
          display: flex;
          flex-direction: row;
          position: relative;
          transform-style: preserve-3d;
          transform-origin: center center;
        }

        .primefix-modal-overlay.open .primefix-3d-modal {
          animation: primefix3dSwingIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        }

        .primefix-modal-overlay.exiting .primefix-3d-modal {
          animation: primefix3dSlideOut 0.48s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }

        /* Modal Left - Image & Badge */
        .primefix-modal-left {
          width: 42%;
          min-height: 320px;
          position: relative;
          background-size: cover;
          background-position: center;
          border-radius: 16px 0 0 16px;
          transform-origin: left center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
          flex: none;
          overflow: hidden;
        }

        .primefix-modal-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,19,28,0.6) 100%);
        }

        .primefix-modal-overlay.open .primefix-modal-left {
          animation: primefixLeftSwingIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        }

        .primefix-modal-overlay.exiting .primefix-modal-left {
          animation: primefixLeftSlideOut 0.48s ease forwards;
        }

        /* Badge */
        .primefix-modal-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 14px;
          background: linear-gradient(135deg, var(--teal-bright, #2dd4bf), var(--teal, #128077));
          color: #0e1e2b;
          font-weight: 800;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(18, 128, 119, 0.35);
          z-index: 10;
        }

        .primefix-modal-overlay.open .primefix-modal-badge {
          animation: primefixBadgePopIn 0.4s ease-in-out 0.22s forwards;
        }

        /* Modal Right - Book Unfold */
        .primefix-modal-right {
          width: 58%;
          background: var(--bg-card, #132231);
          border-radius: 0 16px 16px 0;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transform-origin: left center;
          box-shadow: 5px 15px 30px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border, #20364d);
          border-left: none;
        }

        .primefix-modal-overlay.open .primefix-modal-right {
          animation: primefixRightUnfoldIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.25) 0.08s forwards;
        }

        .primefix-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border, #20364d);
          color: var(--text-soft, #94a3b8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          line-height: 1;
        }

        .primefix-modal-close:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        .primefix-modal-right h3 {
          margin: 0 0 10px 0;
          color: #ffffff;
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.25;
          padding-right: 28px;
        }

        .primefix-modal-right p.desc {
          margin: 0 0 18px 0;
          color: var(--text-soft, #94a3b8);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .primefix-modal-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 180px;
          overflow-y: auto;
        }

        .primefix-modal-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: #ffffff;
        }

        .primefix-modal-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(45, 212, 191, 0.15);
          color: var(--teal-bright, #2dd4bf);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .primefix-modal-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: auto;
        }

        @media (max-width: 680px) {
          .primefix-3d-modal {
            flex-direction: column;
            max-height: 85vh;
            overflow-y: auto;
          }
          .primefix-modal-left {
            width: 100%;
            min-height: 180px;
            border-radius: 16px 16px 0 0;
          }
          .primefix-modal-right {
            width: 100%;
            border-radius: 0 0 16px 16px;
            border-left: 1px solid var(--border, #20364d);
            border-top: none;
          }
        }
      `}</style>

      <div className="primefix-3d-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="primefix-modal-left"
          style={{ backgroundImage: `url(${imageUrl})` }}
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
          </div>
        </div>
      </div>
    </div>
  )
}