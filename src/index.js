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

	const isValidVote = (vote) => {
		const isValidChoice = (choice) => {
			return choice.hasOwnProperty('choiceId') &&
				choice.hasOwnProperty('value') &&
				choice['choiceId'].length > 0 &&
				['yes', 'no', 'maybe'].includes(choice['value'])
		}
		const and = (x, y) => x && y
		const isValid = vote.hasOwnProperty('id') &&
			vote.hasOwnProperty('author') &&
			vote.hasOwnProperty('choices') &&
			vote['author'].length > 0 &&
			vote['choices'].length > 0 &&
			vote['choices'].map(isValidChoice).reduce(and)
		return isValid
	}

	const poll = JSON.parse(await archive.readFile('/poll.json'))
	const votes = []
	const regex = new RegExp('^[a-z0-9]{8}\.json$', 'i')
	for (let file of await archive.readdir('/votes')) {
		const isJson = regex.test(file)
		if (isJson) {
			try {
				const vote = JSON.parse(await archive.readFile('/votes/' + file))
				if (isValidVote(vote)) {
					votes.push(vote)
				}
			} catch(e) {
				// TODO: user UI feedback
				console.error(e)
			}
		}
	}

	const addVote = async (vote) => {
		if (!isValidVote(vote)) {
			// TODO: input validation feedback in the UI
			return
		}
		const dest = '/votes/' + vote.id + '.json'
		await archive.writeFile(dest, JSON.stringify(vote))
		votes.push(vote)
	}

	const onSubmit = async (author, chosen) => {
		await addVote({
			id: randomId(8),
			author,
			choices: Object.keys(chosen).map((choiceId) => {
				return {choiceId, value: chosen[choiceId]}
			})
		})
		await archive.commit()
		await rerender()
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
