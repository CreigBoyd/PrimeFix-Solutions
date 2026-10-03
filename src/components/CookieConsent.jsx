import { useState } from 'react'
import { getConsent, setConsent } from '../utils/analytics'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => getConsent() === null)
  if (!visible) return null

  const choose = (value) => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <p>
        We use cookies for anonymous site analytics so we can improve the website. You can accept or decline.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn cookie-btn-ghost" onClick={() => choose('denied')}>
          Decline
        </button>
        <button type="button" className="cookie-btn cookie-btn-primary" onClick={() => choose('granted')}>
          Accept
        </button>
      </div>
    </div>
  )
}
