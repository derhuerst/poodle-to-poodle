'use strict'

const pick = require('lodash.pick')

const isValidVote = require('./is-valid-vote')

const putVote = async (voteDatArchive, vote) => {
	const data = JSON.stringify(pick(vote, ['id', 'author', 'chosen']))
	if (!isValidVote(data)) throw new Error('Invalid vote.')
	await voteArchive.writeFile('/vote.json', data)
	await voteArchive.commit()
}

module.exports = putVote
