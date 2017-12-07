'use strict'

const h = require('snabbdom/h').default

const renderThreeStatesSwitch = require('./three-states-switch')

const renderPollSubmitRow = (choices, onAuthorChange, onChosen) => {
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
			placeholder: 'your name' // todo: use a <label>
			// todo: tabindex
		},
		on: {change: onAuthorInputChange}
	})

	const row = [
		h('td', {}, [authorInput])
	]
	Object.keys(choices).forEach((choiceId) => {
		const initialVal = choices[choiceId]

		row.push(h('td', {}, [
			renderThreeStatesSwitch(c => onChosen(choiceId, c), initialVal)
		]))
	})

	return h('tr', {class: {'poll-submit': true}}, row)
}

module.exports = renderPollSubmitRow
