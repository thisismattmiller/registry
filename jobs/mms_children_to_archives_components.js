"use strict"

var exceptionReport = require("../util/exception_report.js"),
	config = require("config"),
	fs = require("fs"),
	async = require("async"),
	compare = require("../util/compare.js"),
	compareHierarchy = require("../util/compare_hierarchy.js"),
	utils = require("../util/utils.js"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	mmsProcess = require("../process/mms_process.js"),
	archivesProcess = require("../process/archives_process.js"),
	findRemoveSync = require('find-remove')



var exports = module.exports = {}


var pathToArchivesOutput = config.get('Storage')['outputPaths']['archives']

var pathToArchivesChildrenResult = config.get('Storage')['results']['archivesChildrenMatchedCollection']
var pathToMmsChildrenResult = config.get('Storage')['results']['mmsChildrenMatchedCollection']
var pathToResultsOutput = config.get('Storage')['results']['base']


exports.process= function(cb){


	//delete the current data
	var result = findRemoveSync(pathToArchivesChildrenResult, {extensions: ['.json']})
	var result = findRemoveSync(pathToMmsChildrenResult, {extensions: ['.json']})




	//we want to open the match file so we know what to compare
	fs.readFile(pathToResultsOutput + 'archives_to_mms_collections.json', 'utf8', function (err, data) {
			

		if (err) {			

			throw "The archives_to_mms_collections.json could not be loaded"
			if (cb) cb()
			return
		}


		data = JSON.parse(data)


		var matches = data['matches']

		//the title matches are stored a little differntly, so make them like the other ident matches [ { } ]
		for (var x in data['titleMatches']){
			matches.push([data['titleMatches'][x]])
		}

		var queue = []

		for  (var x in matches){


			for (var y in matches[x]){

				var mms = matches[x][y]['mms']
				var archives = matches[x][y]['archives']

				queue.push({mms:mms['mmsUuid'],archives: archives['mssDb']})				

			}

		}



		var total = queue.length
		var count = 0
		var working = false

		var allComponents = 0, allHighMatches = 0, allLowMatches = 0, allTypeCount = {}

		var highMatchFunctions = ['compareByIdents', 
								  'compareByDepthParentTitleDateStrict', 
								  'compareByDepthParentTitle',
								  'compareByDepthParentTitleFuzzy',
								  'compareByDepthTitleDate']


		var lowMatchFunctions = ['compareByTitleUnique', 
								  'compareByTitleUniqueFuzzy']

		for (var level in highMatchFunctions.concat(lowMatchFunctions)){
			level = highMatchFunctions.concat(lowMatchFunctions)[level]
			allTypeCount[level] = 0
		}


		var timer = setInterval(function(){

			if (!queue[0]) return false

			if (working) return false

			working = true	

			var mms = queue[0]['mms']
			var archives = queue[0]['archives']

			
			//load the mms tilden collection
			mmsProcess.returnChildHierarchyLayout(mms,function(mmsHierarchy){



				//load the archives
				archivesProcess.returnComponentHierarchyLayout(archives, function(archivesHierarchy){

					//what we will be writing out to file
					var mmsHierarchyResults = { hasChildren : true, children : null, recordCount : 0, highMatchesCount : 0, lowMatchesCount : 0 }
					var archivesHierarchyResults = { hasChildren : true, children : null, recordCount : 0, highMatchesCount : 0, lowMatchesCount : 0 }

					console.log("\n\n")


					var archivesHierarchyLength = "?", mmsHierarchyLength = "?"

					if (!mmsHierarchy && archivesHierarchy){
						console.log(mms, "is missing children while ",archives,"has them")	
						mmsHierarchyResults['hasChildren'] = false
					}


					if (!archivesHierarchy && mmsHierarchy){
						console.log(archives, "is missing components while ",mms,"has them")	
						archivesHierarchyResults['hasChildren'] = false
					}			
		

					if (archivesHierarchy) archivesHierarchyLength = Object.keys(archivesHierarchy).length
					if (mmsHierarchy) mmsHierarchyLength = Object.keys(mmsHierarchy).length

					console.log("\n")

					console.log('Loaded: #', count, mms, "(", mmsHierarchyLength ,")",archives,"(", archivesHierarchyLength ,")" )

					count++

					var testSkip = ['1e6dd2f0-c530-012f-c1f8-58d385a7bc34','02d1c8f0-c52d-012f-a615-58d385a7bc34']
					testSkip = []


					if (archivesHierarchy && mmsHierarchy && (testSkip.indexOf(mms) == -1 )){


						var compareByIdents = compareHierarchy.compareByIdents( mmsHierarchy, archivesHierarchy )
						//console.log("compareByIdents\n", compareByIdents[2])

						//set them to the results to they compile in one object
						mmsHierarchy = compareByIdents[0]
						archivesHierarchy = compareByIdents[1]

						var compareByDepthParentTitleDateStrict = compareHierarchy.compareByDepthParentTitleDateStrict( mmsHierarchy, archivesHierarchy )
						//console.log("compareByDepthParentTitleDateStrict\n", compareByDepthParentTitleDateStrict[2])

						mmsHierarchy = compareByDepthParentTitleDateStrict[0]
						archivesHierarchy = compareByDepthParentTitleDateStrict[1]


						var compareByDepthParentTitle = compareHierarchy.compareByDepthParentTitle( mmsHierarchy, archivesHierarchy )
						//console.log("compareByDepthParentTitle\n", compareByDepthParentTitle[2])

						mmsHierarchy = compareByDepthParentTitleDateStrict[0]
						archivesHierarchy = compareByDepthParentTitleDateStrict[1]


						var compareByDepthParentTitleFuzzy = compareHierarchy.compareByDepthParentTitleFuzzy( mmsHierarchy, archivesHierarchy )
						//console.log("compareByDepthParentTitleFuzzy\n", compareByDepthParentTitleFuzzy[2])

						mmsHierarchy = compareByDepthParentTitleDateStrict[0]
						archivesHierarchy = compareByDepthParentTitleDateStrict[1]


						var compareByDepthTitleDate = compareHierarchy.compareByDepthTitleDate( mmsHierarchy, archivesHierarchy )
						//console.log("compareByDepthTitleDate\n", compareByDepthTitleDate[2])


						mmsHierarchy = compareByDepthTitleDate[0]
						archivesHierarchy = compareByDepthTitleDate[1]


						var compareByTitleDate = compareHierarchy.compareByTitleDate( mmsHierarchy, archivesHierarchy )
						//console.log("compareByTitleDate\n", compareByTitleDate[2])

						mmsHierarchy = compareByTitleDate[0]
						archivesHierarchy = compareByTitleDate[1]




						//low confidence belowwwww

						var compareByTitleUnique = compareHierarchy.compareByTitleUnique( mmsHierarchy, archivesHierarchy )
						//console.log("compareByTitleUnique\n", compareByTitleUnique[2])

						mmsHierarchy = compareByTitleUnique[0]
						archivesHierarchy = compareByTitleUnique[1]


						var compareByTitleUniqueFuzzy = compareHierarchy.compareByTitleUniqueFuzzy( mmsHierarchy, archivesHierarchy )
						//console.log("compareByTitleUniqueFuzzy\n", compareByTitleUniqueFuzzy[2])

						mmsHierarchy = compareByTitleUniqueFuzzy[0]
						archivesHierarchy = compareByTitleUniqueFuzzy[1]

						
						var allMatchedHigh = []

						
						process.stdout.write("\r                                                                              ")


						var mmsTitle = ""

						//try to print out the collection title
						if (Object.keys(mmsHierarchy)[0]){
							if (mmsHierarchy[Object.keys(mmsHierarchy)[0]]['data']['solr_doc_hash']['collection_name']) mmsTitle = mmsHierarchy[Object.keys(mmsHierarchy)[0]]['data']['solr_doc_hash']['collection_name']
						}
						console.log("\n")
						console.log(mmsTitle)

						

						for (var hierarchy in [mmsHierarchy, archivesHierarchy]){

							var hierarchyTitle = (hierarchy==0) ? 'MMS - ' + mms  : 'Archives - ' +  archives
							var highMatchesCount = 0, lowMatchesCount = 0, recordCount = 0


							console.log(hierarchyTitle)

							var thisHierarchy = [mmsHierarchy, archivesHierarchy][hierarchy]


							for (var record in thisHierarchy){

								recordCount++

								record = thisHierarchy[record]

								var matchedHigh = [], matchedLow = []

								record['matchHigh'] = [],record['matchLow'] = []

								//the matching bascially has two tiers, pretty high cofidence and low confidence
								//we want to do the high first so we can refernce those matches in the low logic
								for (var level in highMatchFunctions){

									level = highMatchFunctions[level]

									if (record[level]){

										for (var aMatch in record[level]){
											aMatch = record[level][aMatch]
											var hash = JSON.stringify(aMatch['idents'])


											if (matchedHigh.indexOf(hash) === -1){

												record['matchHigh'].push(aMatch)
												matchedHigh.push(hash)
												highMatchesCount++
												allTypeCount[level]++
											}

											if (allMatchedHigh.indexOf(hash) === -1) allMatchedHigh.push(hash)

										
										}
									}



								}


								for (var level in lowMatchFunctions){

									level = lowMatchFunctions[level]

									if (record[level]){

										for (var aMatch in record[level]){
											aMatch = record[level][aMatch]
											var hash = JSON.stringify(aMatch['idents'])


											//don't match if this is our own match alreaday
											//don't match if this has been matched at a high confidence already
											if (matchedLow.indexOf(hash) === -1 && matchedHigh.indexOf(hash) === -1){
												record['matchLow'].push(aMatch)
												matchedLow.push(hash)
												lowMatchesCount++
												allTypeCount[level]++
											}											
										}
									}
								}



							}



							console.log("Total:",recordCount,"High:",highMatchesCount, "(", Math.floor(highMatchesCount/recordCount*100),"%)","Low:",lowMatchesCount,"(", Math.floor(lowMatchesCount/recordCount*100),"%)")


							allComponents = allComponents + recordCount
							allHighMatches = allHighMatches + highMatchesCount
							allLowMatches = allLowMatches + lowMatchesCount

							//mms
							if (hierarchy == 0){


								mmsHierarchyResults['children'] = thisHierarchy
								mmsHierarchyResults['recordCount'] = recordCount
								mmsHierarchyResults['highMatchesCount'] = highMatchesCount
								mmsHierarchyResults['lowMatchesCount'] = lowMatchesCount





							}else{

								archivesHierarchyResults['children'] = thisHierarchy
								archivesHierarchyResults['recordCount'] = recordCount
								archivesHierarchyResults['highMatchesCount'] = highMatchesCount
								archivesHierarchyResults['lowMatchesCount'] = lowMatchesCount



							}





						}





						//not optimizd
						// console.log("compareByParentAndTitle")
						// var compareByParentAndTitle = compareHierarchy.compareByParentAndTitle( mmsHierarchy, archivesHierarchy )
						// console.log("compareByParentAndTitle\n", compareByParentAndTitle[2])


					}


					//write out the results
					var tmp = fs.createWriteStream(pathToMmsChildrenResult + mms + '.json',{'flags': 'w'})
					tmp.end(JSON.stringify(mmsHierarchyResults))


					var tmp = fs.createWriteStream(pathToArchivesChildrenResult + archives + '.json',{'flags': 'w'})
					tmp.end(JSON.stringify(archivesHierarchyResults))








					if (total == count) {

						

						console.log("allComponents",allComponents)
						console.log("allHighMatches",allHighMatches)
						console.log("allComponents",allLowMatches)
						console.log(allTypeCount)

						clearInterval(timer)

						if (cb) cb()

					}
					working = false


				})


			})		


			queue.splice(0,1)
			


		},500);



	});




}


exports.debug = function(key,set){

	if (set[key]){

		console.log("\n----------",key,"----------\n")

		for (var x in set[key]){

			console.log(set[key][x]['idents'])

		}


	}

}


//override the path if we are testing
exports.setPathToArchivesChildrenResult = function(path){
	pathToArchivesChildrenResult = path
}

exports.setPathToMmsChildrenResult = function(path){
	pathToMmsChildrenResult = path
}

exports.setPathToArchivesOutput = function(path){
	pathToArchivesOutput = path
}

exports.setPathToChildrenSource = function(path){
	mmsProcess.setExtractsSplitPath(path)
	archivesProcess.setExtractsSplitPath(path)
}






