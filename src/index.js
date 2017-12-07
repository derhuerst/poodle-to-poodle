'use strict'

const snabbdom = require('snabbdom')
const attrsForSnabbdom = require('snabbdom/modules/attributes').default
const propsForSnabbdom = require('snabbdom/modules/props').default
const classForSnabbdom = require('snabbdom/modules/class').default
const styleForSnabbdom = require('snabbdom/modules/style').default
const eventsForSnabbdom = require('snabbdom/modules/eventlisteners').default
const randomId = require('crypto-random-string')
const h = require('snabbdom/h').default

const renderPoll = require('./ui/poll')

const patch = snabbdom.init([
	attrsForSnabbdom,
	propsForSnabbdom,
	classForSnabbdom,
	styleForSnabbdom,
	eventsForSnabbdom,
])

;(async () => {
	const baseUrl = global.location.protocol + '//' + global.location.host
	const archive = new DatArchive(baseUrl)

	const poll = JSON.parse(await archive.readFile('/poll.json'))
	const votes = []
	for (let file of await archive.readdir('/votes')) {
		const vote = JSON.parse(await archive.readFile('/votes/' + file))
		votes.push(vote)
	}

	const addVote = async (vote) => {
		// todo: validation
		const dest = '/votes/' + vote.id + '.json'
		await archive.writeFile(dest, JSON.stringify(vote))
		votes.push(vote)
	}

	const onSubmit = (author, chosen) => {
		addVote({
			id: randomId(8),
			author,
			choices: Object.keys(chosen).map((choiceId) => {
				return {choiceId, value: chosen[choiceId]}
			})
		})
		.then(rerender)
		.catch(console.error)
	}

	let tree = document.querySelector('#app')
	const rerender = () => {
		const newTree = h('main', {attrs: {id: 'content'}}, [
			renderPoll(poll, votes, onSubmit)
		])
		patch(tree, newTree)
		tree = newTree
	}
	rerender()
})()
.catch(console.error)
