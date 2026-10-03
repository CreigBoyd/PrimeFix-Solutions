import { useState } from 'react'
import { SITE, telHref } from '../config/site'

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="emergency-banner-bar">

      <span className="emergency-pulse" aria-hidden="true"></span>
      <span>
        <strong>Emergency Crew on Standby:</strong> Available today for storm damage, leaks &amp; urgent repairs.
        <a href={telHref}>Call {SITE.phoneDisplay}</a>
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