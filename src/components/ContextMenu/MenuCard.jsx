import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GlobalNoSelect, useTextSelectionPolicy } from './helpers'

/* -------------------------------- MENU UI ------------------------------- */

const BaseItem = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: calc(var(--mc-size) * 0.45) calc(var(--mc-size) * 0.6);
	border-radius: calc(var(--mc-size) * 0.45);

	cursor: pointer;
	position: relative;
	overflow: hidden;
	user-select: none;

	transition: background 0.2s ease, transform 0.2s ease;

	&:hover {
		background: color-mix(in srgb, var(--mc-surface-2) 100%, transparent);
	}

	&:active {
		transform: translateY(0.5px);
	}
`

const Label = styled.span`
	font-weight: 400;
	line-height: 1.15;
	transition: transform 0.2s ease, opacity 0.2s ease;
`

const IconWrap = styled.span`
	z-index: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: var(--mc-icon);
	height: var(--mc-icon);

	transition: transform 0.2s ease, color 0.2s ease, opacity 0.2s ease;
`

function MenuIcon({ icon }) {
	if (!icon?.faIcon) return null

	const style = {
		width: icon.iconWidth ? `${icon.iconWidth}px` : 'var(--mc-icon)',
		height: icon.iconHeight ? `${icon.iconHeight}px` : 'var(--mc-icon)',
		color: icon.iconColor ?? 'currentColor',
	}

	return (
		<IconWrap style={style}>
			<FontAwesomeIcon icon={icon.faIcon} style={{ width: '100%', height: '100%' }} />
		</IconWrap>
	)
}

/* -------------------------------- Separator ----------------------------- */

const SeparatorLine = styled.div`
	width: 100%;
	border-top: 1px solid var(--mc-border);
	border-radius: 9999px;
	margin: calc(var(--mc-size) * 0.45) 0;
	opacity: 0.9;
`

function Separator() {
	return <SeparatorLine role="separator" aria-orientation="horizontal" />
}

/* --------------------------------- Button -------------------------------- */

const ButtonItem = styled(BaseItem)``

function NormalButton({ labelText, textColor, icon, onClick }) {
	return (
		<ButtonItem
			style={{ color: textColor ?? 'var(--mc-fg)' }}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') onClick?.()
			}}
		>
			<Label>{labelText}</Label>
			<MenuIcon icon={icon} />
		</ButtonItem>
	)
}

/* ------------------------------ Checkbox item ---------------------------- */

const CheckboxItem = styled(BaseItem)`
	.fav-label {
		position: absolute;
		left: calc(var(--mc-size) * 0.6);
		transform: translateY(-110%) scale(0.9);
		opacity: 0;
		pointer-events: none;
	}

	.input {
		position: absolute;
		inset: 0;
		appearance: none;
		cursor: pointer;
		z-index: 3;
	}

	.input:checked ~ .fav-label {
		transform: translateY(0) scale(1);
		opacity: 1;
	}

	.input:checked ~ .label:not(.fav-label) {
		transform: translateY(120%) scale(0.9);
		opacity: 0;
	}
`

function CheckboxToggle({
	labelText,
	textColor,
	icon,
	defaultChecked = false,
	onCheckedChange,
	uncheckedLabelText,
	checkedLabelText,
}) {
	const [checked, setChecked] = useState(defaultChecked)

	const baseLabel = uncheckedLabelText ?? labelText
	const altLabel = checkedLabelText ?? 'Remove from favourite'

	const resolvedIcon =
		icon?.uncheckedFaIcon && icon?.checkedFaIcon
			? { ...icon, faIcon: checked ? icon.checkedFaIcon : icon.uncheckedFaIcon }
			: icon

	return (
		<CheckboxItem style={{ color: textColor ?? 'var(--mc-fg)' }}>
			<input
				type="checkbox"
				className="input"
				checked={checked}
				onChange={(e) => {
					setChecked(e.target.checked)
					onCheckedChange?.(e.target.checked)
				}}
				aria-label={baseLabel}
			/>
			<Label className="label">{baseLabel}</Label>
			<Label className="label fav-label">{altLabel}</Label>
			<MenuIcon icon={resolvedIcon} />
		</CheckboxItem>
	)
}

/* --------------------------- Hold-down confirm item ---------------------- */

const fillBar = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`

