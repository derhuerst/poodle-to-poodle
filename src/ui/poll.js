'use strict'

const h = require('snabbdom/h').default

const renderHeader = require('./poll-header')
const renderChoice = require('./poll-choice')
const renderChoiceSummary = require('./poll-choice-summary')
const renderPollSubmitRow = require('./poll-submit-row')

const renderPoll = (poll, votes, onSubmit) => {
	const choices = [
		h('td') // empty top left field
	]
	const summary = [
		h('td', {}, [votes.length + ' participants'])
	]
	for (let choiceId of Object.keys(poll.choices)) {
		const choice = poll.choices[choiceId]

		choices.push(h('td', {}, [
			renderChoice(choice)
		]))
		summary.push(h('td', {}, [
			renderChoiceSummary(votes, choiceId)
		]))
	}

	const votesRows = []
	for (let vote of votes) {
		const cells = [
			h('td', {
				class: {'poll-vote-author': true}
			}, [vote.author])
		]

		for (let choiceId of Object.keys(poll.choices)) {
			const chosen = vote.choices.find(c => c.choiceId === choiceId)
			const text = chosen && {
				yes: '✔',
				maybe: '(✔)',
				no: '✘'
			}[chosen.value] || '?'
			const cls = chosen && {
				yes: 'poll-yes',
				maybe: 'poll-maybe',
				no: 'poll-no'
			}[chosen.value] || 'poll-unknown'

			// todo: alt text or <abbr>
			cells.push(h('td', {class: {[cls]: true}}, [text]))
		}

		votesRows.push(h('tr', {}, cells))
	}

	let author = ''
	const chosen = Object.keys(poll.choices).reduce((o, cId) => {
		o[cId] = 'yes'
		return o
	}, {})

	const onAuthorChange = (newAuthor) => {
		author = newAuthor
	}
	const onChosen = (choiceId, choice) => {
		chosen[choiceId] = choice
	}
	const onSubmitBtnClick = () => {
		onSubmit(author, chosen)
	}

	return h('div', {}, [
		...renderHeader(poll),
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
