// src/utils/consoleBanner.js
import logoSvgRaw from '../assets/primefix-solutions-logo-dark-bg.svg?raw'

let isInitialized = false

export function initConsoleBanner() {
  if (isInitialized || window.__PRIMEFIX_CONSOLE_BANNER__) return
  isInitialized = true
  window.__PRIMEFIX_CONSOLE_BANNER__ = true

  const logoDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvgRaw)}`

  // Styles for a single logo box
  const logoStyle = `
    font-size: 1px;
    line-height: 0;
    padding: 25px 75px;
    background-image: url("${logoDataUrl}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left center;
  `

  const tagStyle = `
    background: #0284c7;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 4px;
    font-family: system-ui, sans-serif;
  `

  const subTextStyle = `
    color: #64748b;
    font-size: 11px;
    font-family: system-ui, sans-serif;
  `

  // 1. Log the logo as a single block element without linebreaks
  console.log('%c\xa0', logoStyle)

  // 2. Log the text banner on the next line
  console.log(
    `%c PrimeFix Solutions %c Building & Property Maintenance\n%cLooking for website development or custom maintenance solutions? Reach out at hello@primefix.vip`,
    tagStyle,
    'color: #0369a1; font-weight: bold; font-size: 12px;',
    subTextStyle
  )
}