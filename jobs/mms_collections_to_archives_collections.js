"use strict"

var mmsProcess = require("../process/mms_process.js"),
	archivesLoad = require("../process/archives_collections.js"),
	exceptionReport = require("../util/exception_report.js"),
  	config = require("config"),
  	fs = require("fs"),
  	async = require("async"),
  	compare = require("../util/compare.js"),
  	utils = require("../util/utils.js"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream')


var exports = module.exports = {}

var useDivision = []

var pathToMmsExtracts = config.get('Storage')['outputPaths']['mms']

var pathToArchivesOutput = config.get('Storage')['outputPaths']['archives']

var pathToResultsOutput = config.get('Storage')['results']['base']


//load from the config unless overridden
exports.loadDivisionsAbbreviations = function(custom){

	//if it is already set then do not overwrite
	if (useDivision.length != 0) return useDivision

	if (!custom){

		var divisions = config.get('MMSDivisions')['divisions']
		for (var x in divisions){

			if (divisions[x].processArchivesCollections){
				useDivision.push(x)
			}
		}
	}else{
		useDivision = custom
	}

	return useDivision
}


exports.process = function(options,cb){

	var pathToArchivesCollectionExtract = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesCollections']

	if (options){
		if (typeof options != 'function'){
			//if we want to point the read directory somewhere else we need to pass it here since the 
			//mmsProcess is not exposed in the module that call this process
			if (options.pathMms){
				mmsProcess.setPathOverride(options.pathMms)
			}
			if (options.pathArchives){
				pathToArchivesCollectionExtract = options.pathArchives
			}
		}else{
			//if we omit the options parms, should not happen
			var cb = options
		}		
	}

	var totalRecordsDone = 0, totalMatches = 0, matchReport = {}, allMatches = [], titleMatches = [], allMMS = {}

	//load the mms division that need to be processed through the archives comparison
	exports.loadDivisionsAbbreviations()

	//load the archives collection dataset
	archivesLoad.loadData(pathToArchivesCollectionExtract, function(archivesCollections){



	async.series({

		one: function(callbackOne){

			var options = []
			//we want to send the options object with everthing to work on this file in the async.map
			for (var x in exports.loadDivisionsAbbreviations()){

				//we need to make a object for the parms to pass to the asyc processor 
				options.push({

					//the file name
					abbreviation : exports.loadDivisionsAbbreviations()[x],

					//this is where the comparison happens
					action: function(data){
					
						//get the idents for this mms record
						var mmsIdents = mmsProcess.extractIds(data)
						var mmsIdentsNormalized = utils.normalizeIdents(mmsIdents)
						var matchedArchivesIds = []
						var matches = []

						allMMS[mmsIdents['mmsUuid']] = mmsIdents
						allMMS[mmsIdents['mmsUuid']]['matchedArchives'] = false
						allMMS[mmsIdents['mmsUuid']]['data'] = data


						//loop through each normalized ident
						for (var normalizedId in mmsIdentsNormalized){

							//see if this normalized id is in the index for the same field
							if (archivesLoad.matchIdentifierIndex(normalizedId,mmsIdentsNormalized[normalizedId])){

								for (var key in archivesCollections){

									var r = compare.compareIdentifiersExact(mmsIdents,archivesCollections[key])
									if (r.match){

										if (matchedArchivesIds.indexOf(archivesCollections[key]['mssDb'])==-1){
											totalMatches++

											matches.push({archives:archivesCollections[key], mms:mmsIdents})

											//mark this one is matched so we don't match over and over with difffrent idents of the same record
											matchedArchivesIds.push(archivesCollections[key]['mssDb'])


											if (matchReport[r.matchOn.sort().toString().replace(/,/g,"+")]){
												matchReport[r.matchOn.sort().toString().replace(/,/g,"+")]++
											}else{
												matchReport[r.matchOn.sort().toString().replace(/,/g,"+")]=1
											}

											archivesLoad.markAsMmsMatched(archivesCollections[key]['mssDb'])

											allMMS[mmsIdents['mmsUuid']]['matchedArchives'] = true

											archivesCollections[key]['matchMms'] = mmsIdents

										}
									}

								}

							}

						}




						//no luck? Try looking for some title matches
						if (matches.length==0){
							
							for (var key in archivesCollections){
								//title matches are going to be more loose, so don't mess with the already matached ones						
								if (!archivesCollections[key]['matchedMms']){



									var mmsTitle = mmsIdents['title']
									var archivesTitle = archivesCollections[key]['title']
									
									//console.log(archivesTitle, "|", mmsTitle, compare.compareTitles( archivesTitle, mmsTitle))

									//no one word collections
									if (archivesTitle.split(" ").length > 1){


										//console.log("Doing",archivesCollections[key]['title'], "=?", mmsIdents['title'])
										var r = compare.compareTitles( archivesTitle, mmsTitle)
										
										if (r){

											if (r>=0.75){

												mmsIdents['titleMatch'] = r

												allMMS[mmsIdents['mmsUuid']]['matchedArchives'] = true

												if (!archivesCollections[key]['matchedMmsTitle']){
													archivesCollections[key]['matchedMmsTitle'] = [mmsIdents]
												}else{
													archivesCollections[key]['matchedMmsTitle'].push(mmsIdents)
												}

											}
										}

									}

								}

							}						

						}


						totalRecordsDone++

						if (matches.length>0) allMatches.push(matches)


					
						process.stdout.write("Total Collections Checked: " + totalRecordsDone  + " | Matches: " + totalMatches + "\r")


					},

					//no call back in this case since we are calling it from within an async map
					cbUnit : false,

					//we only are looking at collections here
					collectionFilter : true

				})
			}

			//fires the process off for all divisions
			async.map(options, mmsProcess.streamRecords, function(results){
				console.log('\nDone with collection identifier comparsion\n')
				callbackOne()				
			});		
			
		},
		
		two: function(callbackTwo){

				
			//lets compare titles!
			console.log("Checking for title matches")

			for (var key in archivesCollections){

				if (!archivesCollections[key]['matchedMms']){
					if (archivesCollections[key]['matchedMmsTitle']){
						if (archivesCollections[key]['matchedMmsTitle'].length > 0){

							//it has matched titles
							var newMatchedTitles = []
							//we need to compare the title matches and only possibly match via title on things
							//that either do not have an identifier
							for (var x in archivesCollections[key]['matchedMmsTitle']){

								//if they both have bnumbers (and they are diffrent otherwise they would have matched on them)
								//then remove this one because it cannot be the right collection, it is likely a sub-group
								if ((archivesCollections[key]['bNumber'] && archivesCollections[key]['matchedMmsTitle'][x]['bNumber']) ||  (archivesCollections[key]['callNumber'] && archivesCollections[key]['matchedMmsTitle'][x]['callNumber']) ){

									//console.log("Remove", archivesCollections[key]['matchedMmsTitle'][x])
								}else{
									newMatchedTitles.push(archivesCollections[key]['matchedMmsTitle'][x])
								}

							}

							archivesCollections[key]['matchedMmsTitle'] = newMatchedTitles


						}

						//sotore them if they really check out
						if (archivesCollections[key]['matchedMmsTitle'].length > 0){
							for (var x in archivesCollections[key]['matchedMmsTitle']){
								var tmp = JSON.parse(JSON.stringify(archivesCollections[key]))
								delete tmp['matchedMmsTitle']

								archivesLoad.markAsMmsMatched(archivesCollections[key]['mssDb'])


								allMMS[ archivesCollections[key]['matchedMmsTitle'][x]['mmsUuid'] ]['matchedArchives'] = true

								titleMatches.push(
									{
										"mms" 	   : archivesCollections[key]['matchedMmsTitle'][x],
										"archives" : tmp
									}
								)

							}
						}
					}
				}
			}


			callbackTwo()
	
		},

		three: function(callbackThree){



			//output results


			//TODO expand more collection matching criteria





			callbackThree()

		}
	},
		function(err, results) {
	
			//can expand what is in the callback for various uses
			var returnVal = {
				totalMatches: totalMatches,
				matchReport: matchReport,
				matches: allMatches,
				titleMatches: titleMatches
			}		

			





			//write out all the matches
			var ws = fs.createWriteStream(pathToResultsOutput + 'archives_to_mms_collections.json')
			ws.end(JSON.stringify(returnVal));


			//write out all the mms non matches
			var rs_mmsAll = new readable({objectMode: true})
			var outfile_mmsAll = fs.createWriteStream(pathToResultsOutput + 'mms_no_match_to_archives_collections.json');
			var stringify_mmsAll = jsonStream.stringify("[\n",",\n","\n]\n");
			rs_mmsAll._read = function () {};
			rs_mmsAll.pipe(stringify_mmsAll).pipe(outfile_mmsAll);

			for (var key in allMMS){

				
				if (allMMS[key]['matchedArchives'] === false) rs_mmsAll.push(allMMS[key])


			} 

			rs_mmsAll.push(null)

			outfile_mmsAll.on('finish', function () {
				


				//write out the archives extract now updated with matched or not
				var rs = new readable({objectMode: true})
				var outfile = fs.createWriteStream(pathToResultsOutput + 'archives_collections.json');
				var stringify = jsonStream.stringify("[\n",",\n","\n]\n");
				rs._read = function () {};
				rs.pipe(stringify).pipe(outfile);

				for (var key in archivesCollections){

					rs.push(archivesCollections[key])

				} 

				rs.push(null)

				outfile.on('finish', function () {
					if (cb) cb(returnVal)
				});




			});






			

		})
	})


}



//mostly for testing
//rest the array to test diffrent modes
exports.loadDivisionsReset = function(){
	useDivision = []
}
//set it for testing
exports.setExtractsPath = function(path){
	pathToMmsExtracts = path
}
//set it for testing
exports.setArchivesOutputPath = function(path){
	pathToArchivesOutput = path
}

//set it for testing
exports.setResultsOutput = function(path){
	pathToResultsOutput = path
}