const HoldItem = styled(BaseItem)`
	position: relative;

	&:hover {
		background: var(--mc-danger-bg);
	}

	.action {
		position: absolute;
		left: calc(var(--mc-size) * 0.6);
		opacity: 0;
		visibility: hidden;
		transform: translateY(-60%) scale(0.9);
		transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s ease;
		pointer-events: none;
		white-space: nowrap;
	}

	&::before {
		content: '';
		position: absolute;
		background-color: var(--mc-danger-fill);
		left: 0;
		top: 0;
		height: 100%;
		width: 0%;
	}

	${({ $holding }) =>
		$holding &&
		css`
			${Label} {
				opacity: 0;
				visibility: hidden;
				transform: translateY(120%) scale(0.9);
			}

			.action {
				opacity: 1;
				visibility: visible;
				transform: translateY(0) scale(1);
			}

			&::before {
				animation: ${fillBar} var(--mc-hold) ease-in-out forwards 0.15s;
			}
		`}
`

function HoldDownButton({ labelText, textColor, icon, holdMs = 2500, holdLabelText = 'Hold to Confirm', onHoldComplete }) {
	const [holding, setHolding] = useState(false)
	const timerRef = useRef(null)

	useEffect(() => {
		return () => {
			if (timerRef.current) window.clearTimeout(timerRef.current)
		}
	}, [])

	const start = () => {
		setHolding(true)
		if (timerRef.current) window.clearTimeout(timerRef.current)
		timerRef.current = window.setTimeout(() => {
			setHolding(false)
			onHoldComplete?.()
		}, holdMs)
	}

	const stop = () => {
		setHolding(false)
		if (timerRef.current) window.clearTimeout(timerRef.current)
		timerRef.current = null
	}

	return (
		<HoldItem
			$holding={holding}
			style={{
				color: textColor ?? 'var(--mc-danger)',
				'--mc-hold': `${holdMs}ms`,
			}}
			onPointerDown={start}
			onPointerUp={stop}
			onPointerCancel={stop}
			onPointerLeave={stop}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') start()
			}}
			onKeyUp={(e) => {
				if (e.key === 'Enter' || e.key === ' ') stop()
			}}
		>
			<Label>{labelText}</Label>
			<Label className="action">{holdLabelText}</Label>
			<MenuIcon icon={icon} />
		</HoldItem>
	)
}

/* ------------------------------ Exit toggler ----------------------------- */

const RenameItem = styled(BaseItem)`
	&:hover {
		background: var(--mc-surface-2);
	}

	.toogler {
		position: absolute;
		appearance: none;
		width: 100%;
		height: 100%;
		inset: 0;
		z-index: 3;
	}

	.input-container {
		transform: translateY(-110%);
		position: absolute;
		inset: 0;
		z-index: 4;
		transition: transform 0.25s ease;

		display: flex;
		align-items: center;
		gap: calc(var(--mc-size) * 0.35);
	}

	.input {
		flex: 1;
		min-width: 0;

		height: 100%;
		background: transparent;
		border: none;
		outline: none;

		padding: 0 0 0 calc(var(--mc-size) * 0.6);

		font-size: 1em;
		line-height: 1;
		color: var(--mc-fg-strong);

		z-index: 5;
	}

	.icons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: calc(var(--mc-size) * 0.35);

		margin-left: auto;
		padding-right: calc(var(--mc-size) * 0.35);

		transform: translateY(-140%);
		opacity: 0;
		transition: transform 0.25s ease, opacity 0.25s ease;

		z-index: 6;
	}

	.icon-btn {
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.icons ${IconWrap} {
		width: calc(var(--mc-icon) * 0.95);
		height: calc(var(--mc-icon) * 0.95);
		background-color: var(--mc-chip);
		border-radius: calc(var(--mc-size) * 0.3);
		padding: calc(var(--mc-size) * 0.22);
	}

	.icons ${IconWrap}:hover {
		background-color: var(--mc-chip-hover);
	}

	${({ $open }) =>
		$open &&
		css`
			background-color: var(--mc-surface-2);
			overflow: hidden;

			.toogler {
				pointer-events: none;
			}

			${Label} {
				opacity: 0;
				transform: translateY(120%) scale(0.95);
			}

			> ${IconWrap} {
				transform: translateY(140%);
			}

			.input-container {
				transform: translateY(0);
			}

			.icons {
				transform: translateY(0);
				opacity: 1;
			}
		`}
`

