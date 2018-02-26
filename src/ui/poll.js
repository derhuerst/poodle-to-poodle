'use strict'

const h = require('snabbdom/h').default

const renderHeader = require('./poll-header')
const renderChoice = require('./poll-choice')
const renderChoiceSummary = require('./poll-choice-summary')
const renderPollSubmitRow = require('./poll-submit-row')

const renderPoll = (poll, votes, onSubmit, forkCurrentPoll, syncWithRemoteDat) => {
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
	const onVoteBtnClick = () => {
		forkCurrentPoll(author, chosen)
	}
	const onSyncBtnClick = () => {
		const datUrl = prompt("Give me the url")
		if (datUrl != null) {
			syncWithRemoteDat(datUrl)
		}
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
		}, ['vote (you are the owner)']),
		h('button', {
			attrs: {
				type: 'button',
				id: 'poll-vote'
			},
			on: {click: onVoteBtnClick}
		}, ['vote (you are not the owner)']),
		h('button', {
			attrs: {
				type: 'button',
				id: 'poll-sync'
			},
			on: {click: onSyncBtnClick}
		}, ['sync back (you are the owner)'])
	])
}

module.exports = renderPoll
