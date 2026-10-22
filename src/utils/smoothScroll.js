// src/utils/smoothScroll.js
//
// Desktop-only smooth scroll physics:
//   1. Mouse-wheel glide: tuned to feel like sliding across wet ice (frictionless & heavy).
//   2. Click-and-drag scrolling: grab empty space to drag the page.
//   3. Hold-to-scroll: hold the left mouse button down anywhere on empty space to start 
//      sliding down the page continuously. Releasing it softly glides to a stop on wet ice.

const ENABLE_WHEEL_SMOOTHING = true
const ENABLE_DRAG_SCROLL = true

// Physics constants for the wet ice feel
const WHEEL_GLIDE = 0.40 // seconds. Higher = floaty, frictionless wet ice
const DRAG_FOLLOW = 0.05 // seconds. Tight hand-following while physically dragging
const RELEASE_GLIDE = 0.38 // seconds. Soft deceleration glide upon releasing
const RELEASE_BOOST = 0.45 // Momentum multiplier on release
const DRAG_THRESHOLD = 6 // pixels moved before switching from hold/click to drag

// Auto-Scroll (Hold-Down) settings
const HOLD_PRESS_DELAY = 180 // milliseconds of holding before auto-scroll kicks in
const HOLD_SCROLL_SPEED = 950 // pixels per second (top cruise speed)
const HOLD_ACCELERATION = 1800 // pixels per second² (build-up rate)

const INTERACTIVE =
  'a,button,input,textarea,select,option,label,summary,video,audio,iframe,canvas,svg a,' +
  '[contenteditable],[role=button],[role=slider],[role=dialog],[role=menu],[draggable=true],[data-no-drag-scroll]'

