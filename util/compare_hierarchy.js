/* compare two hierarchies passed */


var	utils = require("../util/utils"),
	compare = require("../util/compare")
	string_score = require("string_score")



var exports = module.exports = {}




//loop through and see if the  all the stars align and everything is perfect
exports.compareByDepthParentTitleDateStrict = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}

	var aTotal = Object.keys(a).length
	var count = 0

	//store normalized versions of the titles
	for (var aX in a){
		a[aX]['titleNormalized'] = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
		a[aX]['parentTitleNormalized'] = compare.removePunctAndKeyWords(a[aX]['parentTitle'])
	}
	for (var bX in b){
		b[bX]['titleNormalized'] = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
		b[bX]['parentTitleNormalized'] = compare.removePunctAndKeyWords(b[bX]['parentTitle'])
	}	

	
	for (var aX in a){



		var aEntry = a[aX], aTitle = a[aX]['titleNormalized']
		process.stdout.write("\rcompareByDepthParentTitleDateStrict " + Math.floor(++count/aTotal*100) )


		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['titleNormalized']

			//do the depths match
			if (aEntry['depth'] === bEntry['depth']){

				//do the parents titles match
				if (compare.compareTitles(aEntry['parentTitleNormalized'],bTitle['parentTitleNormalized']) >= 0.95 || aEntry['parentName'] === bEntry['parentName'] ){


					//do the titles match
					if (compare.compareTitles(aTitle,bTitle) >= 0.95 || aTitle === bTitle ){


						//do the dates match

						//if there are no dates (like a series/container then that is okay as long as they both have no dates)
						if ( compare.compareDateArray(aEntry['idents']['dates'], bEntry['idents']['dates']) == true   ) {

							//console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle))

							//wow all that shit matched
							if (aEntry['compareByDepthParentTitleDateStrict']){
								aEntry['compareByDepthParentTitleDateStrict'].push(bEntry['idents'])
							}else{
								aEntry['compareByDepthParentTitleDateStrict'] = [bEntry['idents']]
							}

							if (bEntry['compareByDepthParentTitleDateStrict']){
								bEntry['compareByDepthParentTitleDateStrict'].push(aEntry['idents'])
							}else{
								bEntry['compareByDepthParentTitleDateStrict'] = [aEntry['idents']]
							}



						}		

					}
					

				}



			}

		}

	}


	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}

	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByDepthParentTitleDateStrict'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByDepthParentTitleDateStrict']) countB++
	}


	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

	return [a,b,stats]


}

exports.compareByDepthParentTitle = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}

	var aTotal = Object.keys(a).length
	var count = 0


	//store normalized versions of the titles
	for (var aX in a){
		a[aX]['titleNormalized'] = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
		a[aX]['parentTitleNormalized'] = compare.removePunctAndKeyWords(a[aX]['parentTitle'])
	}
	for (var bX in b){
		b[bX]['titleNormalized'] = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
		b[bX]['parentTitleNormalized'] = compare.removePunctAndKeyWords(b[bX]['parentTitle'])
	}	

	
	for (var aX in a){

		var aEntry = a[aX], aTitle = a[aX]['titleNormalized']
		process.stdout.write("\rcompareByDepthParentTitle " + Math.floor(++count/aTotal*100) )


		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['titleNormalized']

			//do the depths match
			if (aEntry['depth'] === bEntry['depth']){

				//do the parents titles match
				if (compare.compareTitles(aEntry['parentTitleNormalized'],bTitle['parentTitleNormalized']) >= 0.95 || aEntry['parentName'] === bEntry['parentName'] ){


					//do the titles match
					if (compare.compareTitles(aTitle,bTitle) >= 0.95 || aTitle === bTitle ){

						//console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle))

						//wow all that shit matched
						if (aEntry['compareByDepthParentTitle']){
							aEntry['compareByDepthParentTitle'].push(bEntry['idents'])
						}else{
							aEntry['compareByDepthParentTitle'] = [bEntry['idents']]
						}

						if (bEntry['compareByDepthParentTitle']){
							bEntry['compareByDepthParentTitle'].push(aEntry['idents'])
						}else{
							bEntry['compareByDepthParentTitle'] = [aEntry['idents']]
						}

	
					}
					

				}



			}

		}

	}


	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}

	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByDepthParentTitle'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByDepthParentTitle']) countB++
	}


	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

	return [a,b,stats]





}


