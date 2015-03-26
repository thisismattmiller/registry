"use strict"

var mssProcess = require("../process/mms_process.js"),
	archivesLoad = require("../process/archives_collections.js"),
	exceptionReport = require("../util/exception_report.js"),
  	config = require("config")


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


exports.process = function(){


	//load the mms division that need to be processed through the archives comparison
	exports.loadDivisionsAbbreviations()








}



//mostly for testing, rest the array to test diffrent modes
exports.loadDivisionsReset = function(){
	useDivision = []
}
exports.setExtractsPath = function(path){
	pathToMmsExtracts = path
}

