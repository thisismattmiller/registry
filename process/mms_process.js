/*


*/



"use strict"

var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  config = require("config"),
  exceptionReport = require("../util/exception_report.js"),
  libxmljs = require("libxmljs")
  

var exports = module.exports = {}

//we use this to convert the varying identifier names used across the systems to a single vocab
var idThesaurus = config.get('Thesaurus')['mms']




//stream a file into the action function passing the record to that function
exports.streamRecords = function(abbreviation, action, cb){


	//load the paths and division ids
	var allDivsions = config.get('MMSDivisions')['all']
	var extractPath = config.get('Storage')['outputPaths']['mms']

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

		//console.log(data)


	})


	//this event happens when the file has been completely read
	parser.on('end', function(obj) {


		//if there is a callback defined, execute
		if (cb){
			cb()
		}		

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

		}

	}


	return idents

}


//the main function pass it the path to the export, and where to put the files 
exports.process = function(pathToMMSExport, outputPath, cb){


	//path to the data dir if it is not passed then use the config setting
	var mms_out = (outputPath) ? outputPath : config.get('MMSDivisions')['outputPaths']['mms']

	var recordCount = 0

	var outBuffer = {}

	var allDivsions = config.get('MMSDivisions')['all']

	var stream = fs.createReadStream(pathToMMSExport, {encoding: 'utf8'}),
		parser = JSONStream.parse('*'),
		parserOut = JSONStream.stringify(),

		//this is the function that will be called for each data line in the mms export
		processData = es.mapSync(function (data) {


			process.stdout.write("Record " + recordCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\r")
			recordCount++

			//make a filename safe divsion code
			var division = exports.countDivision(data).toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,"")
			exports.countHashFields(data)

			
			//make sure we know all the divsions, set a log to warn if we do not
			if (allDivsions.indexOf(division) == -1) {
				exceptionReport.log("split mms","new division",data)
			}

			//split it into seperate files based on division 

			if (!outBuffer[division]){
				var tmp = fs.createWriteStream(mms_out + division + ".json", {encoding: 'utf8', flags: "w"})
				tmp.write("[\n")
				outBuffer[division] = []
				tmp.end()
			}


			if (outBuffer[division].length >= 501){		
				//cut off the array brackets and make new lines for each record so it is more sanse than single infifinity line of json 
				var string = JSON.stringify(outBuffer[division]).slice(1, -1).replace(/\},\{/gi,"},\n{")
				outBuffer[division] = []
				var tmp = fs.createWriteStream(mms_out + division + ".json", {'encoding': 'utf8', 'flags': 'a'})
				tmp.write(string + ",")
				tmp.end()
			}else{
				outBuffer[division].push(data)
			}



		})

	//this event happens when the file has been completely read, when that happens empty out any leftover data in the buffer
	parser.on('end', function(obj) {

		for (var x in outBuffer){

			var tmp = fs.createWriteStream(mms_out + x + ".json", {'encoding': 'utf8', 'flags': 'a'})

			if (outBuffer[x].length > 0){
				var string = JSON.stringify(outBuffer[x]).slice(1, -1).replace(/\},\{/gi,"},\n{")
				tmp.write(string + "\n]")
			}else{
				tmp.write("{}" + "\n]")
			}

			tmp.end()
		}

		var report = {}
		report['hashFields'] = hashFields
		report['divisions'] = divisions



		fs.writeFile(mms_out + "report.json", JSON.stringify(report, null, 4), function(err) {
			if(err) {
				console.log(err)
			} else {
				//console.log("JSON saved to " + mms_out + "/report.json")
			}
		})


		//if there is a callback defined, execute
		if (cb){
			cb()
		}		

	})
		
	//kick it off, pipe the data to the json parser to the data processor function processData
	stream.pipe(parser).pipe(processData)

}
