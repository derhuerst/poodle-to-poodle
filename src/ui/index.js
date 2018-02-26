'use strict'

const snabbdom = require('snabbdom')
const attrsForSnabbdom = require('snabbdom/modules/attributes').default
const propsForSnabbdom = require('snabbdom/modules/props').default
const classForSnabbdom = require('snabbdom/modules/class').default
const styleForSnabbdom = require('snabbdom/modules/style').default
const eventsForSnabbdom = require('snabbdom/modules/eventlisteners').default
const h = require('snabbdom/h').default

const createRenderPoll = require('./poll')

const patch = snabbdom.init([
	attrsForSnabbdom,
	propsForSnabbdom,
	classForSnabbdom,
	styleForSnabbdom,
	eventsForSnabbdom,
])

const createUi = (container, actions) => {
	let tree = container
	const renderPoll = createRenderPoll(actions)

	const rerender = (state) => {
		const newTree = h('main', {attrs: {id: 'content'}}, [
			renderPoll(state)
		])
		patch(tree, newTree)
		tree = newTree
	}
	return rerender
}

module.exports = createUi
