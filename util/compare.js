//exceptionReport = require("../util/exception_report.js"),
var	utils = require("../util/utils")


var exports = module.exports = {}



//this function assumes it is being passed two objects that have the same keys to check for matching identifiers 
exports.compareIdentifiersExact = function(source, target){


	if (typeof source != 'object' || typeof target != 'object')	return false

	var result ={

		match: false,
		matchOn: [],
		confidence: 1 

	}


	for (var sourceKey in source){
		for (var targetKey in target){
			if (sourceKey == targetKey){
				//normalize the value 
				var sourceVal = utils.normalize(source[sourceKey])
				var targetVal = utils.normalize(target[targetKey]) 

				if (sourceVal == targetVal){
					result.match = true
					result.matchOn.push(sourceKey)
					result.confidence = 1
				}
			}
		}
	}


	return result


}