exports.compareByDepthParentTitleFuzzy = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}

	var aTotal = Object.keys(a).length
	var count = 0


	//store normalized versions of the titles
	for (var aX in a){
		a[aX]['titleNormalized'] = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
		a[aX]['parentTitleNormalized'] = compare.removePunctAndKeyWords(a[aX]['parentTitle'])
	}
	for (var bX in b){
		b[bX]['titleNormalized'] = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
		b[bX]['parentTitleNormalized'] = compare.removePunctAndKeyWords(b[bX]['parentTitle'])
	}	

	
	for (var aX in a){

		var aEntry = a[aX], aTitle = a[aX]['titleNormalized']
		process.stdout.write("\rcompareByDepthParentTitleFuzzy " + Math.floor(++count/aTotal*100) )


		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['titleNormalized']

			//do the depths match
			if (aEntry['depth'] === bEntry['depth']){

				//do the parents titles match
				if (compare.compareTitles(aEntry['parentTitleNormalized'],bTitle['parentTitleNormalized']) >= 0.50 || aEntry['parentName'] === bEntry['parentName'] ){


					//do the titles match
					if (compare.compareTitles(aTitle,bTitle) >= 0.50 || aTitle === bTitle ){

						//console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle))

						//wow all that shit matched
						if (aEntry['compareByDepthParentTitleFuzzy']){
							aEntry['compareByDepthParentTitleFuzzy'].push(bEntry['idents'])
						}else{
							aEntry['compareByDepthParentTitleFuzzy'] = [bEntry['idents']]
						}

						if (bEntry['compareByDepthParentTitleFuzzy']){
							bEntry['compareByDepthParentTitleFuzzy'].push(aEntry['idents'])
						}else{
							bEntry['compareByDepthParentTitleFuzzy'] = [aEntry['idents']]
						}

	
					}
					

				}



			}

		}

	}


	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}

	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByDepthParentTitleFuzzy'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByDepthParentTitleFuzzy']) countB++
	}


	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

	return [a,b,stats]





}


//loop through and see if the  all the stars align and everything is perfect
exports.compareByDepthTitleDate = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}


	//store normalized versions of the titles
	for (var aX in a){
		a[aX]['titleNormalized'] = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
	}
	for (var bX in b){
		b[bX]['titleNormalized'] = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
	}	


	var aTotal = Object.keys(a).length
	var count = 0

	
	for (var aX in a){

		var aEntry = a[aX], aTitle = a[aX]['titleNormalized']

		process.stdout.write("\rcompareByDepthTitleDate " + Math.floor(++count/aTotal*100) )

		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['titleNormalized']


			if (aEntry['depth'] === bEntry['depth']){

				var threshold = 0.75
				//if there are no dates raise the threshold 
				if (aEntry['idents']['dates'].length == 0 && bEntry['idents']['dates'].length == 0){
					threshold = 0.95
				}

				//do the titles match
				if (compare.compareTitles(aTitle,bTitle) >= threshold || aTitle === bTitle ){
					
					// console.log(aTitle,"|",bTitle)


					//do the dates match

					//if there are no dates (like a series/container then that is okay as long as they both have no dates)
					if ( compare.compareDateArray(aEntry['idents']['dates'], bEntry['idents']['dates']) == true   ) {
						// console.log("\n\n\n")
						// console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle))

						// console.log(aEntry['idents']['dates'])

						// console.log(bEntry['idents']['dates'])


						//matched
						if (aEntry['compareByDepthTitleDate']){
							aEntry['compareByDepthTitleDate'].push(bEntry['idents'])
						}else{
							aEntry['compareByDepthTitleDate'] = [bEntry['idents']]
						}

						if (bEntry['compareByDepthTitleDate']){
							bEntry['compareByDepthTitleDate'].push(aEntry['idents'])
						}else{
							bEntry['compareByDepthTitleDate'] = [aEntry['idents']]
						}



					}		

				}
				
			}




			
		}

	}

	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}


	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByDepthTitleDate'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByDepthTitleDate']) countB++
	}

	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}


	return [a,b,stats]


}

