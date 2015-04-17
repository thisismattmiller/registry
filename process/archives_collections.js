/*
	Load the archives collection extract and provide some lookup methods
*/


"use strict"

var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  config = require("config"),
  utils = require("../util/utils")
  


var exports = module.exports = {}

var archivesCollections = {}

//this holds all the normalized identifiers as keys to do quick lookups before doing more expensive comparsions
var archivesCollectionsIdentfierIndex = {
	//we have set nubmer of identifiers that appear in archives collections
	callNumber 	: {},
	mss 		: {},
	bNumber 	: {},
	barcode 	: {},
	mssDb 		: {}
}

//we use this to convert the varying identifier names used across the systems to a single vocab
var idThesaurus = config.get('Thesaurus')['archives']


exports.loadData = function(dataSource, cb){

	var stream = fs.createReadStream(dataSource, {encoding: 'utf8'}),
		parser = JSONStream.parse('*')

	//this is the function that will be called for each data line in the archives export
	var processData = es.map(function (data, callback) {
		exports.extractIds(data)	
	})


	parser.on('end', function(obj) {

		//callback and pass the data object in the local namespace
		if (cb)	cb(archivesCollections)


	})


	stream.pipe(parser).pipe(processData)
	

}


//we modify the large master object in the namespace but also return the ident obj extract for independent use
exports.extractIds = function(data){



	if (data['id'] && data['active']){

		archivesCollections[data['id']] = {'callNumber': false, 'mss': false, 'bNumber': false, 'barcode': false, 'matchedMms':false}

		if (data['data']){

			var d = data['data']


			if (d['unitid']){
				for (var x in d['unitid']){
					if (d['unitid'][x]['type'] && d['unitid'][x]['value']){

						if (d['unitid'][x]['value'] != "")

							//console.log("####",idThesaurus[d['unitid'][x]['type']],"####",d['unitid'][x]['value'], "####", data['title'] )

							archivesCollections[data['id']][ idThesaurus[d['unitid'][x]['type']] ] = d['unitid'][x]['value']

							archivesCollectionsIdentfierIndex[idThesaurus[d['unitid'][x]['type']]][utils.normalize(d['unitid'][x]['value'])] = 1

					}
				}
			}

			if (d['keydate']){
				archivesCollections[data['id']]['keydate'] = d['keydate']
			}else{
				archivesCollections[data['id']]['keydate'] = false
			}

			if (d['date_inclusive_start']){
				archivesCollections[data['id']]['date_inclusive_start'] = d['date_inclusive_start']
			}else{
				archivesCollections[data['id']]['date_inclusive_start'] = false
			}

			if (d['date_inclusive_end']){
				archivesCollections[data['id']]['date_inclusive_end'] = d['date_inclusive_end']
			}else{
				archivesCollections[data['id']]['date_inclusive_end'] = false
			}

		}

		if (data['bnumber']){
			archivesCollections[data['id']][ idThesaurus['bnumber'] ] = data['bnumber']
				archivesCollectionsIdentfierIndex['bNumber'][utils.normalize(data['bnumber'])] = 1
		}

		if (data['title']){
			archivesCollections[data['id']]['title'] = data['title']
		}else{
			archivesCollections[data['id']]['title'] = false
		}

		//only set it if it is not yet set
		if (data['call_number']){
			if (!archivesCollections[data['id']][ idThesaurus['call_number'] ]) archivesCollections[data['id']][ idThesaurus['call_number'] ]  = data['call_number']
			archivesCollectionsIdentfierIndex[idThesaurus['call_number']][utils.normalize(data['call_number'])] = 1
		}

		if (data['origination']){
			archivesCollections[data['id']]['origination'] = data['origination']
		}else{
			archivesCollections[data['id']]['origination'] = false
		}

		if (data['id']){
			archivesCollections[data['id']][ idThesaurus['portal_id'] ] = data['id']
		}else{
			archivesCollections[data['id']][ idThesaurus['portal_id'] ] = false
		}

		//normalize the bnumber
		archivesCollections[data['id']]['bNumber'] = utils.normalizeBnumber(archivesCollections[data['id']]['bNumber'])



	}



	return archivesCollections[data['id']]


}


//Pass a object with the identifer field to search and the value
//example: { "bNumber" : "b1234", 'mss' : 1234 }
exports.matchIdentifier = function(lookFor){

	var results = []


	for (var dbId in archivesCollections){

		var x = archivesCollections[dbId]

		for (var key in lookFor){
			if (x[key]){

				if (utils.normalize(x[key]) == utils.normalize( lookFor[key] )){
					if (results.indexOf(x)==-1)	results.push(x)
				}
			}
		}

	}

	return results
}

//looks to see if this is a possible value in the lookup index, used for fast matching
//just the value: "b1234568"
exports.matchIdentifierIndex = function(lookIn,lookFor){
	
	if (archivesCollectionsIdentfierIndex[lookIn]){

		if (archivesCollectionsIdentfierIndex[lookIn][lookFor]){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}


exports.markAsMmsMatched = function(portal_id){


	if (archivesCollections[portal_id]){
		archivesCollections[portal_id]['matchedMms'] = true
	}else{
		return false
	}

	return archivesCollections[portal_id]
}















