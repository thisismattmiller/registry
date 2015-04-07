
var	utils = require("../util/utils"),
	string_score = require("string_score")



var exports = module.exports = {}


//passes two strings will find the similarity and return float if fuzzy then use that 0.0-1
exports.compareTitles = function(a,b,fuzzy){
	if (!a || !b) return false

	if (a.toString().length >= b.toString().length){
		if (fuzzy){
			return a.toString().score(b,fuzzy)
		}else{
			return a.toString().score(b)
		}
	}else{
		if (fuzzy){
			return b.toString().score(a,fuzzy)
		}else{
			return b.toString().score(a)
		}
	}
}

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
			if (sourceKey == targetKey && (sourceKey!='title')){

				//normalize the value 
				var sourceVal = utils.normalize(source[sourceKey])
				var targetVal = utils.normalize(target[targetKey])

				//if one of the values came back false skip this attribute "b1234567890" != false
				if (!sourceVal) continue
				if (!targetVal) continue

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



			//if they are mms col numbers then they are okay to exact match on
			if (source['callNumber'].toLowerCase().search("mss") > -1 && target['callNumber'].toLowerCase().search("mss") > -1){

				result.match = true

			}else{

				if (source['bNumber'] && target['bNumber']){

					//if they also both have bnumbers and they do not match then that is not a match, 
					//it is likely that they are a shelf locator or something
					if ( utils.normalize(source['bNumber']) != utils.normalize(target['bNumber']) ){
						result.match = false	
						result.matchOn = []	
					}
				}else if ( source['title'] && target['title']  ){


					//no title no comparison don't want to things like Untitled
					if (source['title'].length < 9 || target['title'].length < 9){
						result.match = false	
					}else{


						//see if the titles are the same or similar
						
						if (source['title'].length == target['title'].length ){
							var titleLong  = source['title']
							var titleShort = target['title']
						}else if (source['title'].length > target['title'].length ){
							var titleLong  = source['title']
							var titleShort = target['title']
						}else{
							var titleLong  = target['title']
							var titleShort = source['title']	
						}

						if ( utils.normalize(titleLong) == utils.normalize(titleShort) ){
							result.confidence = 1
						}else if ( titleLong.score(titleShort) >= 0.75) {
							result.confidence = 1
						}else{
							result.match = false
						}
					}

				}else{



					//they don't both have b numbers so it becomes more suspect TODO
					result.match = false
					result.confidence = 0.25

				}

			}


		}


	}



	return result


}