//loop through and see if it matches by just title and date
exports.compareByTitleDate = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}


	//store normalized versions of the titles
	for (var aX in a){
		a[aX]['titleNormalized'] = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
	}
	for (var bX in b){
		b[bX]['titleNormalized'] = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
	}	


	var aTotal = Object.keys(a).length
	var count = 0


	
	for (var aX in a){

		var aEntry = a[aX], aTitle = a[aX]['titleNormalized']
		process.stdout.write("\rcompareByTitleDate " + Math.floor(++count/aTotal*100) )

		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['titleNormalized']

			//if there are no dates to match by then abort because we do a better title match below
			if (aEntry['idents']['dates'].length==0 && bEntry['idents']['dates'].length == 0) continue
			
			//do the titles match (lower here because they will also have to date match to pass)
			if (compare.compareTitles(aTitle,bTitle) >= 0.5 || aTitle === bTitle ){


				//do the dates match

				//compare dates
				if ( compare.compareDateArray(aEntry['idents']['dates'], bEntry['idents']['dates']) == true   ) {

					//console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle))

					//matched
					if (aEntry['compareByTitleDate']){
						aEntry['compareByTitleDate'].push(bEntry['idents'])
					}else{
						aEntry['compareByTitleDate'] = [bEntry['idents']]
					}

					if (bEntry['compareByTitleDate']){
						bEntry['compareByTitleDate'].push(aEntry['idents'])
					}else{
						bEntry['compareByTitleDate'] = [aEntry['idents']]
					}
				}
			}							
		}
	}


	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}


	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByTitleDate'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByTitleDate']) countB++
	}

	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}


	return [a,b,stats]


}


//loop through and see if it matches by just title and date
exports.compareByTitleUnique = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}


	var aTotal = Object.keys(a).length
	var count = 0

	
	//build a index of titles, we only will compare unique titles
	aIndex = {}, bIndex = {}

	for (var aX in a){
		aTitle = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
		if (!aIndex[aTitle]){
			aIndex[aTitle] = 1
		}else{
			aIndex[aTitle]++
		}
		//store it
		a[aX]['titleNormalized'] = aTitle
	}

	for (var bX in b){
		bTitle = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
		if (!bIndex[bTitle]){
			bIndex[bTitle] = 1
		}else{
			bIndex[bTitle]++
		}
		//store it
		b[bX]['titleNormalized'] = bTitle
	}


	for (var aX in a){

		var aEntry = a[aX], aTitle = a[aX]['idents']['title'], aTitleNormalized = a[aX]['titleNormalized']

		process.stdout.write("\rcompareByTitleUnique " + Math.floor(++count/aTotal*100) )


		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['idents']['title'], bTitleNormalized = b[bX]['titleNormalized']


			//are they unique?
			if (aIndex[aTitleNormalized] == 1 && bIndex[bTitleNormalized] == 1){
				
				//do the titles match
				if (compare.compareTitles(aTitleNormalized,bTitleNormalized) >= 0.75 || aTitle === bTitle ){

					//do the dates match.
					//console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle))

					//matched
					if (aEntry['compareByTitleUnique']){
						aEntry['compareByTitleUnique'].push(bEntry['idents'])
					}else{
						aEntry['compareByTitleUnique'] = [bEntry['idents']]
					}

					if (bEntry['compareByTitleUnique']){
						bEntry['compareByTitleUnique'].push(aEntry['idents'])
					}else{
						bEntry['compareByTitleUnique'] = [aEntry['idents']]
					}


				}

			}
			
							
		}

	}


	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}

	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByTitleUnique'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByTitleUnique']) countB++
	}

	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}


	return [a,b,stats]


}


