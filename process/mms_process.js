/*


*/



"use strict"

var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  config = require("config"),
  exceptionReport = require("../util/exception_report.js"),
  utils = require("../util/utils.js"),
  libxmljs = require("libxmljs")
  

var exports = module.exports = {}

//we use this to convert the varying identifier names used across the systems to a single vocab
var idThesaurus = config.get('Thesaurus')['mms']

//used for testing, so we can point to test files if we need to
var setPathOverride = false

var pathToMmsSplitDir = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['mmsChildrenSplit']



//stream a file into the action function passing the record to that function
exports.streamRecords = function(options, asyncCallback){

	if (options.abbreviation) 		var abbreviation = options.abbreviation
	if (options.action) 			var action = options.action

	//this is a optional call back if this is being called standalone, not by async
	if (options.unitCb) 			var unitCb = options.unitCb

	//filter on record types
	if (options.collectionFilter)	var collectionFilter = options.collectionFilter


	//load the paths and division ids
	var allDivsions = config.get('MMSDivisions')['all']

	if (!setPathOverride){
		var extractPath = config.get('Storage')['outputPaths']['mms']
	}else{
		var extractPath = setPathOverride
	}

	//return if not a real divsion
	if (allDivsions.indexOf(abbreviation)==-1){
		exceptionReport.log("mms stream record","unkown division",abbreviation)
		console.log("mms stream record","unkown division")
		return false
	}

	//return if we got file problems
	try{
		var stream = fs.createReadStream(extractPath + abbreviation + ".json", {encoding: 'utf8'})
	}catch (err){
		exceptionReport.log("mms stream record","missing division file",extractPath + abbreviation + ".json")
	}	

	//parse it
	var parser = JSONStream.parse('*')


	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		if (collectionFilter){
			if (data['d_type']){
				if (data['d_type'] == 'Collection'){
					action(data)
				}
			}else{
				action(data)
			}
		}else{
			action(data)
		}
	})


	//this event happens when the file has been completely read
	parser.on('end', function(obj) {


		//if there is a callback defined from a standalone call execute
		if (unitCb){
			unitCb()
		}		

		//if there is a async callback (running in parallel so it needs to exectue for async to know it is totaly finshed)
		if (asyncCallback){
			asyncCallback(null,true)
		}

		return true

	})
		
	//kick it off, pipe the data to the json parser to the data processor function processData
	stream.pipe(parser).pipe(processData)

}


//given a mms extract record pull out the required identifiers
exports.extractIds = function(record){

	var idents = {}

	//get the mss system identifers

	if (record['d_id']){
		idents['mmsDb'] = record['d_id'] +""
	}
	if (record['d_type']){
		idents['mmsType'] = record['d_type']
	}
	if (record['uuid']){
		idents['mmsUuid'] = record['uuid']
	}

	//the solr doc hash title is sometimes messed up with encoding errors
	// so pull it out below from the xml
	// if (record['solr_doc_hash']['title']){
	// 	if (record['solr_doc_hash']['title'].length>0){
	// 		idents['title'] = ""
	// 		for (var x in record['solr_doc_hash']['title']){
	// 			idents['title']+= record['solr_doc_hash']['title'][x] + ' '

	// 		}
	// 		idents['title']=idents['title'].trim()
	// 		idents['titleLast'] = record['solr_doc_hash']['title'][record['solr_doc_hash']['title'].length-1].trim()
	// 	}

	// }


	if (record['xml']){


		//record['xml'] = '<mods xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://uri.nypl.org/schema/nypl_mods" version="3.4" xsi:schemaLocation="http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods"> <titleInfo ID="titleInfo_0" usage="primary" supplied="no" lang="eng"><nonSort>The </nonSort><title>Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ...</title></titleInfo><name ID="name_0" type="personal" authority="naf" valueURI="" authorityRecordId=""><namePart>Newbery, John (1713-1767)</namePart><affiliation/><role><roleTerm valueURI="http://id.loc.gov/vocabulary/relators/aut" authority="marcrelator" type="code">aut</roleTerm><roleTerm valueURI="http://id.loc.gov/vocabulary/relators/aut" authority="marcrelator" type="text">Author</roleTerm></role></name><name ID="name_1" type="personal" authority="naf" valueURI="" authorityRecordId=""><namePart>Goldsmith, Oliver (1730?-1774)</namePart><affiliation/><role><roleTerm valueURI="http://id.loc.gov/vocabulary/relators/aut" authority="marcrelator" type="code">aut</roleTerm><roleTerm valueURI="http://id.loc.gov/vocabulary/relators/aut" authority="marcrelator" type="text">Author</roleTerm></role></name><name ID="name_2" type="personal" authority="naf" valueURI="" authorityRecordId=""><namePart>Telescope, Tom</namePart><affiliation/><role><roleTerm valueURI="http://id.loc.gov/vocabulary/relators/aut" authority="marcrelator" type="code">aut</roleTerm><roleTerm valueURI="http://id.loc.gov/vocabulary/relators/aut" authority="marcrelator" type="text">Author</roleTerm></role></name><originInfo ID="originInfo_0"><dateIssued encoding="w3cdtf" keyDate="yes">1761</dateIssued><place><placeTerm>London</placeTerm></place></originInfo><note ID="note_0" type="content">"To the young gentlemen and ladies of Great Britain and Ireland, this philosophy of tops and balls is ... inscribed, by ... J. Newbery": 3d prelim. p.</note><note ID="note_1" type="content">For variations see: Babson Institute Library Newton Collection, 115//</note><note ID="note_2" type="content">Imperfect: p. 111-112 mutilated, affecting 2 words of text.</note><note ID="note_3" type="content">Publisher\'s advertisements: p. 126-140.</note><note ID="note_4" type="content">Sometimes attributed to Oliver Goldsmith.</note><identifier ID="identifier_0" type="local_hades" displayLabel="Hades struc ID (legacy)">618679</identifier><identifier ID="identifier_1" type="local_other" displayLabel="RLIN/OCLC">NYPG784271303-B</identifier><identifier ID="identifier_2" type="local_catnyp" displayLabel="CATNYP ID (legacy)">b1493851</identifier><identifier ID="identifier_3" type="local_bnumber" displayLabel="NYPL catalog ID (B-number)">b10483503</identifier><location ID="location_0"><physicalLocation authority="marcorg" type="repository">nn</physicalLocation><physicalLocation type="division">Berg Collection</physicalLocation><shelfLocator>Berg Coll. 77-645</shelfLocator></location></mods>'

		try{
			var xmlDoc = libxmljs.parseXml(record['xml'])
		} catch (err) {
			exceptionReport.log("mms process","invalid MODS record",{error: err, data: record})
			return idents
		}





		var children = xmlDoc.root().childNodes();
		for (var aChild in children){

			var n = children[aChild]

			if (n.name() == 'identifier'){

				var type = false,
				 	value = n.text()


				var attrs = n.attrs()

				for (var aAttr in attrs){

					var a = attrs[aAttr]

					if (a.name() == "type")
						type = a.value()

					//mms stores their identifiers differntly when it is a local_other, it uses the display label, overwrite the type if has a display label 
					if (a.name() == "displayLabel" || a.name() == "display_label")
						type = a.value()

				}



				if (idThesaurus[type]){

					//blah
					value=value.replace('archives_components_','')

					//this might happen, just to keep track of it
					if (idents[idThesaurus[type]]){
						exceptionReport.log("mms process","overwriting identifiers",type + ":" + JSON.stringify(record))
					}

					idents[idThesaurus[type]] = value





				}else{
					exceptionReport.log("mms process","new identifier",n.toString())

				}

			}


			if (n.name() == 'location'){
				var locations = n.childNodes();

				for (var aLoc in locations){
					if (locations[aLoc].name() == 'shelfLocator' || locations[aLoc].name() == 'shelfocator')
						idents['callNumber'] = locations[aLoc].text()
				}
			}


			if (n.name() == 'titleInfo'){
				idents['title'] = n.text().trim()


			}

		}

	}


	//normalize the bnumber
	if (idents['bNumber']){
		idents['bNumber'] = utils.normalizeBnumber(idents['bNumber'])
	}


	return idents

}


