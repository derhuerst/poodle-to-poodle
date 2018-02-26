'use strict'

const h = require('snabbdom/h').default

const renderPollChoiceSummary = (votes, choiceId) => {
	let count = 0
	for (let vote of votes) {
		const chosen = vote.chosen[choiceId]
		if (chosen === 'yes' || chosen === 'maybe') count++
	}

	return h('abbr', {
		attrs: {
			title: count + ' people are available'
		}
	}, ['✔︎ ' + count])
}

module.exports = renderPollChoiceSummary
