var S = require('string')

var exports = module.exports = {}


exports.normalize = function(input){

	if (!input) return false

	//force to string
	input = input.toString()

	input = input.toLowerCase()

	input = S(input).unescapeHTML().s

	input = input.replace(/\s/g, "")


	return input

}