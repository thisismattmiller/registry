"use strict"

var mmsProcess = require("../process/mms_process.js"),
	archivesLoad = require("../process/archives_collections.js"),
	exceptionReport = require("../util/exception_report.js"),
  	config = require("config"),
  	fs = require("fs"),
  	async = require("async"),
  	compare = require("../util/compare.js"),
  	utils = require("../util/utils.js")




var exports = module.exports = {}

var useDivision = []

var pathToMmsExtracts = config.get('Storage')['outputPaths']['mms']

var pathToArchivesOutput = config.get('Storage')['outputPaths']['archives'] + 'archives_to_mms_collections.json'


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

	var totalRecordsDone = 0, totalMatches = 0, matchReport = {}, allMatches = []

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

											archivesLoad.markAsMatched(archivesCollections[key]['mssDb'])



										}
									}

									//title matches are going to be more loose, so don't mess with the already matached ones
									if (!archivesCollections[key]['matched']){

										var mmsTitle = mmsIdents['title']
										var archivesTitle = archivesCollections[key]['title']

										//no one word collections
										if (archivesTitle.split(" ").length > 1){

		
											//console.log("Doing",archivesCollections[key]['title'], "=?", mmsIdents['title'])
											var r = compare.compareTitles( archivesTitle, mmsTitle)
											if (r){
												if (r>0.75){

													mmsIdents['titleMatch'] = r

													if (!archivesCollections[key]['matchedTitle']){
														archivesCollections[key]['matchedTitle'] = [mmsIdents]
													}else{
														archivesCollections[key]['matchedTitle'].push(mmsIdents)
													}													
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

				if (!archivesCollections[key]['matched']){
					if (archivesCollections[key]['matchedTitle']){
						if (archivesCollections[key]['matchedTitle'].length > 0){
							console.log(archivesCollections[key])
						}
					}
				}
			}






			callbackTwo()
	
		},

		three: function(callbackThree){



			//output results





			callbackThree()

		}
	},
		function(err, results) {
	
			//can expand what is in the callback for various uses
			var returnVal = {
				totalMatches: totalMatches,
				matchReport: matchReport,
				matches: allMatches
			}		


			//write out all the matches
			var ws = fs.createWriteStream(pathToArchivesOutput)
			ws.end(JSON.stringify(allMatches));


			if (cb) cb(returnVal)

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