function ExitToggler({ labelText, textColor, icon, defaultValue = '', onConfirm, onCancel, confirmIcon, cancelIcon }) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(defaultValue)
	const inputRef = useRef(null)

	useEffect(() => {
		if (!open) return
		requestAnimationFrame(() => inputRef.current?.focus())
	}, [open])

	return (
		<RenameItem $open={open} style={{ color: textColor ?? 'var(--mc-fg)' }}>
			<Label>{labelText}</Label>

			<input
				className="toogler"
				type="checkbox"
				checked={open}
				onChange={(e) => setOpen(e.target.checked)}
				aria-label="Toggle edit"
			/>

			<label className="input-container" aria-hidden={!open}>
				<input
					ref={inputRef}
					className="input"
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							setOpen(false)
							onConfirm?.(value)
						}
						if (e.key === 'Escape') {
							setOpen(false)
							setValue(defaultValue)
							onCancel?.()
						}
					}}
				/>

				<div className="icons">
					<button
						type="button"
						className="icon-btn"
						aria-label="Confirm"
						onClick={() => {
							setOpen(false)
							onConfirm?.(value)
						}}
					>
						<MenuIcon icon={confirmIcon} />
					</button>

					<button
						type="button"
						className="icon-btn"
						aria-label="Cancel"
						onClick={() => {
							setOpen(false)
							setValue(defaultValue)
							onCancel?.()
						}}
					>
						<MenuIcon icon={cancelIcon} />
					</button>
				</div>
			</label>

			<MenuIcon icon={icon} />
		</RenameItem>
	)
}

/* ------------------------------ Menu assembly ---------------------------- */

const CardWrap = styled.div`
	--mc-size: ${(p) => p.$size};
	--mc-font: calc(var(--mc-size) * 0.95);
	--mc-icon: calc(var(--mc-size) * 1.05);
	--mc-hold: ${(p) => p.$holdMs}ms;

	--mc-bg: #222222;
	--mc-surface-2: #333333;
	--mc-border: #313131;
	--mc-fg: #e9e9e9;
	--mc-fg-strong: #ffffff;

	--mc-danger: #e3616a;
	--mc-danger-bg: #6b2c2b;
	--mc-danger-fill: #89302d;

	--mc-chip: #565656;
	--mc-chip-hover: #757575;

	background: var(--mc-bg);
	border: 2px solid var(--mc-border);
	border-radius: calc(var(--mc-size) * 0.75);
	padding: calc(var(--mc-size) * 0.25);

	font-size: var(--mc-font);
	color: var(--mc-fg);

	width: min(92vw, 20rem);
`

const List = styled.ul`
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: calc(var(--mc-size) * 0.25);
	padding: 0;
	margin: 0;
`

function MenuItemRenderer(item) {
	switch (item.menuItemType) {
		case 'seperator':
			return <Separator />
		case 'checkbox':
			return <CheckboxToggle {...item} />
		case 'hold_down_button':
			return <HoldDownButton {...item} />
		case 'exit_toggler':
			return <ExitToggler {...item} />
		case 'button':
		default:
			return <NormalButton {...item} />
	}
}

/**
 * MenuCard props:
 * - items: array of menu item descriptors — see menuItemType below
 * - size: base rem size driving the whole menu's scale (font, icons, padding)
 * - holdMsDefault: default hold duration passed down as --mc-hold (used by hold_down_button items)
 * - maxWidthRem: cap on the menu's width
 * - enableTextSelection:
 *    true (default): selection unchanged
 *    false: disable selection globally (body)
 *    HTMLElement | ref | selector string: disable selection on those targets
 *    Array of the above: disable selection on multiple targets
 *
 * Each item in `items` is one of:
 *   { menuItemType: 'button', labelText, icon: { faIcon }, textColor?, onClick }
 *   { menuItemType: 'checkbox', labelText, icon: { uncheckedFaIcon, checkedFaIcon }, defaultChecked?, onCheckedChange?, checkedLabelText? }
 *   { menuItemType: 'hold_down_button', labelText, icon, holdMs?, holdLabelText?, onHoldComplete, textColor? }
 *   { menuItemType: 'exit_toggler', labelText, icon, confirmIcon, cancelIcon, defaultValue?, onConfirm, onCancel }
 *   { menuItemType: 'seperator' }
 */
export function MenuCard({ items, size = 1.0, holdMsDefault = 2500, maxWidthRem = 20, enableTextSelection = true }) {
	const cardSize = useMemo(() => `${size}rem`, [size])
	const lockGlobal = useTextSelectionPolicy(enableTextSelection)

	return (
		<>
			<GlobalNoSelect $lock={lockGlobal} />
			<CardWrap $size={cardSize} $holdMs={holdMsDefault} style={{ width: `min(92vw, ${maxWidthRem}rem)` }}>
				<List>
					{items.map((item, idx) => (
						<React.Fragment key={`${item.menuItemType}-${idx}`}>{MenuItemRenderer(item)}</React.Fragment>
					))}
				</List>
			</CardWrap>
		</>
	)
}
