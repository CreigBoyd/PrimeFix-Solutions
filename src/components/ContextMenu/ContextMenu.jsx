import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { pointFromEvent, isWithinRef, isWithinAnyRef } from './helpers'

const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	z-index: 9998;
`

const Popover = styled.div`
	position: fixed;
	z-index: 9999;

	opacity: 0;
	transform: scale(0.92);
	transition: opacity 160ms ease, transform 180ms cubic-bezier(0.2, 0.9, 0.2, 1);

	transform-origin: var(--ox, 0px) var(--oy, 0px);

	&[data-open='true'] {
		opacity: 1;
		transform: scale(1);
	}
`

function usePopoverPlacement(open, pt, popRef) {
	useLayoutEffect(() => {
		if (!open) return
		const el = popRef.current
		if (!el) return

		const margin = 8
		const vw = window.innerWidth
		const vh = window.innerHeight

		const r = el.getBoundingClientRect()
		const w = r.width
		const h = r.height

		let left = pt.x
		let top = pt.y

		if ('ontouchstart' in window) top += 12

		left = Math.max(margin, Math.min(left, vw - w - margin))
		top = Math.max(margin, Math.min(top, vh - h - margin))

		const ox = pt.x - left
		const oy = pt.y - top

		el.style.left = `${left}px`
		el.style.top = `${top}px`
		el.style.setProperty('--ox', `${ox}px`)
		el.style.setProperty('--oy', `${oy}px`)
	}, [open, pt.x, pt.y, popRef])
}

function useCloseOnEscape(open, close) {
	useEffect(() => {
		if (!open) return
		const onKey = (e) => e.key === 'Escape' && close()
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open, close])
}

/* -------------------- ContextMenu (element-scoped) -------------------- */

export function ContextMenu({ targetRef, overrideRootMenu = true, holdMs = 600, menu }) {
	const [open, setOpen] = useState(false)
	const [pt, setPt] = useState({ x: 0, y: 0 })

	const popRef = useRef(null)
	const timerRef = useRef(null)
	const lastPointRef = useRef({ x: 0, y: 0 })

	const startPtRef = useRef(null)
	const MOVE_TOLERANCE = 8

	const close = () => setOpen(false)

	const clearTimer = () => {
		if (timerRef.current) window.clearTimeout(timerRef.current)
		timerRef.current = null
	}

	const startHold = () => {
		clearTimer()
		timerRef.current = window.setTimeout(() => {
			timerRef.current = null
			setPt(lastPointRef.current)
			setOpen(true)
		}, holdMs)
	}

	useEffect(() => {
		const el = targetRef?.current
		if (!el) return

		const stopIfOverride = (e) => {
			if (!overrideRootMenu) return
			e.preventDefault()
			e.stopPropagation()
		}

		const onContextMenu = (e) => {
			if (!isWithinRef(e, targetRef)) return
			stopIfOverride(e)
			clearTimer()
			lastPointRef.current = pointFromEvent(e)
			setPt(lastPointRef.current)
			setOpen(true)
		}

		const onPointerDown = (e) => {
			if (!isWithinRef(e, targetRef)) return

			lastPointRef.current = pointFromEvent(e)
			startPtRef.current = lastPointRef.current

			if (e.pointerType === 'touch') {
				if (overrideRootMenu) e.stopPropagation()
				startHold()
			} else if (e.pointerType === 'mouse' && e.button === 0) {
				if (overrideRootMenu) e.stopPropagation()
				startHold()
			}
		}

		const onPointerMove = (e) => {
			if (!startPtRef.current) return
			const { x, y } = pointFromEvent(e)
			const dx = Math.abs(x - startPtRef.current.x)
			const dy = Math.abs(y - startPtRef.current.y)
			if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) clearTimer()
		}

		const end = () => {
			startPtRef.current = null
			clearTimer()
		}

		const opts = { capture: !!overrideRootMenu, passive: false }

		el.addEventListener('contextmenu', onContextMenu, opts)
		el.addEventListener('pointerdown', onPointerDown, opts)
		el.addEventListener('pointermove', onPointerMove, opts)
		el.addEventListener('pointerup', end, opts)
		el.addEventListener('pointercancel', end, opts)
		el.addEventListener('pointerleave', end, opts)
		window.addEventListener('scroll', clearTimer, { passive: true })

		return () => {
			el.removeEventListener('contextmenu', onContextMenu, opts)
			el.removeEventListener('pointerdown', onPointerDown, opts)
			el.removeEventListener('pointermove', onPointerMove, opts)
			el.removeEventListener('pointerup', end, opts)
			el.removeEventListener('pointercancel', end, opts)
			el.removeEventListener('pointerleave', end, opts)
			window.removeEventListener('scroll', clearTimer)
			clearTimer()
		}
	}, [targetRef, holdMs, overrideRootMenu])

	useCloseOnEscape(open, close)
	usePopoverPlacement(open, pt, popRef)

	if (!open) return null

	return (
		<>
			<Backdrop onPointerDown={close} />
			<Popover
				ref={popRef}
				data-open="true"
				onContextMenu={(e) => {
					e.preventDefault()
					e.stopPropagation()
				}}
			>
				{typeof menu === 'function' ? menu({ close }) : menu}
			</Popover>
		</>
	)
}

/* -------------------- RootContextMenu (global) -------------------- */

export function RootContextMenu({ excludedRefs = [], holdMs = 650, menu }) {
	const [open, setOpen] = useState(false)
	const [pt, setPt] = useState({ x: 0, y: 0 })

	const popRef = useRef(null)
	const timerRef = useRef(null)
	const lastPointRef = useRef({ x: 0, y: 0 })

	const startPtRef = useRef(null)
	const excludedRefsRef = useRef(excludedRefs)
	excludedRefsRef.current = excludedRefs

	const MOVE_TOLERANCE = 8

	const close = () => setOpen(false)

	const clearTimer = () => {
		if (timerRef.current) window.clearTimeout(timerRef.current)
		timerRef.current = null
	}

	const startHold = () => {
		clearTimer()
		timerRef.current = window.setTimeout(() => {
			timerRef.current = null
			setPt(lastPointRef.current)
			setOpen(true)
		}, holdMs)
	}

	useEffect(() => {
		// Never hijack the native menu on links, form fields or media (copy/paste, open in new tab, etc.).
		const NATIVE_MENU_TARGETS = 'a[href], input, textarea, select, [contenteditable="true"], video, audio'
		const shouldIgnore = (e) =>
			(e.target instanceof Element && Boolean(e.target.closest(NATIVE_MENU_TARGETS))) ||
			isWithinAnyRef(e, excludedRefsRef.current)

		const onContextMenu = (e) => {
			if (shouldIgnore(e)) return
			e.preventDefault()
			lastPointRef.current = pointFromEvent(e)
			setPt(lastPointRef.current)
			setOpen(true)
		}

		const onPointerDown = (e) => {
			if (shouldIgnore(e)) return

			lastPointRef.current = pointFromEvent(e)
			startPtRef.current = lastPointRef.current

			if (e.pointerType === 'touch') startHold()
			else if (e.pointerType === 'mouse' && e.button === 0) startHold()
		}

		const onPointerMove = (e) => {
			if (!startPtRef.current) return
			const { x, y } = pointFromEvent(e)
			const dx = Math.abs(x - startPtRef.current.x)
			const dy = Math.abs(y - startPtRef.current.y)
			if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) clearTimer()
		}

		const end = () => {
			startPtRef.current = null
			clearTimer()
		}

		window.addEventListener('contextmenu', onContextMenu, { passive: false })
		window.addEventListener('pointerdown', onPointerDown, { passive: false })
		window.addEventListener('pointermove', onPointerMove, { passive: false })
		window.addEventListener('pointerup', end, { passive: false })
		window.addEventListener('pointercancel', end, { passive: false })
		window.addEventListener('pointerleave', end, { passive: false })
		window.addEventListener('scroll', clearTimer, { passive: true })

		return () => {
			window.removeEventListener('contextmenu', onContextMenu)
			window.removeEventListener('pointerdown', onPointerDown)
			window.removeEventListener('pointermove', onPointerMove)
			window.removeEventListener('pointerup', end)
			window.removeEventListener('pointercancel', end)
			window.removeEventListener('pointerleave', end)
			window.removeEventListener('scroll', clearTimer)
			clearTimer()
		}
	}, [holdMs])

	useCloseOnEscape(open, close)
	usePopoverPlacement(open, pt, popRef)

	if (!open) return null

	return (
		<>
			<Backdrop onPointerDown={close} />
			<Popover
				ref={popRef}
				data-open="true"
				onContextMenu={(e) => {
					e.preventDefault()
					e.stopPropagation()
				}}
			>
				{typeof menu === 'function' ? menu({ close }) : menu}
			</Popover>
		</>
	)
}