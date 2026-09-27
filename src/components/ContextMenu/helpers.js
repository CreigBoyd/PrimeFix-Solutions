import { useEffect, useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'

/* --------------------------- Text selection lock --------------------------- */
/**
 * enableTextSelection:
 * - true (default): no locking
 * - false: lock globally (body)
 * - HTMLElement: lock that element
 * - Array<HTMLElement>: lock those elements
 * - string selector: "#id" ".class" "[data-x]" etc (locks first match)
 * - Array<string selector>: locks all matches of each selector
 * - React ref object: { current: HTMLElement }
 * - Array<React ref>: locks each ref.current
 */

export const GlobalNoSelect = createGlobalStyle`
  body {
    -webkit-user-select: ${(p) => (p.$lock ? 'none' : 'auto')};
    -moz-user-select: ${(p) => (p.$lock ? 'none' : 'auto')};
    -ms-user-select: ${(p) => (p.$lock ? 'none' : 'auto')};
    user-select: ${(p) => (p.$lock ? 'none' : 'auto')};
  }
`

function isRefLike(x) {
  return !!x && typeof x === 'object' && 'current' in x
}

function asElementsFromSelector(sel) {
  try {
    return Array.from(document.querySelectorAll(sel))
  } catch {
    return []
  }
}

function normaliseTargets(input) {
  if (input == null || input === true) return { mode: 'none', targets: [] }
  if (input === false) return { mode: 'global', targets: [] }

  const items = Array.isArray(input) ? input : [input]
  const targets = []

  for (const it of items) {
    if (!it) continue

    if (typeof it === 'string') {
      targets.push({ kind: 'selector', value: it })
      continue
    }

    if (isRefLike(it)) {
      targets.push({ kind: 'element', value: it.current })
      continue
    }

    if (it instanceof HTMLElement) {
      targets.push({ kind: 'element', value: it })
      continue
    }
  }

  return { mode: 'targets', targets }
}

function applyNoSelect(el, enabled) {
  if (!el) return

  if (enabled) {
    // store previous inline values for safe restore
    const ds = el.dataset
    if (!('_prevUserSelect' in ds)) ds._prevUserSelect = el.style.userSelect ?? ''
    if (!('_prevWebkitUserSelect' in ds)) ds._prevWebkitUserSelect = el.style.webkitUserSelect ?? ''
    if (!('_prevMozUserSelect' in ds)) ds._prevMozUserSelect = el.style.MozUserSelect ?? ''
    if (!('_prevMsUserSelect' in ds)) ds._prevMsUserSelect = el.style.msUserSelect ?? ''

    el.style.userSelect = 'none'
    el.style.webkitUserSelect = 'none'
    el.style.MozUserSelect = 'none'
    el.style.msUserSelect = 'none'
  } else {
    const ds = el.dataset

    if ('_prevUserSelect' in ds) el.style.userSelect = ds._prevUserSelect
    if ('_prevWebkitUserSelect' in ds) el.style.webkitUserSelect = ds._prevWebkitUserSelect
    if ('_prevMozUserSelect' in ds) el.style.MozUserSelect = ds._prevMozUserSelect
    if ('_prevMsUserSelect' in ds) el.style.msUserSelect = ds._prevMsUserSelect

    delete ds._prevUserSelect
    delete ds._prevWebkitUserSelect
    delete ds._prevMozUserSelect
    delete ds._prevMsUserSelect
  }
}

export function useTextSelectionPolicy(enableTextSelection) {
  const cfg = useMemo(() => normaliseTargets(enableTextSelection), [enableTextSelection])

  useEffect(() => {
    if (cfg.mode !== 'targets') return

    // resolve selectors to actual elements
    const els = []
    for (const t of cfg.targets) {
      if (t.kind === 'element' && t.value) els.push(t.value)
      if (t.kind === 'selector') els.push(...asElementsFromSelector(t.value))
    }

    // de-dup
    const unique = Array.from(new Set(els))

    unique.forEach((el) => applyNoSelect(el, true))
    return () => unique.forEach((el) => applyNoSelect(el, false))
  }, [cfg])

  return cfg.mode === 'global'
}

/* --------------------------- pointer/geometry helpers --------------------------- */

export function pointFromEvent(e) {
  if (typeof e.clientX === 'number') return { x: e.clientX, y: e.clientY }
  const t = e.touches?.[0] || e.changedTouches?.[0]
  if (t) return { x: t.clientX, y: t.clientY }
  return { x: 0, y: 0 }
}

export function isWithinRef(e, ref) {
  const el = ref?.current
  const target = e.target
  return !!(el && target && el.contains(target))
}

export function isWithinAnyRef(e, refs) {
  return (refs ?? []).some((r) => isWithinRef(e, r))
}
