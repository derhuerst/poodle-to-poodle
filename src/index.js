'use strict'

const WebDB = require('@beaker/webdb')

const createVotesIndex = require('./lib/votes-index')
const createUi = require('./ui')

;(async () => {
	// TODO: sort votes by time in the UI I guess

	// load metadata
	const self = global.location.origin
	const archive = new DatArchive(self)
	const poll = JSON.parse(await archive.readFile('/poll.json'))

	// intialize votes index
	const db = new WebDB('poodle-to-poodle')
	const votesIndex = await createVotesIndex(self, db, archive)

	// todo: change UI
	const votes = await votesIndex.get()

	const render = createUi(document.querySelector('#app'))
	const rerender = () => {
		render(poll, votes) // todo
	}
	rerender()
})()
.catch((err) => {
	// todo: display error
	console.error(err)
})