//loop through and see if it matches by just title and date
exports.compareByTitleUniqueFuzzy = function(a,b){


	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}




	//build a index of titles, we only will compare unique titles
	aIndex = {}, bIndex = {}

	for (var aX in a){
		aTitle = compare.removePunctAndKeyWords(a[aX]['idents']['title'])
		if (!aIndex[aTitle]){
			aIndex[aTitle] = 1
		}else{
			aIndex[aTitle]++
		}
		//store it
		a[aX]['titleNormalized'] = aTitle

	}

	for (var bX in b){
		bTitle = compare.removePunctAndKeyWords(b[bX]['idents']['title'])
		if (!bIndex[bTitle]){
			bIndex[bTitle] = 1
		}else{
			bIndex[bTitle]++
		}
		//store it
		b[bX]['titleNormalized'] = bTitle		
	}

	var aTotal = Object.keys(a).length
	var count = 0


	for (var aX in a){

		var aEntry = a[aX], aTitle = a[aX]['idents']['title'], aTitleNormalized = a[aX]['titleNormalized']


		process.stdout.write("\rcompareByTitleUniqueFuzzy " + Math.floor(++count/aTotal*100) )

		for (var bX in b){
			
			var bEntry = b[bX], bTitle = b[bX]['idents']['title'], bTitleNormalized = b[bX]['titleNormalized']


			//are they unique?
			if (aIndex[aTitleNormalized] == 1 && bIndex[bTitleNormalized] == 1){
				
				//do the titles match
				if (compare.compareTitles(aTitle,bTitle,1) >= 0.75 || aTitle === bTitle ){

					//do not match if one is drastically longer than the other
					if (aTitleNormalized.split(" ").length / bTitleNormalized.split(" ").length > 0.25 && bTitleNormalized.split(" ").length / aTitleNormalized.split(" ").length > 0.25  ){


						//do the dates match.
						//console.log(aTitle,"|",bTitle,compare.compareNormalizedTitles(aTitle,bTitle,1))

						//matched
						if (aEntry['compareByTitleUniqueFuzzy']){
							aEntry['compareByTitleUniqueFuzzy'].push(bEntry['idents'])
						}else{
							aEntry['compareByTitleUniqueFuzzy'] = [bEntry['idents']]
						}

						if (bEntry['compareByTitleUniqueFuzzy']){
							bEntry['compareByTitleUniqueFuzzy'].push(aEntry['idents'])
						}else{
							bEntry['compareByTitleUniqueFuzzy'] = [aEntry['idents']]
						}


					}


				}

			}
			
							
		}

	}


	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}


	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByTitleUniqueFuzzy'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if (b[x]['compareByTitleUniqueFuzzy']) countB++
	}

	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}


	return [a,b,stats]


}



//find hiearchy matches based on identifiers
exports.compareByIdents = function(a,b){
	if (!a || !b) return false

	var debug = false, reversed = false

	//we want to only loop through the shortest one over and over
	if (Object.keys(b).length>Object.keys(a).length){
		var c = a
		a = b
		b = c
		reversed=true
	}



	var aTotal = Object.keys(a).length, bTotal = Object.keys(b).length
	var count = 0

	
	console.log("\n")

	//for very large ones lets normalize the idents first for all of them
	for (var ax in a){
		a[ax]['identsNormal'] = utils.normalizeIdents(a[ax]['idents'])
	}
	for (var bx in b){
		b[bx]['identsNormal'] = utils.normalizeIdents(b[bx]['idents'])
	}


	var addMatchKey = function(entry1,entry2){

		if (entry1['compareByIdents']){
			entry1['compareByIdents'].push(entry2['idents'])
		}else{
			entry1['compareByIdents'] = [entry2['idents']]
		}

	}


	for (var ax in a){

		aEntry = a[ax]

		process.stdout.write("\rcompareByIdents " + Math.floor(++count/aTotal*100) )
		
		var aEntryString = JSON.stringify(aEntry['data'])


		for (var bx in b){

			bEntry = b[bx]

			var bEntryString = JSON.stringify(bEntry['data'])

				//compare
			var r =  compare.compareIdentifiersExact(aEntry['identsNormal'], bEntry['identsNormal'] ) 



			if (r['match']){


				//console.log(aEntry['idents']['title'],"|",bEntry['idents']['title'], r['matchOn'], bEntry['idents']['mss'] )

				addMatchKey(aEntry,bEntry)
				addMatchKey(bEntry,aEntry)

			}



			if (aEntry['idents']['captureIds']){
				//look in the string version of this record for that ident, we have no idea where it might be
				//it could be in the notes for example

				for (var aCaptureId in aEntry['idents']['captureIds']){
					aCaptureId = aEntry['idents']['captureIds'][aCaptureId]
					if ( bEntryString.search(aCaptureId) > -1 ){
						//console.log(aCaptureId,aEntry['idents']['title'],"|",bEntry['idents']['title'])
						addMatchKey(aEntry,bEntry)
						addMatchKey(bEntry,aEntry)
					}
				}
			}

			if (bEntry['idents']['captureIds']){
				//look in the string version of this record for that ident, we have no idea where it might be
				//it could be in the notes for example
				for (var aCaptureId in bEntry['idents']['captureIds']){
					//console.log(bEntry['idents'])
					aCaptureId = bEntry['idents']['captureIds'][aCaptureId]
					if ( aEntryString.search(aCaptureId) > -1 ){
						//console.log(aCaptureId,bEntry['idents']['title'],"|",aEntry['idents']['title'])
						addMatchKey(bEntry,aEntry)
						addMatchKey(aEntry,bEntry)
					}
				}
			}





		}


	}

	//if we reversed it put it back in order to return
	if (reversed){
		var c = a
		a = b
		b = c
	}

	var totalA = 0, countA = 0

	for (var x in a){
		totalA++
		if ( a[x]['compareByIdents'] ) countA++
	}
	var totalB = 0, countB = 0
	for (var x in b){
		totalB++
		if ( b[x]['compareByIdents'] ) countB++
	}

	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

	return [a,b,stats]




}


