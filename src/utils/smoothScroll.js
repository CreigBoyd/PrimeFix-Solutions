// Custom smooth-scroll: intercepts every in-page "#" link click, eases the
// scroll with a cubic curve, and accounts for the sticky header's height so
// sections don't land tucked under it.

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function smoothScrollTo(targetY, duration = 700) {
  const startY = window.pageYOffset
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
  const target = document.querySelector(id)
  if (!target) return
  const header = document.querySelector('header.site')
  const offset = (header ? header.offsetHeight : 0) + 12
  const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset
  smoothScrollTo(targetY)
  if (window.history.pushState) window.history.pushState(null, '', id)
}

// Attach once at the app root. Any <a href="#something"> anywhere in the
// tree gets the smooth-scroll treatment automatically, so new links don't
// need to be wired up individually.
export function initSmoothScroll() {
  function handleClick(e) {
    const anchor = e.target.closest('a[href^="#"]')
    if (!anchor) return
    const id = anchor.getAttribute('href')
    if (!id || id === '#') return
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    scrollToId(id)
  }

  document.addEventListener('click', handleClick)
  return () => document.removeEventListener('click', handleClick)
}
