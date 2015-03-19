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
var types = []

exports.loadData = function(dataSource, cb){

	var stream = fs.createReadStream(dataSource, {encoding: 'utf8'}),
		parser = JSONStream.parse('*')

	//this is the function that will be called for each data line in the archives export
	var processData = es.map(function (data, callback) {


		if (data['id'] && data['active']){

			archivesCollections[data['id']] = {'local_call': false, 'local_mss': false, 'local_b': false, 'local_barcode': false, 'matched':false}

			if (data['data']){

				var d = data['data']


				if (d['unitid']){
					for (var x in d['unitid']){
						if (d['unitid'][x]['type'] && d['unitid'][x]['value']){
							archivesCollections[data['id']][d['unitid'][x]['type']] = d['unitid'][x]['value']

							if (types.indexOf(d['unitid'][x]['type'])==-1){
								types.push(d['unitid'][x]['type'])
							}
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
				archivesCollections[data['id']]['bnumber'] = data['bnumber']
			}else{
				archivesCollections[data['id']]['bnumber'] = false
			}

			if (data['title']){
				archivesCollections[data['id']]['title'] = data['title']
			}else{
				archivesCollections[data['id']]['title'] = false
			}

			if (data['call_number']){
				archivesCollections[data['id']]['call_number'] = data['call_number']
			}else{
				archivesCollections[data['id']]['call_number'] = false
			}

			if (data['origination']){
				archivesCollections[data['id']]['origination'] = data['origination']
			}else{
				archivesCollections[data['id']]['origination'] = false
			}

			if (data['id']){
				archivesCollections[data['id']]['portal_id'] = data['id']
			}else{
				archivesCollections[data['id']]['portal_id'] = false
			}



		}

		


	})



	parser.on('end', function(obj) {

		//console.log(archivesCollections)

		if (cb)
			cb(archivesCollections)


	})


	stream.pipe(parser).pipe(processData)
	

}


exports.matchIdentifier = function(lookFor){

	var results = []


	for (var dbId in archivesCollections){

		var x = archivesCollections[dbId]

		if (utils.normalize(x['local_call']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}else if (utils.normalize(x['local_mss']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}else if (utils.normalize(x['local_b']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}else if (utils.normalize(x['local_barcode']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}else if (utils.normalize(x['bnumber']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}else if (utils.normalize(x['call_number']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}else if (utils.normalize(x['local_call']) == utils.normalize(lookFor)){
			results.push(x)
			continue
		}


	}

	
	return results
}

exports.markAsMatched = function(portal_id){


	if (archivesCollections[portal_id]){
		archivesCollections[portal_id]['matched'] = true
	}else{
		return false
	}

	return archivesCollections[portal_id]
}















