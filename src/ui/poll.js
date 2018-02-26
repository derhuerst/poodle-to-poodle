'use strict'

const h = require('snabbdom/h').default

const renderHeader = require('./poll-header')
const renderChoice = require('./poll-choice')
const renderChoiceSummary = require('./poll-choice-summary')
const renderPollSubmitRow = require('./poll-submit-row')

const renderPoll = (state, actions) => {
	const choices = [
		h('td') // empty top left field
	]
	const summary = [
		h('td', {}, [state.votes.length + ' participants'])
	]
	for (let choiceId of Object.keys(state.poll.choices)) {
		const choice = state.poll.choices[choiceId]

		choices.push(h('td', {}, [
			renderChoice(choice)
		]))
		summary.push(h('td', {}, [
			renderChoiceSummary(state.votes, choiceId)
		]))
	}

	const votesRows = []
	for (let vote of state.votes) {
		const cells = [
			h('td', {
				class: {'poll-vote-author': true}
			}, [vote.author])
		]

		for (let choiceId of Object.keys(state.poll.choices)) {
			const chosen = vote.chosen[choiceId]
			const text = chosen && {
				yes: '✔',
				maybe: '(✔)',
				no: '✘'
			}[chosen] || '?'
			const cls = chosen && {
				yes: 'poll-yes',
				maybe: 'poll-maybe',
				no: 'poll-no'
			}[chosen] || 'poll-unknown'

			// todo: alt text or <abbr>
			cells.push(h('td', {class: {[cls]: true}}, [text]))
		}

		votesRows.push(h('tr', {}, cells))
	}

	// state
	let author = ''
	const chosen = {}
	for (let choiceId of Object.keys(state.poll.choices)) chosen[choiceId] = 'yes'

	const onAuthorChange = (newAuthor) => {
		author = newAuthor
	}
	const onChosen = (choiceId, choice) => {
		chosen[choiceId] = choice
	}
	const onSubmitBtnClick = () => {
		actions.putOwnVote(author, chosen)
	}

	return h('div', {}, [
		...renderHeader(state.poll),
		h('table', {
			class: {'poll': true},
			attrs: {id: 'poll'}
		}, [
			// todo: use thead & tbody
			h('tr', {class: {'poll-choices': true}}, choices),
			h('tr', {class: {'poll-summary': true}}, summary),
			renderPollSubmitRow(chosen, onAuthorChange, onChosen),
			...votesRows
		]),
		h('button', {
			attrs: {
				type: 'button',
				id: 'poll-submit'
			},
			on: {click: onSubmitBtnClick}
		}, ['submit'])
	])
}

module.exports = renderPoll
