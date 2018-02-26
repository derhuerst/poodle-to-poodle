'use strict'

const hasProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const isObj = o => o !== null && 'object' === typeof o && !Array.isArray(o)

const validValues = ['yes', 'no', 'maybe']

const isValidVote = (vote) => {
	if (
		!hasProp(vote, 'id') ||
		!hasProp(vote, 'author') ||
		'string' !== typeof vote.author ||
		vote.author.length === 0 ||
		!isObj(vote.chosen)
	) return false

	const choiceIds = Object.keys(vote.chosen)
	if (choiceIds.length === 0) return false
	for (let choiceId of choiceIds) {
		if (!validValues.includes(vote.chosen[choiceId])) return false
	}

	return true
}

module.exports = isValidVote
