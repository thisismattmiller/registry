var S = require('string')

var exports = module.exports = {}


exports.normalize = function(input){


	if (typeof input !== 'string') return input

	input = input.toLowerCase()

	input = S(input).unescapeHTML().s

	input = input.replace(/\s/g, "")


	return input

}