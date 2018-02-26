'use strict'

const WebDB = require('@beaker/webdb')

const isValidVote = require('./is-valid-vote')

// Currently, we keep the each vote in a separate dat archive called "vote dat".
// By doing this, we circumvent the limitation that dat currently doesn't
// support writing by multiple people.
// Our approach has a major drawback though: Whenever the owner of a vote dat
// is offline (and no one else is replicating it), we can't show the votes.
// todo: Cache votes in the main dat archive.
const createVotesIndex = async (self, db, archive) => {
	db.define('votes', {
		validate: isValidVote,
		index: ['id'],
		filePattern: ['/vote.json']
	})
	await db.open()
	await db.open() // todo: remove

	db.indexArchive(self)
	const voteDats = JSON.parse(await archive.readFile('/vote-dats.json'))
	for (let voteDat of voteDats) {
		db.indexArchive(voteAddr, {watch: false}) // todo: watch
	}

	const getIndexedVotes = () => db.votes.query().toArray()

	// todo: write support
	return {get: getIndexedVotes}
}

module.exports = createVotesIndex
