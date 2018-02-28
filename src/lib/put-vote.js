'use strict'

const pick = require('lodash.pick')

const isValidVote = require('./is-valid-vote')

const putVote = async (voteDatArchive, vote) => {
	vote = pick(vote, ['id', 'author', 'chosen'])
	if (!isValidVote(vote)) throw new Error('Invalid vote.')
	await voteDatArchive.writeFile('/vote.json', JSON.stringify(vote))
	await voteDatArchive.commit()
}

module.exports = putVote
