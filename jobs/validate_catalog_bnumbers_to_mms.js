"use strict"

var mmsProcess = require("../process/mms_process.js"),
	exceptionReport = require("../util/exception_report.js"),
  	config = require("config"),
  	fs = require("fs"),
  	async = require("async"),
  	compare = require("../util/compare.js"),
  	utils = require("../util/utils.js"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	catalogProcess = require("../process/catalog_process.js")


var exports = module.exports = {}

var useDivision = []

var pathToMmsExtracts = config.get('Storage')['outputPaths']['mms']

var pathToResultsOutput = config.get('Storage')['results']['base']

var bNumberToMms = {}


//load from the config unless overridden
exports.loadDivisionsAbbreviations = function(custom){

	//if it is already set then do not overwrite
	if (useDivision.length != 0) return useDivision

	if (!custom){

		var divisions = config.get('MMSDivisions')['divisions']
		for (var x in divisions){

			useDivision.push(x)

		}

	}else{
		useDivision = custom
	}

	return useDivision
}


exports.process = function(options,cb){


	if (options){
		if (typeof options != 'function'){
			//if we want to point the read directory somewhere else we need to pass it here since the
			//mmsProcess is not exposed in the module that call this process
			if (options.pathMms){
				mmsProcess.setPathOverride(options.pathMms)
			}

		}else{
			//if we omit the options parms, should not happen
			var cb = options
		}
	}

	var totalRecordsDone = 0, totalMatches = 0, matchReport = {}, allMatches = [], titleMatches = [], allMMS = {}

	//load the mms division that need to be processed through the archives comparison
	exports.loadDivisionsAbbreviations()


	process.stdout.write("Loading bnumber index\r")

	//load bnumbers
	catalogProcess.loadBnumbers(function(allBnumbers){



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

						if (mmsIdentsNormalized.bNumber){
							if (!allBnumbers[mmsIdentsNormalized.bNumber]){
								exceptionReport.log("bnumber mms match","mms bnumber not in extract", {title: mmsIdents.title, uuid: mmsIdents.mmsUuid, bnumber: mmsIdents.bNumber } )
							}else{

								if (bNumberToMms[mmsIdentsNormalized.bNumber]){
									bNumberToMms[mmsIdentsNormalized.bNumber].push(mmsIdents.mmsUuid)
								}else{
									bNumberToMms[mmsIdentsNormalized.bNumber] = [mmsIdents.mmsUuid]
								}


							}
						}



						//console.log(mmsIdentsNormalized)
						totalRecordsDone++
						process.stdout.write("Total Collections Checked: " + totalRecordsDone  + " | Matches: " + totalMatches + "\r")


					},

					//no call back in this case since we are calling it from within an async map
					cbUnit : false,

					//we only are looking at collections here
					collectionFilter : false

				})
			}

			//fires the process off for all divisions
			async.map(options, mmsProcess.streamRecords, function(){
				console.log('\nDone with bnumber MMS comparsion\n')
				callbackOne()
			});

		}

	},
		function(err) {

			console.log("Writing results")

			// //write out all the matches
			// var ws = fs.createWriteStream(pathToResultsOutput + 'archives_to_mms_collections.json')
			// ws.end(JSON.stringify(returnVal));


			//write out all the mms non matches
			var rs_mmsAll = new readable({objectMode: true})
			var outfile_mmsAll = fs.createWriteStream(pathToResultsOutput + 'mms_to_catalog.json');
			var stringify_mmsAll = jsonStream.stringify("[\n",",\n","\n]\n");
			rs_mmsAll._read = function () {};
			rs_mmsAll.pipe(stringify_mmsAll).pipe(outfile_mmsAll);

			for (var key in bNumberToMms){
				rs_mmsAll.push( { bnumber: key, uuid : bNumberToMms[key] } )
			}

			rs_mmsAll.push(null)

			outfile_mmsAll.on('finish', function () {

				if (cb) cb(bNumberToMms)

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

exports.setBnumberIndex = function(path){
	catalogProcess.setPathToCatalogBindex(path)
}
