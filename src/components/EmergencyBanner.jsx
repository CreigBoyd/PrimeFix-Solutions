import { useState } from 'react'

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="emergency-banner-bar">
      <style>{`
        .emergency-banner-bar {
          background: linear-gradient(90deg, var(--teal-deep, #0e5a54), var(--teal, #128077));
          color: #ffffff;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          position: relative;
          z-index: 1002;
          width: 100%;
        }
        .emergency-pulse {
          width: 8px;
          height: 8px;
          background-color: #2dd4bf;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 rgba(45, 212, 191, 0.4);
          animation: emergency-pulse-anim 2s infinite;
          flex-shrink: 0;
        }
        @keyframes emergency-pulse-anim {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(45, 212, 191, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); }
        }
        .emergency-banner-bar a {
          color: #ffffff;
          text-decoration: underline;
          font-weight: 700;
          margin-left: 4px;
        }
        .emergency-banner-bar a:hover {
          color: #2dd4bf;
        }
        .emergency-close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0 4px;
          position: absolute;
          right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .emergency-close-btn:hover {
          color: #ffffff;
        }
      `}</style>

      <span className="emergency-pulse" aria-hidden="true"></span>
      <span>
        <strong>Emergency Crew on Standby:</strong> Available today for storm damage, leaks &amp; urgent repairs.
        <a href="tel:5550102000">Call (555) 010-2000</a>
      </span>
      <button 
        className="emergency-close-btn" 
        onClick={() => setDismissed(true)} 
        aria-label="Close emergency banner"
      >
        &times;
      </button>
    </div>
  )
}