'use strict'

const h = require('snabbdom/h').default
const {DateTime} = require('luxon')

const renderPollChoice = (choice) => {
	// todo: get locale from browser
	const startISO = choice.date + 'T' + choice.timeFrom + 'Z'
	const start = DateTime.fromISO(startISO)
	const endISO = choice.date + 'T' + choice.timeTo + 'Z'
	const end = DateTime.fromISO(endISO)

	const month = start.toFormat('LLL')
	const day = start.toFormat('c')
	const dayOfWeek = start.toFormat('ccc')
	const startTime = start.toLocaleString(DateTime.TIME_SIMPLE)
	const endTime = end.toLocaleString(DateTime.TIME_SIMPLE)

	// todo: properly render day overflows
	return h('div', {
		class: {'poll-choice': true}
	}, [
		h('div', {class: {'poll-choice-month': true}}, month),
		h('div', {class: {'poll-choice-day': true}}, day),
		h('div', {class: {'poll-choice-day-of-week': true}}, dayOfWeek),
		h('div', {class: {'poll-choice-time': true}}, [
			h('time', {
				class: {'poll-choice-start-time': true},
				attrs: {datetime: startISO}
			}, startTime),
			' – ',
			h('time', {
				class: {'poll-choice-end-time': true},
				attrs: {datetime: endISO}
			}, endTime)
		])
	])
}

module.exports = renderPollChoice
