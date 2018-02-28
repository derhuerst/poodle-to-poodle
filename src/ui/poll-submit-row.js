'use strict'

const h = require('snabbdom/h').default

const renderThreeStatesSwitch = require('./three-states-switch')

const renderPollSubmitRow = (author, chosen, onAuthorChange, onChosen) => {
	const onAuthorInputChange = (ev) => {
		onAuthorChange(ev.target.value)
	}
	const authorInput = h('input', {
		class: {'poll-submit-author': true},
		attrs: {
			type: 'text',
			required: true,
			autocomplete: 'given-name',
			inputmode: 'verbatim',
			maxlength: '50',
			minlength: '1',
			placeholder: 'your name', // todo: use a <label>
			value: author || ''
			// todo: tabindex
		},
		on: {change: onAuthorInputChange}
	})

	const row = [
		h('td', {}, [authorInput])
	]
	Object.entries(chosen).forEach(([choiceId, val]) => {
		row.push(h('td', {}, [
			renderThreeStatesSwitch(c => onChosen(choiceId, c), val || 'yes')
		]))
	})

	return h('tr', {class: {'poll-submit': true}}, row)
}

module.exports = renderPollSubmitRow
