var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	lineByLineReader = require('line-by-line'),
	exceptionReport = require("../util/exception_report.js")





var counter = 0, added = 0


//workfile location
var pathToCatalogClassify = config.get('Storage')['extracts']['catalogClassify']
var pathToHathiMapping = "/Users/matt/Downloads/hathi_full_20150601.txt"
var pathToHathiMappingResults = "/Users/matt/Downloads/hathi_full_20150601_pd.txt"


var splitIt = function(val){

	var r = null

	if (val.search(",")>-1){
		r = val.trim().split(",")
	}else if (val.search(";")>-1){
		r = val.trim().split(";")
	}else{
		r = [val.trim()]
	}


	var finalR = []

	for (var x in r){

		if (r[x]!='') finalR.push(r[x])
	}

	return finalR


}


var rs = new readable({objectMode: true})
var outfile = fs.createWriteStream(pathToHathiMappingResults)
var stringify = jsonStream.stringify("[\n",",\n","\n]\n")
rs._read = function () {}
rs.pipe(stringify).pipe(outfile)
var buffer = []




var lr = new lineByLineReader(pathToHathiMapping)


lr.on('line', function (line) {


	counter++
	// process.stdout.clearLine()
	// process.stdout.cursorTo(0)

	// process.stdout.write( counter + " - "   )


	var data = line.split("\t")

	var mapped = {}

	mapped.volumeId = data[0].trim()
	mapped.access = data[1].trim()
	mapped.rights = data[2].trim()
	mapped.hathiId = data[3].trim()
	mapped.enumeration = data[4].trim()
	mapped.source = data[5].trim()
	mapped.sourceId = data[6].trim()

	mapped.oclc = splitIt(data[7].trim())
	mapped.isbn = splitIt(data[8].trim())
	mapped.issn = splitIt(data[9].trim())
	mapped.lccn = splitIt(data[10].trim())

	mapped.title = data[11].trim()

	//lets clean up their isbns and such

	var isbns = []
	for (var x in mapped.isbn){

		x = mapped.isbn[x].replace(/\.|a|z/g,"").replace(/\)|\(|:|;|\-|\/|£|$|\\/g," ").split(" ")


		for (var xx in x){

			xx =x[xx]

			//is it the right length?
			if (xx.length == 10 || xx.length == 13){
				//add it
				isbns.push(xx)
			}

		}

	}

	mapped.isbn = isbns

	mapped.imprint = data[12].trim()
	mapped.rightsDetermination = data[13].trim()
	mapped.update = data[14].trim()
	mapped.gov = data[15].trim()
	mapped.pubDate = data[16].trim()
	mapped.pubPlace = data[17].trim()
	mapped.language = data[18].trim()
	mapped.bibFormat = data[19].trim()




	if (mapped.rights == 'pd' || mapped.rights == 'pdus'){


		added++
		rs.push(mapped)

	}


	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	process.stdout.write( "Parsing: " + counter + " | "  + added )







});

lr.on('end', function () {
	rs.push(null)
});