exports.returnMaxDepth = function(hiearchy){

	var depth = 0
	for (var x in hiearchy){
		depth = (hiearchy[x]['depth'] > depth) ? hiearchy[x]['depth'] : depth
	}

	return depth
}



//exports.compareByParentAndTitle = function(a,b){
// 	if (!a || !b) return false


// 	var debug = false, reversed = false

// 	//we want to only loop through the shortest one over and over
// 	if (Object.keys(b).length>Object.keys(a).length){
// 		var c = a
// 		a = b
// 		b = c
// 		reversed=true
// 	}


// 	var count = 0, aTotal = Object.keys(a).length

// 	var aMaxDepth = exports.returnMaxDepth(a), bMaxDepth = exports.returnMaxDepth(b)

// 	//we are just doing matches if they are parents
// 	if (aMaxDepth == 1 || bMaxDepth == 1) return false

// 	var highestDepth = (aMaxDepth > bMaxDepth) ? highestDepth = aMaxDepth : highestDepth = bMaxDepth
	
// 	var parents = {}

// 	var extractParents = function(hiearchy,key){

// 		for (var x in hiearchy){

// 			if (hiearchy[x]['hasChildren']){

// 				//is this depth registered as a parent yet
// 				if (!parents[hiearchy[x]['depth']]){
// 					parents[hiearchy[x]['depth']] = {}
// 				}

// 				//is this key registered at the parent depth level yet
// 				if (!parents[hiearchy[x]['depth']][key]){
// 					parents[hiearchy[x]['depth']][key] = []
// 				}

// 				//push in the parent
// 				parents[hiearchy[x]['depth']][key].push(hiearchy[x])



// 			}

// 		}

// 	}


// 	//returns the IDs of the parent mmsMatch or archivesMatch (or whatever)
// 	var returnParentMatchId = function(parentId){

// 		var results = []

// 		//so we need to loop through everything, don't care about the source though
// 		//just looking for the ids that match to pull their possible matching IDs in the other system
// 		for (var aDepth in parents){

// 			//merg together since it doesnt matter
// 			var parentsAll = parents[aDepth]['a'].concat(parents[aDepth]['b'])

// 			for (var x in parentsAll){


// 				if (parentsAll[x]['id'] == parentId){

// 					//it might have matchedArchives or matchedMms
// 					if (parentsAll[x]['matchedArchives']){
// 						for ( var xx in parentsAll[x]['matchedArchives'] ){
// 							results.push(parentsAll[x]['matchedArchives'][xx]['id'])
// 						}
// 					}

// 					if (parentsAll[x]['matchedMms']){
// 						for ( var xx in parentsAll[x]['matchedMms'] ){
// 							results.push(parentsAll[x]['matchedMms'][xx]['id'])
// 						}
// 					}

// 				}

// 			}



// 		}

// 		return results


// 	}


// 	extractParents(a,"a")
// 	extractParents(b,"b")

