"use strict"

var mmsProcess = require("../process/mms_process.js"),
	archivesLoad = require("../process/archives_collections.js"),
	exceptionReport = require("../util/exception_report.js"),
  	config = require("config"),
  	async = require("async"),
  	compare = require("../util/compare.js"),
  	utils = require("../util/utils.js")




var exports = module.exports = {}

var useDivision = []

var pathToMmsExtracts = config.get('Storage')['outputPaths']['mms']



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
			//mssProcess is not exposed in the module that call this process
			if (options.pathMms){
				mssProcess.setPathOverride(options.pathMms)
			}
			if (options.pathArchives){
				pathToArchivesCollectionExtract = options.pathArchives
			}
		}else{
			//if we omit the options parms, should not happen
			var cb = options
		}		
	}

	var totalRecordsDone = 0, totalMatches = 0

	//load the mms division that need to be processed through the archives comparison
	exports.loadDivisionsAbbreviations()

	//load the archives collection dataset
	archivesLoad.loadData(pathToArchivesCollectionExtract, function(archivesCollections){

	var alltest = []

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



						if (alltest.indexOf(data.d_id) >-1 ) console.log(">>>>>This one is a dupe")

						alltest.push(data.d_id)
						
						//get the idents for this mms record
						var mmsIdents = mmsProcess.extractIds(data)
						var mmsIdentsNormalized = utils.normalizeIdents(mmsIdents)


						for (var normalizedId in mmsIdentsNormalized){

							if (archivesLoad.matchIdentifierIndex(normalizedId,mmsIdentsNormalized[normalizedId])){

								for (var key in archivesCollections){

									var r = compare.compareIdentifiersExact(mmsIdents,archivesCollections[key])
									if (r.match){
										totalMatches++
										console.log(r)
										console.log(mmsIdents)
										console.log(archivesCollections[key])
									}
									


								}

							}
						}

						totalRecordsDone++

						console.log("------------------",alltest.length,"--",data['d_type'],"--",data['d_id'],"------------------",totalMatches,"------------------")

						//if there is a match on the index then try the full comparison



						// for (var key in archivesCollections){

						// 	var r = compare.compareIdentifiersExact(mmsIdents,archivesCollections[key])
						// 	if (r.match){
						// 		totalMatches++
						// 		console.log(r)
						// 		console.log(mmsIdents)
						// 		console.log(archivesCollections[key])
						// 	}
							


						// }




					},

					//no call back in this case since we are it from within an async map
					cbUnit : false,

					//we only are looking at collections here
					collectionFilter : true

				})
			}

			console.log(options)


			//fires the process off for all divisions
			async.map(options, mmsProcess.streamRecords, function(results){


				console.log('done w/ map')

				callbackOne()
				
			});		


			
		},
		
		two: function(callbackTwo){

			console.log("done with two call?")

			callbackTwo()
	
		}
	},
	function(err, results) {
	
		if (cb) cb()

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

