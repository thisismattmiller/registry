var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	string_score = require("string_score"),
	lineByLineReader = require('line-by-line')


var counter = 0
var isSuppressed = 0
var found = 0

var pathToCatalogResearchOutput = config.get('Storage')['extracts']['catalogResearch']
var pathToHathiMappingResultsCompare = "/Users/matt/Downloads/hathi_results.txt"



var lr = new lineByLineReader(pathToHathiMappingResultsCompare)

var lookup = {}

//this is the function that will be called for each data line in the file
lr.on('line', function (line) {

	var b = line.substr(1,8)


	// if (lookup[b]){
	// 	console.log("Dupe:",b)
	// }
	lookup[b] = line


})


lr.on('end', function(obj) {


	console.log("\n\n")

	console.log(Object.keys(lookup).length + "\n")


	var stream = fs.createReadStream(pathToCatalogResearchOutput, {encoding: 'utf8'})

	var parser = jsonStream.parse('*')



	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {




		if(lookup[data.id.toString()]){


			if (data.suppressed){
				isSuppressed++
				console.log(lookup[data.id.toString()])
			}

			found++


		}


		counter++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( "Total: " + counter + "found: " + found + " | suppressed: " + isSuppressed  )


	})


	parser.on('end', function(obj) {


		console.log("\n\n")


	})


	stream.pipe(parser).pipe(processData)




})






