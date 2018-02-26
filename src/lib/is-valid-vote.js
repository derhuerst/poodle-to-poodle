'use strict'

const hasProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const isValidChoice = (choice) => {
	return (
		hasProp(choice, 'choiceId') &&
		hasProp(choice, 'value') &&
		choice.choiceId.length > 0 &&
		['yes', 'no', 'maybe'].includes(choice.value)
	)
}

const isValidVote = (vote) => {
	return (
		hasProp(vote, 'id') &&
		hasProp(vote, 'author') &&
		'string' === typeof vote.author &&
		vote.author.length > 0 &&
		Array.isArray(vote.choices) &&
		vote.choices.length > 0 &&
		vote.choices.every(isValidChoice)
	)
}

module.exports = isValidVote