// 	//make sure we have arrays even if empty for all keys and levels
// 	//did we find any hierarchy? If not make an empty array
// 	for (var depth in parents){
// 		if (!parents[depth]["a"]) parents[depth]["a"] = []
// 		if (!parents[depth]["b"]) parents[depth]["b"] = []
// 	}

	
// 	for (var aDepth in parents){

// 		var parentsA = parents[aDepth]['a']
// 		var parentsB = parents[aDepth]['b']

// 		//the first/root depth 
// 		if (aDepth == 1){

// 			for (var xA in parentsA){

// 				for (var xB in parentsB){

// 					var aTitle = parentsA[xA]['idents']['title']
// 					var bTitle = parentsB[xB]['idents']['title']

// 					//console.log(aTitle , "|", bTitle, compare.compareNormalizedTitles(aTitle,bTitle))

// 					if (compare.compareNormalizedTitles(aTitle,bTitle) >= 0.75){
					
// 						//does it have this property then add in the other, if it does not have the property
// 						//then it is not the right system. this so a/b can equal anything does not have to be predfined that a = mms
// 						if (typeof parentsA[xA]['matchedArchives'] != 'undefined'){
// 							if (parentsA[xA]['matchedArchives'] === false ) parentsA[xA]['matchedArchives'] = []
// 							parentsA[xA]['matchedArchives'].push(parentsB[xB])
// 						}

// 						if (typeof parentsA[xA]['matchedMms'] != 'undefined'){
// 							if (parentsA[xA]['matchedMms'] === false ) parentsA[xA]['matchedMms'] = []
// 							parentsA[xA]['matchedMms'].push(parentsB[xB])
// 						}

// 						if (typeof parentsB[xB]['matchedArchives'] != 'undefined'){
// 							if (parentsB[xB]['matchedArchives'] === false ) parentsB[xB]['matchedArchives'] = []
// 							parentsB[xB]['matchedArchives'].push(parentsA[xA])
// 						}

// 						if (typeof parentsB[xB]['matchedMms'] != 'undefined'){
// 							if (parentsB[xB]['matchedMms'] === false ) parentsB[xB]['matchedMms'] = []
// 							parentsB[xB]['matchedMms'].push(parentsA[xA])
// 						}


// 					}



// 				}


// 			}




// 		}else{


// 			//if this is not the first level of depth we want to make sure that the parent of the item
// 			//is matched to the parent of the matching item
// 			for (var xA in parentsA){

// 				var aIds = returnParentMatchId(parentsA[xA]['parent'])

// 				for (var xB in parentsB){

// 					var bIds = returnParentMatchId(parentsB[xB]['parent'])


// 					//does the two idents have both the xA and xB
// 					//console.log(aIds, aIds.indexOf(parentsB[xB]['parent']),  bIds,  bIds.indexOf(parentsA[xA]['parent']) )

// 					//the parents possibly match
// 					if (aIds.indexOf(parentsB[xB]['parent']) > -1 && bIds.indexOf(parentsA[xA]['parent']) > -1){

						

// 						//compare these two
// 						var aTitle = parentsA[xA]['idents']['title']
// 						var bTitle = parentsB[xB]['idents']['title']


// 						if (compare.compareNormalizedTitles(aTitle,bTitle) >= 0.75){

// 							//console.log(parentsA[xA]['parentTitle'], "|", parentsB[xB]['parentTitle'] )

// 							//console.log("\t\t->",aTitle,"|",bTitle)

// 							if (typeof parentsA[xA]['matchedArchives'] != 'undefined'){
// 								if (parentsA[xA]['matchedArchives'] === false ) parentsA[xA]['matchedArchives'] = []
// 								parentsA[xA]['matchedArchives'].push(parentsB[xB])
// 							}

// 							if (typeof parentsA[xA]['matchedMms'] != 'undefined'){
// 								if (parentsA[xA]['matchedMms'] === false ) parentsA[xA]['matchedMms'] = []
// 								parentsA[xA]['matchedMms'].push(parentsB[xB])
// 							}

// 							if (typeof parentsB[xB]['matchedArchives'] != 'undefined'){
// 								if (parentsB[xB]['matchedArchives'] === false ) parentsB[xB]['matchedArchives'] = []
// 								parentsB[xB]['matchedArchives'].push(parentsA[xA])
// 							}

