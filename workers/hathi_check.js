var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	string_score = require("string_score")


var counter = 0
var hasHathi = 0

var pathToCatalogResearchOutput = config.get('Storage')['extracts']['catalogResearch']
var pathToHathiMappingCompare = "/Users/matt/Downloads/has_hathi.txt"



var stream = fs.createReadStream(pathToCatalogResearchOutput, {encoding: 'utf8'})

var parser = jsonStream.parse('*')

var records = []


var rs = new readable({objectMode: true})
var outfile = fs.createWriteStream(pathToHathiMappingCompare)
rs._read = function () {}
rs.pipe(outfile)



//this is the function that will be called for each data line in the file
var processData = es.mapSync(function (data) {


	var line = JSON.stringify(data)


	if (line.search('hdl.handle.net') > -1) {

		hasHathi++
		rs.push(data.id.toString()+"\n")



	}



	counter++
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	process.stdout.write( "Total: " + counter + " | " + hasHathi  )


})


parser.on('end', function(obj) {
	rs.push(null)

	console.log("\n\n")


})


stream.pipe(parser).pipe(processData)

