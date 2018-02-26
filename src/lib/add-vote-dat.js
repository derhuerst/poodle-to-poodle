'use strict'

const addVoteDat = async (archive, voteDat) => {
	let voteDats
	try {
		voteDats = JSON.parse(await archive.readFile('/vote-dats.json'))
	} catch (err) {
		if (err.notFound) voteDats = []
		else throw err
	}
	if (!voteDats.includes(voteDat)) {
		voteDats.push(voteDat)
		await archive.writeFile('/vote-dats.json', JSON.stringify(voteDats))
		await archive.commit()
	}
}

module.exports = addVoteDat
