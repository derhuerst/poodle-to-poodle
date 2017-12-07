'use strict'

const h = require('snabbdom/h').default
const {DateTime} = require('luxon')
const ms = require('ms')

const renderCreated = (when) => {
	// todo: get locale from browser
	const dt = DateTime.fromMillis(when)

	return h('abbr', {
		atts: {title: dt.toLocaleString(DateTime.DATETIME_FULL)}
	}, [
		h('time', {
			attrs: {datetime: dt.toISO()}
		}, [
			ms(Date.now() - when, {long: true}),
			' ago'
		])
	])
}

const renderPollHeader = (poll) => {
	return [
		h('h2', {
			attrs: {id: 'poll-title'}
		}, [poll.title]),
		h('p', {
			attrs: {id: 'poll-meta'}
		}, [
			'created ',
			renderCreated(poll.created * 1000, poll.locale),
			' by ',
			poll.author
		])
	]
}

module.exports = renderPollHeader
