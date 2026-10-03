import React from 'react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from '../utils/toast'
import usePageTitle from '../hooks/usePageTitle';
import { telHref } from '../config/site'

export default function NotFound() {
  // Sets the browser tab title to "Customer Reviews | PrimeFix Solutions"
  usePageTitle('Page Not Found', 'The page you are looking for could not be found.', { noindex: true });

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
          <a href={telHref}>Call Dispatch</a>
        </div>
      </div>
    </section>
  )
}