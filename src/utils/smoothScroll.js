// Custom smooth-scroll: intercepts in-page "#" link clicks, eases the
// scroll with a cubic curve, handles invalid CSS selector strings,
// and accounts for the sticky header height.

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function smoothScrollTo(targetY, duration = 700) {
  const startY = window.scrollY || window.pageYOffset
  const diff = targetY - startY
  if (Math.abs(diff) < 1) return

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY)
    return
  }

  let startTime = null

  function step(timestamp) {
    if (startTime === null) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)
    window.scrollTo(0, startY + diff * eased)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function scrollToId(id) {
  if (!id || id === '#') return

  let target = null
  try {
    target = document.querySelector(id)
  } catch {
    // Safe fallback for selector strings containing invalid CSS chars (e.g. #123)
    target = document.getElementById(id.replace(/^#/, ''))
  }

  if (!target) return

  const header = document.querySelector('header.site')
  const offset = (header ? header.offsetHeight : 0) + 12
  const targetY = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - offset
  smoothScrollTo(targetY)
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', id)
  }
}

// Attach once at the app root.
export function initSmoothScroll() {
  function handleClick(e) {
    const anchor = e.target.closest('a[href^="#"]')
    if (!anchor) return
    const id = anchor.getAttribute('href')
    if (!id || id === '#') return

    let target = null
    try {
      target = document.querySelector(id)
    } catch {
      target = document.getElementById(id.replace(/^#/, ''))
    }

    if (!target) return
    e.preventDefault()
    scrollToId(id)
  }

  document.addEventListener('click', handleClick)
  return () => document.removeEventListener('click', handleClick)
}