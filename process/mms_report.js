/*
	Produces some reports from the master MMS export file
	Split the export into parts based on the record's division
*/



"use strict"

var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  config = require("config"),
  exceptionReport = require("../util/exception_report.js")


var exports = module.exports = {}


var hashFields = {}
var divisions = {}


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


//counts what fields are in the solor has for the final report
exports.countHashFields = function(record){

	if (record['solr_doc_hash']){

		for (var aField in record['solr_doc_hash']){

			var isEmpty = true

			//loop through the values and see if they are empty strings
			if (Array.isArray(record['solr_doc_hash'][aField])){
				for (var x in record['solr_doc_hash'][aField]){

					if (String(record['solr_doc_hash'][aField][x]).trim() != ''){
						isEmpty = false
					}
				}

			}else {

				if (String(record['solr_doc_hash'][aField]).trim() != ''){
					isEmpty = false
				}
			}

			if (!isEmpty){
				if (hashFields[aField]){
					hashFields[aField]++
				}else{
					hashFields[aField] = 1
				}

			}


		}

	}

	return hashFields


}

//counts the number of things in each record, items, containers, collections and the division
exports.countDivision = function(record){

	var division = "Undefined"

	if (record['solr_doc_hash']){
		if (record['solr_doc_hash']['org_unit_name_short']){
			if (divisions[record['solr_doc_hash']['org_unit_name_short']]){
				divisions[record['solr_doc_hash']['org_unit_name_short']]['count']++
			}else{
				divisions[record['solr_doc_hash']['org_unit_name_short']] = { "count" : 1, "code" : record['solr_doc_hash']['org_unit_code'], "items" : 0, "containers" : 0, "collections" : 0, "undefined" : 0 }
			} 

			if (record['d_type']){
				if (record['d_type'] == "Item"){
					divisions[record['solr_doc_hash']['org_unit_name_short']]['items']++
				}else if (record['d_type'] == "Container"){
					divisions[record['solr_doc_hash']['org_unit_name_short']]['containers']++
				}else if (record['d_type'] == "Collection"){
					divisions[record['solr_doc_hash']['org_unit_name_short']]['collections']++
				}
			}else{
				divisions[record['solr_doc_hash']['org_unit_name_short']]['undefined']++
			}

			division = record['solr_doc_hash']['org_unit_code']

		}else{

			if (divisions['Undefined']){
				divisions['Undefined']['count']++
			}else{
				divisions['Undefined']= { "count" : 1, "code" : "Undefined"  }
			}

		}
	}


	return division
}


//exposes the private variable if asked.
exports.returnDivisions = function(){


	return divisions


}
