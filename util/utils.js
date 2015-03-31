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

//pass a object full of identifers and it will return the values normalized
exports.normalizeIdents = function(input){

	if (!input) return false

	var results = {}

	for (var x in input){

		results[x] = exports.normalize(input[x])


	}

	return results

}