// 							if (typeof parentsB[xB]['matchedMms'] != 'undefined'){
// 								if (parentsB[xB]['matchedMms'] === false ) parentsB[xB]['matchedMms'] = []
// 								parentsB[xB]['matchedMms'].push(parentsA[xA])
// 							}


// 						}



// 					}



// 				}


// 			}		


// 		}


// 	}



// 	//now that we know how the parents match up we can loop through all of them and compare the cildren
	

// 	for (var ax in a){

// 		process.stdout.write("\rcompareByParentAndTitle " + Math.floor(++count/aTotal*100) )


// 		aEntry = a[ax]

// 		// console.log(aEntry)
// 		var aIds = returnParentMatchId(aEntry['parent'])

// 		for (var bx in b){

// 		 	bEntry = b[bx]

// 		 	//if they have children then they were taken care of already in this model
// 		 	if (aEntry['hasChildren'] || bEntry['hasChildren']) continue


// 		 	var bIds = returnParentMatchId(bEntry['parent'])

// 			if (aIds.indexOf(bEntry['parent']) > -1 && bIds.indexOf(aEntry['parent']) > -1){

				

// 				//compare these two
// 				var aTitle = aEntry['idents']['title']
// 				var bTitle = bEntry['idents']['title']

// 				if (compare.compareNormalizedTitles(aTitle,bTitle) >= 0.75){


// 					if (typeof aEntry['matchedArchives'] != 'undefined'){
// 						if (aEntry['matchedArchives'] === false ) aEntry['matchedArchives'] = []
// 						aEntry['matchedArchives'].push(bEntry['idents'])
// 					}

// 					if (typeof aEntry['matchedMms'] != 'undefined'){
// 						if (aEntry['matchedMms'] === false ) aEntry['matchedMms'] = []
// 						aEntry['matchedMms'].push(bEntry['idents'])
// 					}

// 					if (typeof bEntry['matchedArchives'] != 'undefined'){
// 						if (bEntry['matchedArchives'] === false ) bEntry['matchedArchives'] = []
// 						bEntry['matchedArchives'].push(aEntry['idents'])
// 					}

// 					if (typeof bEntry['matchedMms'] != 'undefined'){
// 						if (bEntry['matchedMms'] === false ) bEntry['matchedMms'] = []
// 						bEntry['matchedMms'].push(aEntry['idents'])
// 					}


// 					//console.log(aEntry)


// 				}
// 			}




// 		}

// 	}


// 	//if we reversed it put it back in order to return
// 	if (reversed){
// 		var c = a
// 		a = b
// 		b = c
// 	}


// 	var totalA = 0, countA = 0

// 	for (var x in a){
// 		totalA++
// 		if (a[x]['matchedMms'] || a[x]['matchedArchives']) countA++
// 	}
// 	var totalB = 0, countB = 0
// 	for (var x in b){
// 		totalB++
// 		if (b[x]['matchedMms'] || b[x]['matchedArchives']) countB++
// 	}

// 	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
// 				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

// 	return [a,b,stats]


// }




//find hiearchy matches based on matching titles and dates
//OLD
// exports.compareByTitleAndDate = function(a,b){

// 	if (!a || !b) return false

// 	var debug = false


// 	//store all three types of compare for each result and deside at the end
// 	for (var aX in a){

// 		var aEntry = a[aX], aTitle = a[aX]['idents']['title']

// 		for (var bX in b){

// 			var bEntry = b[bX], bTitle = b[bX]['idents']['title']


// 			//do they depths match
// 			if (bEntry['depth'] == aEntry['depth']){

// 				//does the standard string compare match the title?
// 				if (compare.compareNormalizedTitles(aTitle,bTitle) >= 0.75){

// 					console.log("depth","compareNormalizedTitles",aTitle,"|",bTitle)
					
// 					if (!aEntry['matchedDepthStringScore']){
// 						aEntry['matchedDepthStringScore'] = [bEntry['idents']]
// 					}else{
// 						aEntry['matchedDepthStringScore'].push(bEntry['idents'])
// 					}

// 					if (!bEntry['matchedDepthStringScore']){
// 						bEntry['matchedDepthStringScore'] = [aEntry['idents']]
// 					}else{
// 						bEntry['matchedDepthStringScore'].push(aEntry['idents'])
// 					}
// 				}

