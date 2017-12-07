'use strict'

const h = require('snabbdom/h').default

const renderPollChoiceSummary = (votes, choiceId) => {
	let count = 0
	for (let vote of votes) {
		for (let c of vote.choices) {
			if (
				c.choiceId === choiceId &&
				(c.value === 'yes' || c.value === 'maybe')
			) count++
		}
	}

	return h('abbr', {
		attrs: {
			title: count + ' people are available'
		}
	}, ['✔︎ ' + count])
}

module.exports = renderPollChoiceSummary