export function initSmoothScroll() {
  if (typeof window === 'undefined' || window.__smoothScrollReady) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.__smoothScrollReady = true

  const root = document.documentElement

  // Shared glide engine
  let current = window.scrollY
  let target = window.scrollY
  let lastSet = current
  let tau = WHEEL_GLIDE
  let raf = 0
  let lastTime = 0

  const maxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight)
  const clamp = (v) => Math.min(Math.max(v, 0), maxScroll())

  function setScroll(y) {
    lastSet = y
    try {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, y)
    }
  }

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    current += (target - current) * (1 - Math.exp(-dt / tau))
    if (Math.abs(target - current) < 0.4) {
      current = target
      setScroll(current)
      raf = 0
      return
    }
    setScroll(current)
    raf = requestAnimationFrame(tick)
  }

  function glideTo(y, withTau) {
    tau = withTau
    target = clamp(y)
    if (!raf) {
      current = window.scrollY
      lastTime = performance.now()
      raf = requestAnimationFrame(tick)
    }
  }

  function stopGlide() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    current = target = window.scrollY
  }

  // Sync scroll state if user moves scrollbar or uses keyboard
  window.addEventListener(
    'scroll',
    () => {
      if (Math.abs(window.scrollY - lastSet) > 2) {
        if (raf) cancelAnimationFrame(raf)
        raf = 0
        current = target = lastSet = window.scrollY
      }
    },
    { passive: true }
  )

  const pageLocked = () => document.body.style.overflow === 'hidden' || root.style.overflow === 'hidden'

  // ---------- 1. Wet-Ice Mouse Wheel ----------
  function insideScroller(el, dy) {
    for (let n = el; n && n !== document.body && n !== root; n = n.parentElement) {
      const o = getComputedStyle(n).overflowY
      if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 1) {
        if (dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 1) return true
        if (dy < 0 && n.scrollTop > 0) return true
      }
    }
    return false
  }

  if (ENABLE_WHEEL_SMOOTHING) {
    window.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey || e.defaultPrevented || pageLocked()) return
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
        let dy = e.deltaY
        if (e.deltaMode === 1) dy *= 40
        else if (e.deltaMode === 2) dy *= window.innerHeight
        else if (Math.abs(dy) < 40) return
        if (insideScroller(e.target, dy)) return
        e.preventDefault()
        if (!raf) current = target = window.scrollY
        glideTo(target + dy, WHEEL_GLIDE)
      },
      { passive: false }
    )
  }

  // ---------- 2. Hold-to-Scroll & Drag-to-Scroll Engine ----------
  if (ENABLE_DRAG_SCROLL) {
    if (!document.getElementById('smooth-scroll-style')) {
      const style = document.createElement('style')
      style.id = 'smooth-scroll-style'
      style.textContent =
        'html.is-drag-scrolling,html.is-drag-scrolling *{cursor:grabbing!important;user-select:none!important;-webkit-user-select:none!important}' +
        'img{-webkit-user-drag:none}'
      document.head.appendChild(style)
    }

    let down = null
    let dragging = false
    let autoScrolling = false
    let holdTimer = null
    let autoScrollRaf = 0
    let currentAutoSpeed = 0
    let lastAutoTime = 0
    let samples = []
    let swallowClick = false

    function canDragFrom(el) {
      if (!(el instanceof Element)) return false
      if (el.closest(INTERACTIVE)) return false
      const cursor = getComputedStyle(el).cursor
      if (cursor !== 'auto' && cursor !== 'default' && cursor !== 'text') return false
      for (let n = el; n && n !== root; n = n.parentElement) {
        const cs = getComputedStyle(n)
        if (cs.position === 'fixed') return false
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && n.scrollHeight > n.clientHeight + 1) return false
      }
      return true
    }

    function autoScrollStep(now) {
      if (!autoScrolling) return
      const dt = Math.min((now - lastAutoTime) / 1000, 0.05)
      lastAutoTime = now

      // Smoothly ramp up speed
      if (currentAutoSpeed < HOLD_SCROLL_SPEED) {
        currentAutoSpeed = Math.min(HOLD_SCROLL_SPEED, currentAutoSpeed + HOLD_ACCELERATION * dt)
      }

      const nextPos = clamp(target + currentAutoSpeed * dt)
      samples.push({ t: now, s: nextPos })
      if (samples.length > 8) samples.shift()

      glideTo(nextPos, 0.08)

      if (target < maxScroll()) {
        autoScrollRaf = requestAnimationFrame(autoScrollStep)
      }
    }

    function startAutoScroll() {
      autoScrolling = true
      currentAutoSpeed = 100
      lastAutoTime = performance.now()
      autoScrollRaf = requestAnimationFrame(autoScrollStep)
    }

    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return
      if (pageLocked() || !canDragFrom(e.target)) return

      stopGlide()
      down = { y: e.clientY, startScroll: window.scrollY, id: e.pointerId }
      dragging = false
      autoScrolling = false
      samples = [{ t: e.timeStamp, s: window.scrollY }]

      // Start hold timer: if mouse doesn't move, start continuous downward sliding
      clearTimeout(holdTimer)
      holdTimer = setTimeout(() => {
        if (down && !dragging) {
          startAutoScroll()
        }
      }, HOLD_PRESS_DELAY)
    })

    window.addEventListener('pointermove', (e) => {
      if (!down || e.pointerId !== down.id) return
      const dy = e.clientY - down.y

      if (!dragging) {
        if (Math.abs(dy) < DRAG_THRESHOLD) return
        
        // Mouse moved beyond threshold: cancel hold-to-scroll and switch to physical drag
        clearTimeout(holdTimer)
        if (autoScrolling) {
          autoScrolling = false
          cancelAnimationFrame(autoScrollRaf)
        }

        dragging = true
        root.classList.add('is-drag-scrolling')
        window.getSelection()?.removeAllRanges()
        try {
          root.setPointerCapture(e.pointerId)
        } catch {}
      }

      const y = clamp(down.startScroll - dy)
      samples.push({ t: e.timeStamp, s: y })
      if (samples.length > 8) samples.shift()
      glideTo(y, DRAG_FOLLOW)
    })

    function endDrag(e) {
      if (!down || (e && e.pointerId !== down.id)) return
      clearTimeout(holdTimer)

      const wasDragging = dragging
      const wasAutoScrolling = autoScrolling

      down = null
      dragging = false
      autoScrolling = false
      cancelAnimationFrame(autoScrollRaf)

      root.classList.remove('is-drag-scrolling')

      if (wasAutoScrolling) {
        swallowClick = true
        setTimeout(() => (swallowClick = false), 0)
        // Glide off on wet ice after releasing the hold-down button
        glideTo(target + currentAutoSpeed * RELEASE_BOOST, RELEASE_GLIDE)
        return
      }

      if (!wasDragging) return

      swallowClick = true
      setTimeout(() => (swallowClick = false), 0)

      // Carry velocity flick after mouse release
      const last = samples[samples.length - 1]
      const first = samples.find((p) => last.t - p.t <= 90) || samples[0]
      const dt = (last.t - first.t) / 1000
      const velocity = dt > 0.01 ? (last.s - first.s) / dt : 0
      if (Math.abs(velocity) > 80) glideTo(target + velocity * RELEASE_BOOST, RELEASE_GLIDE)
    }

    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    window.addEventListener('lostpointercapture', () => endDrag())
    window.addEventListener('blur', () => endDrag())

    window.addEventListener(
      'click',
      (e) => {
        if (swallowClick) {
          e.preventDefault()
          e.stopPropagation()
        }
      },
      true
    )
    window.addEventListener('dragstart', (e) => {
      if (down) e.preventDefault()
    })
  }
}