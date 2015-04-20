/* compare two hierarchies passed */


var	utils = require("../util/utils"),
	compare = require("../util/compare")
	string_score = require("string_score")



var exports = module.exports = {}


//find hiearchy matches based on identifiers
exports.compareByIdents = function(a,b){
	if (!a || !b) return false


	for (var ax in a){
		
		aEntry = a[ax]

		for (var bx in b){

			bEntry = b[bx]

			//compare
			var r =  compare.compareIdentifiersExact(aEntry['idents'], bEntry['idents'] ) 

			if (r['match']){

				//console.log(aEntry['idents']['title'],"|",bEntry['idents']['title'], r['matchOn'], bEntry['idents']['mss'] )

				//aEntry = mms
				if (aEntry['matchedArchives'] === false){
					//not yet marked as a match
					aEntry['matchedArchives'] = [bEntry]
				}else{
					aEntry['matchedArchives'].push(bEntry)
				}

				//aEntry = archives
				if (aEntry['matchedMms'] === false){
					aEntry['matchedMms'] = [bEntry]
				}else{
					aEntry['matchedArchives'].push(bEntry)
				}

				//bEntry = mms
				if (bEntry['matchedArchives'] === false){
					bEntry['matchedArchives'] = [aEntry]
				}else{
					aEntry['matchedArchives'].push(aEntry)
				}

				//bEntry = archives
				if (bEntry['matchedMms'] === false){
					bEntry['matchedMms'] = [aEntry]
				}else{
					aEntry['matchedArchives'].push(aEntry)
				}




			}

		}


	}

	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if (a[x]['matchedMms'] || a[x]['matchedArchives']) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['matchedMms'] || b[x]['matchedArchives']) countB++
	}

	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

	return [a,b,stats]




}
