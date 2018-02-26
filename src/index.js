'use strict'

const randomString = require('crypto-random-string')
const WebDB = require('@beaker/webdb')

const createVotesIndex = require('./lib/votes-index')
const createUi = require('./ui')

const newVote = (author, chosen) => {
	return {
		id: randomString(8),
		isOwner: true,
		author,
		chosen
	}
}

;(async () => {
	// TODO: sort votes by time in the UI I guess

	// load metadata
	const self = global.location.origin
	const archive = new DatArchive(self)
	const poll = JSON.parse(await archive.readFile('/poll.json'))
	let ownVoteDat = window.localStorage.getItem('own-vote-dat') || null

	// intialize votes index
	const db = new WebDB('poodle-to-poodle')
	const votesIndex = await createVotesIndex(self, db, archive, ownVoteDat)

	const state = {
		poll,
		votes: await votesIndex.get()
	}

	const _putOwnVote = async (author, chosen) => {
		let vote = state.votes.find(v => v.isOwner)
		if (vote) {
			vote.author = author
			vote.chosen = chosen
		} else {
			vote = newVote(author, chosen)
			state.votes.push(vote)
		}

		let archive
		if (!ownVoteDat) {
			// todo: handle rejection
			archive = await DatArchive.create({
				// todo: add meaningful metadata
				title: 'poodle-to-poodle vote'
			})
			ownVoteDat = archive.url
			window.localStorage.setItem('own-vote-dat', ownVoteDat)
		} else archive = new DatArchive(ownVoteDat)

		await archive.writeFile('/vote.json', JSON.stringify(vote))

		state.votes.push(vote)
		rerender()
	}

	const putOwnVote = (author, chosen) => {
		_putOwnVote()
		.catch(console.error) // todo: display error
	}
	const actions = {putOwnVote}

	const render = createUi(document.querySelector('#app'), actions)
	const rerender = () => render(state)
	rerender()
})()
.catch((err) => {
	// todo: display error
	console.error(err)
})
