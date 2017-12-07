'use strict'

const h = require('snabbdom/h').default

const cls = 'three-states-switch'

const YES = 'yes'
const MAYBE = 'maybe'
const NO = 'no'

const symbols = {}
symbols[YES] = '✔'
symbols[MAYBE] = '(✔)'
symbols[NO] = '✘'

const descriptions = {}
descriptions[YES] = 'You attend. Click to set to "attending if need be".︎'
descriptions[MAYBE] = 'You attend if need be. Click to set to "not attending".︎'
descriptions[NO] = `You don't attend. Click to set to "attending".`

const nextValues = {}
nextValues[YES] = MAYBE
nextValues[MAYBE] = NO
nextValues[NO] = YES

const noop = () => {}

const renderThreeStatesSwitch = (onChange = noop, initialValue = YES) => {
	const onBtnClick = (ev) => {
		const btn = ev.target
		const wrapper = btn.parentNode
		const select = wrapper.querySelector('select')

		const currOpt = select.item(select.selectedIndex)
		const currValue = currOpt.value
		currOpt.removeAttribute('selected')

		const nextValue = nextValues[currValue]
		const nextOpt = select.namedItem(nextValue)
		nextOpt.setAttribute('selected', 'selected')

		btn.innerText = symbols[nextValue]
		btn.title = descriptions[nextValue]
		wrapper.classList.remove(cls + '-' + currValue)
		wrapper.classList.add(cls + '-' + nextValue)

		onChange(nextValue)
	}

	const renderOpt = (val) => {
		return h('option', {
			attrs: {
				name: val,
				value: val,
				selected: initialValue === val
			}
		}, [val])
	}

	return h('label', {
		class: {
			[cls]: true,
			[cls + '-' + initialValue]: true
		}
	}, [
		h('select', {
			class: {[cls + '-select']: true},
			style: {display: 'none'},
			attrs: {'aria-hidden': 'true'}
		}, [
			renderOpt(YES),
			renderOpt(MAYBE),
			renderOpt(NO)
		]),
		h('button', {
			class: {[cls + '-toggle']: true},
			attrs: {
				type: 'button',
				title: descriptions[initialValue]
			},
			on: {click: onBtnClick}
		}, symbols[initialValue])
	])
}

Object.assign({YES, MAYBE, NO})
module.exports = renderThreeStatesSwitch
