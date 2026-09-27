import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from '../utils/toast'

export default function NotFound() {
  const navigate = useNavigate()
  const [fixedCount, setFixedCount] = useState(0)

  const handleQuickFix = () => {
    const nextCount = fixedCount + 1
    setFixedCount(nextCount)

    if (nextCount === 1) {
      showToast('🔧 Standard diagnostic complete: Page is definitely missing.')
    } else if (nextCount === 2) {
      showToast('🔨 Tightened loose bolts on the server...')
    } else {
      showToast('⚡ Circuit overdriven! Redirecting you home now...')
      setTimeout(() => navigate('/'), 1200)
    }
  }

  return (
    <section className="not-found-wrapper">
      <style>{`
        .not-found-wrapper {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(circle at 50% 30%, rgba(18, 128, 119, 0.12) 0%, rgba(10, 19, 28, 0.95) 70%);
          color: var(--text, #ffffff);
          position: relative;
          overflow: hidden;
        }

        /* Industrial Grid Overlay */
        .not-found-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(32, 54, 77, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32, 54, 77, 0.25) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          opacity: 0.6;
        }

        .not-found-card {
          background: var(--bg-card, #132231);
          border: 1px solid var(--border, #20364d);
          border-radius: 20px;
          max-width: 620px;
          width: 100%;
          padding: 48px 36px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(18, 128, 119, 0.15);
          position: relative;
          z-index: 1;
          backdrop-filter: blur(8px);
        }

        /* Hazard Stripe Top Accent */
        .hazard-bar {
          height: 6px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          background: repeating-linear-gradient(
            -45deg,
            #f59e0b,
            #f59e0b 12px,
            #1e293b 12px,
            #1e293b 24px
          );
        }

        .error-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 30px;
          color: #fbbf24;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .glitch-404 {
          font-size: clamp(4.5rem, 12vw, 7.5rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          margin: 0;
          background: linear-gradient(180deg, #ffffff 30%, var(--teal-bright, #2dd4bf) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 30px rgba(18, 128, 119, 0.3);
        }

        .not-found-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 16px 0 12px 0;
          color: var(--text, #fff);
        }

        .not-found-desc {
          color: var(--text-soft, #94a3b8);
          font-size: 0.98rem;
          line-height: 1.6;
          max-width: 460px;
          margin: 0 auto 32px auto;
        }

        .action-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        .btn-home {
          background: linear-gradient(135deg, var(--teal, #128077), var(--teal-deep, #0e5a54));
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-home:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(18, 128, 119, 0.4);
        }

        .btn-tool {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border, #20364d);
          color: var(--text, #fff);
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-tool:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--teal, #128077);
        }

        .quick-links {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid var(--border, #20364d);
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 0.88rem;
        }

        .quick-links a {
          color: var(--teal-bright, #2dd4bf);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .quick-links a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="not-found-card">
        <div className="hazard-bar" />

        <div className="error-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          System Diagnostic: Blueprint Missing
        </div>

        <h1 className="glitch-404">404</h1>
        <h2 className="not-found-title">Looks like this page took a hard knock.</h2>
        <p className="not-found-desc">
          The link you followed might be broken, moved, or under scheduled maintenance. 
          Don't worry—our crew is on it.
        </p>

        <div className="action-group">
          <Link to="/" className="btn-home">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Return to Home
          </Link>

          <button type="button" className="btn-tool" onClick={handleQuickFix}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            {fixedCount === 0 ? 'Apply Quick Fix' : `Wrench Applied (${fixedCount})`}
          </button>
        </div>

        <div className="quick-links">
          <Link to="/services">Explore Services</Link>
          <span style={{ color: 'var(--border)' }}>•</span>
          <Link to="/contact">Request Estimate</Link>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a href="tel:5550102000">Call Dispatch</a>
        </div>
      </div>
    </section>
  )
}