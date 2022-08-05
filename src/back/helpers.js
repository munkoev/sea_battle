// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam(req) {
	const id = req.params.id;
	if (/^\d+$/.test(id)) {
		return Number.parseInt(id, 10);
	}
	throw new TypeError(`Invalid ':id' param: "${id}"`);
}

function pickRandom(args) {
    return args[Math.floor(Math.random() * args.length)];
}

function randomDate() {
    return new Date(new Date() - 200000000000 * Math.random());
}


module.exports = { getIdParam, pickRandom, randomDate };
