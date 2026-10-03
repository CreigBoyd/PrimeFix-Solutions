// Google Analytics loads ONLY after the visitor accepts cookies.
const GA_ID = 'G-GD8QD81L85'
const KEY = 'pfs-cookie-consent' // 'granted' | 'denied'
let loaded = false

export function getConsent() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* private mode: choice just won't persist */
  }
  if (value === 'granted') loadAnalytics()
}

export function loadAnalytics() {
  if (loaded || !GA_ID) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

export function initAnalytics() {
  if (getConsent() === 'granted') loadAnalytics()
}