//given a mms collection file (split children) process it and return the hierarch layout
exports.returnChildHierarchyLayout = function(collectionUuid, cb){

	var hierarchyMap = {}


	//return if we got file problems
	var stream = fs.createReadStream(pathToMmsSplitDir + collectionUuid + ".json", {encoding: 'utf8'})

	stream.on('error', function (error) {
		console.log("Caught", error)
		if (cb) cb()
	})
	



	//parse it
	var parser = JSONStream.parse('*')


	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		//make an entry
		hierarchyMap[data['uuid']] = {}


		hierarchyMap[data['uuid']]['matchedArchives'] = false
		hierarchyMap[data['uuid']]['data'] = data

		if (data['d_type'] == 'Container'){

			//is it's parent the collection?
			if (data['solr_doc_hash']['container_uuid']){

				//no
				hierarchyMap[data['uuid']]['depth'] = hierarchyMap[  data['solr_doc_hash']['container_uuid']  ]['depth'] + 1
				hierarchyMap[data['uuid']]['parent'] = data['solr_doc_hash']['container_uuid']
				hierarchyMap[data['uuid']]['parentName'] = data['solr_doc_hash']['container_name']
				hierarchyMap[data['uuid']]['parentTitle'] = hierarchyMap[  data['solr_doc_hash']['container_uuid']  ]['idents']['title']
				hierarchyMap[data['uuid']]['hasChildren'] = true
				hierarchyMap[data['uuid']]['idents'] = exports.extractIds(data)




			}else{

				//yes
				hierarchyMap[data['uuid']]['depth'] = 1
				hierarchyMap[data['uuid']]['parent'] = data['solr_doc_hash']['collection_uuid']
				hierarchyMap[data['uuid']]['parentName'] = data['solr_doc_hash']['collection_name']
				hierarchyMap[data['uuid']]['hasChildren'] = true
				hierarchyMap[data['uuid']]['idents'] = exports.extractIds(data)



			}

		}else{

			//item
			hierarchyMap[data['uuid']]['depth'] = hierarchyMap[  data['solr_doc_hash']['container_uuid']  ]['depth'] + 1
			hierarchyMap[data['uuid']]['parent'] = data['solr_doc_hash']['container_uuid']
			hierarchyMap[data['uuid']]['parentName'] = data['solr_doc_hash']['container_name']
			hierarchyMap[data['uuid']]['parentTitle'] = hierarchyMap[  data['solr_doc_hash']['container_uuid']  ]['idents']['title']
			hierarchyMap[data['uuid']]['hasChildren'] = false	
			hierarchyMap[data['uuid']]['idents'] = exports.extractIds(data)


		}

	})




	//this event happens when the file has been completely read
	parser.on('end', function(obj) {


		if (cb) cb(hierarchyMap)

		return hierarchyMap

	})
		
	//kick it off, pipe the data to the json parser to the data processor function processData
	stream.pipe(parser).pipe(processData)



}


//override the path if we are testing
exports.setPathOverride = function(path){
	setPathOverride = path
}


exports.setExtractsSplitPath = function(path){
	pathToMmsSplitDir = path
}

