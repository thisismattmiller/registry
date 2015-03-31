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

				if (!sourceVal) return result
				if (!targetVal) return result

				if (sourceVal == targetVal){
					result.match = true
					result.matchOn.push(sourceKey)
					result.confidence = 1
				}
			}
		}
	}

	//some double checking
	if (result.matchOn.length == 1){

		//if we only matched on call number it is a dubious match 
		if (result.matchOn[0] == 'callNumber'){

			if (source['bNumber'] && target['bNumber']){

				//if they also both have bnumbers and they do not match then that is not a match, 
				//it is likely that they are a shelf locator or something
				if ( utils.normalize(source['bNumber']) != utils.normalize(target['bNumber']) ){
					result.match = false	
					result.matchOn = []	
				}

			}else{

				//they don't both have b numbers so it becomes more suspect TODO
				result.confidence = 0.25

			}


		}


	}



	return result


}
