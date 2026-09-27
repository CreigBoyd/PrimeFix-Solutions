import React, { useEffect, useState } from 'react';

export default function ServiceModal({
  service = null,
  isOpen = false,
  onClose,
  onCtaClick
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [renderService, setRenderService] = useState(service);

  // Keep active service data persistent during slide-down exit animation
  useEffect(() => {
    if (service) {
      setRenderService(service);
    }
  }, [service]);

  const triggerClose = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      if (onClose) onClose();
    }, 480); // Matches the 480ms exit animation
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isExiting) {
        triggerClose();
      }
    };

    if (isOpen) {
      setIsExiting(false);
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen && !isExiting) return null;

  const activeService = service || renderService;

  const {
    title = "Commercial & Residential Painting",
    badge = "Popular",
    desc = "Full interior and exterior painting services for homes and commercial buildings.",
    imageUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    items = [],
    ctaText = "Get Free Estimate"
  } = activeService || {};

  const handleCta = (e) => {
    triggerClose();
    if (onCtaClick) {
      onCtaClick(e);
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
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
          background: rgba(14, 42, 56, 0.78);
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
          max-width: 720px;
          min-height: 380px;
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
          width: 45%;
          min-height: 320px;
          position: relative;
          background-size: cover;
          background-position: center;
          border-radius: 12px 0 0 12px;
          transform-origin: left center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
          flex: none;
        }

        .primefix-modal-overlay.open .primefix-modal-left {
          animation: primefixLeftSwingIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        }

        .primefix-modal-overlay.exiting .primefix-modal-left {
          animation: primefixLeftSlideOut 0.48s ease forwards;
        }

        /* Price/Status Badge */
        .primefix-modal-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 14px;
          background: linear-gradient(135deg, var(--teal-bright, #17998D), var(--green, #2F7A4F));
          color: #ffffff;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(18, 128, 119, 0.35);
          z-index: 10;
        }

        .primefix-modal-overlay.open .primefix-modal-badge {
          animation: primefixBadgePopIn 0.4s ease-in-out 0.22s forwards;
        }

        /* Modal Right - Book Unfold */
        .primefix-modal-right {
          width: 55%;
          background: var(--bg-card, #ffffff);
          border-radius: 0 12px 12px 0;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transform-origin: left center;
          box-shadow: 5px 15px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border, rgba(14,42,56,0.1));
          border-left: none;
        }

        .primefix-modal-overlay.open .primefix-modal-right {
          animation: primefixRightUnfoldIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.25) 0.08s forwards;
        }

        .primefix-modal-right h3 {
          margin: 0 0 10px 0;
          color: var(--text, #0E2A38);
          font-family: 'Newsreader', serif;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.2;
        }

        .primefix-modal-right p.desc {
          margin: 0 0 16px 0;
          color: var(--text-soft, #4A6572);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .primefix-modal-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .primefix-modal-list li {
          font-size: 0.86rem;
          color: var(--text, #0E2A38);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .primefix-modal-list li svg {
          width: 16px;
          height: 16px;
          color: var(--teal-bright, #17998D);
          flex-shrink: 0;
        }

        /* Action & Close Buttons */
        .primefix-modal-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }

        .primefix-modal-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          background: linear-gradient(120deg, var(--teal-bright, #17998D), var(--green, #2F7A4F));
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: filter 0.2s, transform 0.12s;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(23, 153, 141, 0.25);
        }
        .primefix-modal-cta:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .primefix-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--bg, rgba(0,0,0,0.05));
          border: none;
          color: var(--text-soft, #4A6572);
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
          z-index: 20;
        }
        .primefix-modal-close:hover {
          color: var(--text, #0E2A38);
          background: rgba(0,0,0,0.1);
          transform: scale(1.08);
        }
        .primefix-modal-close svg {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 680px) {
          .primefix-3d-modal {
            flex-direction: column;
            max-width: 440px;
            max-height: 85vh;
            overflow-y: auto;
          }
          .primefix-modal-left {
            width: 100%;
            min-height: 200px;
            height: 200px;
            border-radius: 12px 12px 0 0;
          }
          .primefix-modal-right {
            width: 100%;
            border-radius: 0 0 12px 12px;
            border-left: 1px solid var(--border, rgba(14,42,56,0.1));
            border-top: none;
          }
        }
      `}</style>

      {/* Modal Backdrop & 3D Container */}
      <div 
        className={`primefix-modal-overlay ${isOpen && !isExiting ? 'open' : ''} ${isExiting ? 'exiting' : ''}`}
        onClick={triggerClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div 
          className="primefix-3d-modal" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel - Image & Badge */}
          <div 
            className="primefix-modal-left" 
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {badge && <span className="primefix-modal-badge">{badge}</span>}
          </div>

          {/* Right Panel - Text Content */}
          <div className="primefix-modal-right">
            <button 
              className="primefix-modal-close" 
              onClick={triggerClose} 
              aria-label="Close modal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div>
              <h3 id="modal-title">{title}</h3>
              <p className="desc">{desc}</p>

              {items && items.length > 0 && (
                <ul className="primefix-modal-list">
                  {items.map((item, idx) => (
                    <li key={idx}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="primefix-modal-actions">
              <a href="#contact" className="primefix-modal-cta" onClick={handleCta}>
                {ctaText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}