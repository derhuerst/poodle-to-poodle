'use strict'

const createUi = require('./ui')

;(async () => {
	// todo

	const render = createUi(document.querySelector('#app'))
	const rerender = () => {
		render(todo) // todo
	}
	rerender()
})()
.catch(console.error)
