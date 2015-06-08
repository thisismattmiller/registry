var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	string_score = require("string_score"),
	lineByLineReader = require('line-by-line')


var pathToHathiMappingResultsCompare = "/Users/matt/Downloads/hathi_results.txt"


var lr = new lineByLineReader(pathToHathiMappingResultsCompare)

counter = 0
bindex = {}

//this is the function that will be called for each data line in the file
lr.on('line', function (line) {

	lr.pause()


	var data = line.split("\t")

	if (bindex[data[0]]){

		if (bindex[data[0]] != data[2]){
			console.log("Conflict:\n")
			console.log(bindex[data[0]] + " | " + data[2] )

			console.log("\n\n")
		}
	}else{

		bindex[data[0]] = data[2]

	}




	counter++
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	process.stdout.write( "Total: " + counter )







	lr.resume()


})


lr.on('end', function(obj) {



	console.log("\nDone\n")




})






