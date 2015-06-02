"use strict"

var archivesCollections = require("../process/archives_collections.js"),
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


var pathToMmsExtracts = config.get('Storage')['outputPaths']['mms']

var pathToResultsOutput = config.get('Storage')['results']['base']

var pathToArchivesCollections = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesCollections']

var bNumberToArchives = {}



exports.process = function(cb){

	//load bnumbers
	catalogProcess.loadBnumbers(function(allBnumbers){


		archivesCollections.loadData(pathToArchivesCollections,  function(data){

			for (var x in data){




				if (data[x].bNumber){

					if (!allBnumbers[data[x].bNumber]){
						exceptionReport.log("bnumber archives match","archives bnumber not in extract", {title: data[x].title, mss: data[x].mss, bnumber: data[x].bNumber } )
					}else{
						if (bNumberToArchives[data[x].bNumber]){
							bNumberToArchives[data[x].bNumber].push(data[x])
						}else{
							bNumberToArchives[data[x].bNumber] = [data[x]]
						}
					}
				}



			}


			console.log("Writing results")

			//write out all the mms non matches
			var rsArchives = new readable({objectMode: true})
			var outfileArchies = fs.createWriteStream(pathToResultsOutput + 'archives_to_catalog.json');
			var stringifyArchives = jsonStream.stringify("[\n",",\n","\n]\n");
			rsArchives._read = function () {};
			rsArchives.pipe(stringifyArchives).pipe(outfileArchies);

			for (var key in bNumberToArchives){
				rsArchives.push( { bnumber: key, archives : bNumberToArchives[key] } )
			}

			rsArchives.push(null)

			outfileArchies.on('finish', function () {

				if (cb) cb(bNumberToArchives)

			});






		})



	})






}




//set it for testing
exports.setExtractsPath = function(path){
	pathToMmsExtracts = path
}
//set it for testing
exports.setArchivesOutputPath = function(path){
	pathToArchivesOutput = path
}

exports.setArchivesCollections = function(path){
	pathToArchivesCollections = path
}

//set it for testing
exports.setResultsOutput = function(path){
	pathToResultsOutput = path
}

exports.setBnumberIndex = function(path){
	catalogProcess.setPathToCatalogBindex(path)
}
