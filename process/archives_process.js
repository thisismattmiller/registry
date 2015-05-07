/*


*/


"use strict"

var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  config = require("config"),
  exceptionReport = require("../util/exception_report.js"),
  utils = require("../util/utils.js")
  

var exports = module.exports = {}

var pathToArchivesSplitDir = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesComponentsSplit']

//we use this to convert the varying identifier names used across the systems to a single vocab
var idThesaurus = config.get('Thesaurus')['archives']


//given a archives collection id (DBid) process the components into a hiearchy map
exports.returnComponentHierarchyLayout = function(collectionId, cb){

	var hierarchyMap = {}


	//return if we got file problems
	var stream = fs.createReadStream(pathToArchivesSplitDir + collectionId + ".json", {encoding: 'utf8'})
	
	stream.on('error', function (error) {
		
		if (error.code == 'ENOENT'){
			console.log(collectionId, "has no children")
		}else{
			console.log("Caught", error)
		}
		

		if (cb) cb(false)
	})



	//parse it
	var parser = JSONStream.parse('*')


	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		//make an entry
		hierarchyMap[data['id']] = {}

		hierarchyMap[data['id']]['id'] = data['id']
		hierarchyMap[data['id']]['matchedMms'] = false
		hierarchyMap[data['id']]['depth'] = data['level_num']
		hierarchyMap[data['id']]['parent'] = data['parent_id']

		hierarchyMap[data['id']]['data'] = data
		hierarchyMap[data['id']]['idents'] = exports.returnIdents(data)
		hierarchyMap[data['id']]['hasChildren'] = data['has_children']


		//if we have the data set it now
		if (hierarchyMap[data['id']]['depth'] != 1 && hierarchyMap[data['parent_id']]){
			hierarchyMap[data['id']]['parentTitle'] = hierarchyMap[data['parent_id']]['idents']['title']
			hierarchyMap[data['id']]['parentName'] = hierarchyMap[data['id']]['parentTitle']
		}



	})


	//this event happens when the file has been completely read
	parser.on('end', function(obj) {

		for (var x in hierarchyMap){

			//check if the parent title is set if it is not level 1, if it is not then the components were not laoded
			//in order so we need to update it
			if (!hierarchyMap[x]['parentTitle']){

				if (hierarchyMap[x]['depth'] == 1){
					hierarchyMap[x]['parentTitle'] = false
					hierarchyMap[x]['parentName'] = false
				}else{

					if ( hierarchyMap[ hierarchyMap[x]['data']['parent_id'] ] ){

						hierarchyMap[x]['parentTitle'] = hierarchyMap[ hierarchyMap[x]['data']['parent_id'] ]['idents']['title']
						hierarchyMap[x]['parentName'] = hierarchyMap[x]['parentTitle']
					}else{
						hierarchyMap[x]['parentTitle'] = false
						hierarchyMap[x]['parentName'] = false

					}

				}


			}

		}


		if (cb) cb(hierarchyMap)
		return hierarchyMap

	})
		
	//kick it off, pipe the data to the json parser to the data processor function processData
	stream.pipe(parser).pipe(processData)

}

exports.returnIdents = function(data){

	var idents = {callNumber: false, mss: false, bNumber: false, barcode: false, dates: []}

	if (data['data']){

		var d = data['data']

		if (d['unitid']){
			for (var x in d['unitid']){
				if (d['unitid'][x]['type'] && d['unitid'][x]['value']){

					if (d['unitid'][x]['value'] != "")
						idents[ idThesaurus[d['unitid'][x]['type']] ] = d['unitid'][x]['value']
				}
			}
		}

		if (d['keydate']){
			idents['keydate'] = d['keydate']
			idents['dates'].push(d['keydate'])
		}else{
			idents['keydate'] = false
		}

		if (d['date_inclusive_start']){
			idents['date_inclusive_start'] = d['date_inclusive_start']
			idents['dates'].push(d['date_inclusive_start'])
		}else{
			idents['date_inclusive_start'] = false
		}

		if (d['date_inclusive_end']){
			idents['date_inclusive_end'] = d['date_inclusive_end']
			idents['dates'].push(d['date_inclusive_end'])
		}else{
			idents['date_inclusive_end'] = false
		}

		if (d['unitdate']){

			for (var x in d['unitdate']){

				var ud = d['unitdate'][x]

				for (var y in ud){

					if (y == "value" || y == "normal") idents['dates'].push(ud[y])

				}

			}

		}

	}

	if (data['bnumber']){
		idents[ idThesaurus['bnumber'] ] = data['bnumber']
			archivesCollectionsIdentfierIndex['bNumber'][utils.normalize(data['bnumber'])] = 1
	}

	if (data['title']){
		idents['title'] = data['title']
	}else{
		idents['title'] = false
	}

	//only set it if it is not yet set
	if (data['call_number']){
		if (!idents[ idThesaurus['call_number'] ]) idents[ idThesaurus['call_number'] ]  = data['call_number']
		archivesCollectionsIdentfierIndex[idThesaurus['call_number']][utils.normalize(data['call_number'])] = 1
	}

	if (data['origination']){
		idents['origination'] = data['origination']
	}else{
		idents['origination'] = false
	}

	if (data['id']){
		idents[ idThesaurus['portal_id'] ] = data['id']
	}else{
		idents[ idThesaurus['portal_id'] ] = false
	}

	//normalize the bnumber
	idents['bNumber'] = utils.normalizeBnumber(idents['bNumber'])


	//in archives the title will be null or empty sometimes, in that case we use try to use the date statement
	if (!idents['title'] && data['date_statement']) idents['title'] = data['date_statement'] 


	idents['sourceSystem'] = 'archives'

	return idents


}


exports.setExtractsSplitPath = function(path){
	pathToArchivesSplitDir = path
}

