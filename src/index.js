'use strict'

require('babel-polyfill')

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
	const isJson = (fileName) => regex.test(fileName)
	const localVotes = await archive.readdir('/votes')
	await Promise.all(
		localVotes
		.map(async (file) => {
			if (isJson(file)) {
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
		})
	)

	// TODO: sort votes by time in the UI I guess

	const addVote = async (targetArchive, vote) => {
		if (!isValidVote(vote)) {
			// TODO: input validation feedback in the UI
			return
		}
		const dest = '/votes/' + vote.id + '.json'
		await targetArchive.writeFile(dest, JSON.stringify(vote))
	}

	const newVoteRecord = (author, chosen) => {
		return {
			id: randomId(8),
			author,
			choices: Object.keys(chosen).map((choiceId) => {
				return {choiceId, value: chosen[choiceId]}
			})
		}
	}

	const onSubmit = async (author, chosen) => {
		const vote = newVoteRecord(author, chosen)
		if (!isValidVote(vote)) {
			return
		}
		await addVote(archive, vote)
		votes.push(vote)
		await archive.commit()
		rerender()
	}

	const copyFile = async (targetArchive, filePath) => {
		const content = await archive.readFile(filePath)
		await targetArchive.writeFile(filePath, content)
	}

	const createVotingPageForPoll = async (author, chosen) => {

		const voteRecord = newVoteRecord(author, chosen)
		if (!isValidVote(voteRecord)) {
			// TODO: input validation feedback in the UI
			return
		}

		const newPoll = await DatArchive.create({
		  title: 'Vote page for ' + poll.title,
		  description: 'This is a tempory page that you can use to vote'
		}) // TODO: add more details about what comes next

		const copy = (path) => copyFile(newPoll, path)

		await newPoll.mkdir('/votes')

		const votes = await archive.readdir('/votes')
		await Promise.all(
			votes
			.filter(isJson)
			.map(async (file) => {
				await copy('/votes/' + file)
			})
			.concat(
				[
				 copy('poll.json'),
				 copy('index.html'),
				 copy('base.css'),
				 copy('poll.css'),
				 copy('system-font.css'),
				 copy('three-states-switch.css'),
				 copy('bundle.js')
				]
			)
		)

		await addVote(newPoll, voteRecord)

		await newPoll.commit()
		window.location = newPoll.url
	}

	const syncWithOtherDat = async (datUrl) => {
		const targetAchrive = new DatArchive(datUrl)
		const voteFiles = await targetAchrive.readdir('/votes')
		await Promise.all(
			voteFiles
			.filter(isJson)
			.map(async (file) => {
				const targetFilePath = '/votes/' + file
				try {
					await archive.readFile(targetFilePath)
				} catch(e) {
					const jsonVote = await targetAchrive.readFile(targetFilePath)
					const vote = JSON.parse(jsonVote)
					if (isValidVote(vote)) {
						await archive.writeFile(targetFilePath, jsonVote)
						votes.push(vote)
					}
				}
			})
		)
		await archive.commit()
		rerender()
	}

	let tree = document.querySelector('#app')
	const rerender = () => {
		const newTree = h('main', {attrs: {id: 'content'}}, [
			renderPoll(poll, votes, onSubmit, createVotingPageForPoll, syncWithOtherDat)
		])
		patch(tree, newTree)
		tree = newTree
	}
	rerender()
})()
.catch(console.error)