// 				//does the word match return a match?
// 				if ( compare.compareByWords(aTitle,bTitle) ){

// 					if (debug) console.log("depth","compareByWords\t",aTitle,"|",bTitle)

// 					if (!aEntry['matchedDepthWord']){
// 						aEntry['matchedDepthWord'] = [bEntry['idents']]
// 					}else{
// 						aEntry['matchedDepthWord'].push(bEntry['idents'])
// 					}

// 					if (!bEntry['matchedDepthWord']){
// 						bEntry['matchedDepthWord'] = [aEntry['idents']]
// 					}else{
// 						bEntry['matchedDepthWord'].push(aEntry['idents'])
// 					}
// 				}


// 				//does the word match  fuzzy return a match?
// 				if ( compare.compareByWords(aTitle,bTitle,true) ){
					
// 					if (debug) console.log("depth","compareByWordsFuzzy",aTitle,"|",bTitle)

// 					if (!aEntry['matchedDepthWordFuzzy']){
// 						aEntry['matchedDepthWordFuzzy'] = [bEntry['idents']]
// 					}else{
// 						aEntry['matchedDepthWordFuzzy'].push(bEntry['idents'])
// 					}

// 					if (!bEntry['matchedDepthWordFuzzy']){
// 						bEntry['matchedDepthWordFuzzy'] = [aEntry['idents']]
// 					}else{
// 						bEntry['matchedDepthWordFuzzy'].push(aEntry['idents'])
// 					}


// 				}


// 			//the depth did not match this would be the lesser perfered match
// 			}else{


// 				//does the standard string compare match the title?
// 				if (compare.compareNormalizedTitles(aTitle,bTitle) >= 0.75){

// 					console.log("non-depth","compareNormalizedTitles",aTitle,"|",bTitle)


// 					if (!aEntry['matchedStringScore']){
// 						aEntry['matchedStringScore'] = [bEntry['idents']]
// 					}else{
// 						aEntry['matchedStringScore'].push(bEntry['idents'])
// 					}

// 					if (!bEntry['matchedStringScore']){
// 						bEntry['matchedStringScore'] = [aEntry['idents']]
// 					}else{
// 						bEntry['matchedStringScore'].push(aEntry['idents'])
// 					}
// 				}

// 				//does the word match return a match?
// 				if (compare.compareByWords(aTitle,bTitle) ){

// 					if (debug) console.log("non-depth","compareByWords\t",aTitle,"|",bTitle)


// 					if (!aEntry['matchedWord']){
// 						aEntry['matchedWord'] = [bEntry['idents']]
// 					}else{
// 						aEntry['matchedWord'].push(bEntry['idents'])
// 					}

// 					if (!bEntry['matchedWord']){
// 						bEntry['matchedWord'] = [aEntry['idents']]
// 					}else{
// 						bEntry['matchedWord'].push(aEntry['idents'])
// 					}
// 				}


// 				//does the word match  fuzzy return a match?
// 				if ( compare.compareByWords(aTitle,bTitle,true) ){

// 					if (debug) console.log("non-depth","compareByWordsFuzzy",aTitle,"|",bTitle)


// 					if (!aEntry['matchedWordFuzzy']){
// 						aEntry['matchedWordFuzzy'] = [bEntry['idents']]
// 					}else{
// 						aEntry['matchedWordFuzzy'].push(bEntry['idents'])
// 					}

// 					if (!bEntry['matchedWordFuzzy']){
// 						bEntry['matchedWordFuzzy'] = [aEntry['idents']]
// 					}else{
// 						bEntry['matchedWordFuzzy'].push(aEntry['idents'])
// 					}


// 				}

// 			}

// 		}

// 	}


// 	var totalA = 0, countA = 0

// 	for (var x in a){
// 		totalA++
// 		if (a[x]['matchedMms'] || a[x]['matchedArchives']) countA++
// 	}
// 	var totalB = 0, countB = 0
// 	for (var x in b){
// 		totalB++
// 		if (b[x]['matchedMms'] || b[x]['matchedArchives']) countB++
// 	}

// 	var stats = {a: { total: totalA, matched: countA, percent: Math.floor(countA/totalA*100) },
// 				 b: { total: totalB, matched: countB, percent: Math.floor(countB/totalB*100) }}

// 	return [a,b,stats]



// }

