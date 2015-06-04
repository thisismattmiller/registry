var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	string_score = require("string_score")


var pathToCatalogClassify = config.get('Storage')['extracts']['catalogClassify']
var pathToHathiMapping = "/Users/matt/Downloads/hathi_full_20150601.txt"
var pathToHathiMappingResults = "/Users/matt/Downloads/hathi_full_20150601_pd.txt"

//var pathToHathiMappingResults = "/Users/matt/Downloads/hathi_tmp"

var pathToHathiMappingResultsCompare = "/Users/matt/Downloads/hathi_results.txt"


var stream = fs.createReadStream(pathToHathiMappingResults, {encoding: 'utf8'})
var parser = jsonStream.parse('*')
var indexOclc = {},indexIsbn = {},indexIssn = {}
var totalRecords = 0

//this is the function that will be called for each data line in the file
var processData = es.mapSync(function (data) {



	//make a lookup for each id type

	for (var x in data.oclc){
		x = data.oclc[x]

		if (!indexOclc[x]){
			indexOclc[x] = { ids: [data.volumeId], title: data.title, hathiId: data.hathiId, enumeration: {} }
		}else{
			indexOclc[x].ids.push(data.volumeId)
		}

		indexOclc[x].enumeration[data.volumeId] = data.enumeration



	}

	for (var x in data.isbn){
		x = data.isbn[x]

		if (!indexIsbn[x]){
			indexIsbn[x] = { ids: [data.volumeId], title: data.title, hathiId: data.hathiId, enumeration: {} }
		}else{
			indexIsbn[x].ids.push(data.volumeId)

		}

		indexIsbn[x].enumeration[data.volumeId] = data.enumeration

	}

	for (var x in data.issn){
		x = data.issn[x]

		if (!indexIssn[x]){
			indexIssn[x] = { ids: [data.volumeId], title: data.title, hathiId: data.hathiId, enumeration: {} }
		}else{
			indexIssn[x].ids.push(data.volumeId)
		}

		indexIssn[x].enumeration[data.volumeId] = data.enumeration


	}




	// bnumbers['b'+data.id] = true
	totalRecords++
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	process.stdout.write( "Loading: " + totalRecords +"|" )




})


parser.on('end', function(obj) {



	var rs = new readable({objectMode: true})
	var outfile = fs.createWriteStream(pathToHathiMappingResultsCompare)
	rs._read = function () {}
	rs.pipe(outfile)


	var rsError = new readable({objectMode: true})
	var outfileError = fs.createWriteStream(pathToHathiMappingResultsCompare + ".errors")
	rsError._read = function () {}
	rsError.pipe(outfileError)





	//now load in the identifier extract

	var streamCatalog = fs.createReadStream(pathToCatalogClassify, {encoding: 'utf8'})
	var parserCatalog = jsonStream.parse('*')
	var totalRecords = 0, totalRecordsAdded = 0

	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		var matchedVolume = [], volEnumerationLookup = {}, title = "", hathiId = ""

		for (var x in data.oclc){

			//loop though all the oclc numbers
			x = data.oclc[x]

			//it is in the index
			if (indexOclc[x]){


				if (typeof data.title == 'string'){
					if (data.title.score(indexOclc[x].title,1) < 0.05){

						rsError.push(indexOclc[x].ids.toString()+"\n")
						rsError.push('b'+data.bnumber + "\t" + data.title  +"\n" )
						rsError.push(indexOclc[x].hathiId + "\t" + indexOclc[x].title  +"\n")
						rsError.push("OCLC Number Match:" + x +"\n\n")
					}
				}

				for (var y in indexOclc[x].ids){

					//y now = the hathi vol id
					y = indexOclc[x].ids[y]

					//use this lookup table for later
					volEnumerationLookup[y] = indexOclc[x].enumeration[y]
					title = indexOclc[x].title

					if (matchedVolume.indexOf(y) == -1){
						matchedVolume.push(y)
					}
				}
			}
		}



		if (matchedVolume.length==0){

			//try the ISBN if there was no hit at all on the oclc

			for (var x in data.isbn){

				//loop though all the oclc numbers
				x = data.isbn[x]

				//it is in the index
				if (indexIsbn[x]){

					if (typeof data.title == 'string'){
						if (data.title.score(indexIsbn[x].title,1) < 0.05){
							rsError.push(indexIsbn[x].ids.toString()+"\n")
							rsError.push('b'+data.bnumber + "\t" + data.title +"\n" )
							rsError.push(indexIsbn[x].hathiId + "\t" + indexIsbn[x].title +"\n")
							rsError.push("ISBN Number Match:" + x + "\n\n")
						}
					}

					for (var y in indexIsbn[x].ids){

						//y now = the hathi vol id
						y = indexIsbn[x].ids[y]

						//use this lookup table for later
						volEnumerationLookup[y] = indexIsbn[x].enumeration[y]
						title = indexIsbn[x].title
						hathiId = indexIsbn[x].hathiId

						if (matchedVolume.indexOf(y) == -1){
							matchedVolume.push(y)
						}
					}
				}
			}

		}



		//try the ISSN

		for (var x in data.issn){

			//loop though all the oclc numbers
			x = data.issn[x]

			//it is in the index
			if (indexIssn[x]){

				if (typeof data.title == 'string'){
					if (data.title.score(indexIssn[x].title,1) < 0.05){
						rsError.push(indexIssn[x].ids.toString()+"\n")
						rsError.push('b'+data.bnumber + "\t" + data.title +"\n" )
						rsError.push(indexIssn[x].hathiId + "\t" + indexIssn[x].title +"\n")
						rsError.push("ISSN Number Match:" + x + "\n\n")
					}
				}

				for (var y in indexIssn[x].ids){

					//y now = the hathi vol id
					y = indexIssn[x].ids[y]

					//use this lookup table for later
					volEnumerationLookup[y] = indexIssn[x].enumeration[y]
					title = indexIssn[x].title
					hathiId = indexIssn[x].hathiId


					if (matchedVolume.indexOf(y) == -1){
						matchedVolume.push(y)
					}
				}
			}
		}




		if (matchedVolume.length>0) {

			totalRecordsAdded++

			//now we need to sort the matches by sources

			var sourceCount = {}

			for (var x in matchedVolume){

				x = matchedVolume[x]

				var source = x.split(".")[0]

				if (!sourceCount[source]){
					sourceCount[source] = [x]
				}else{
					sourceCount[source].push(x)
				}



			}


			//now we pick the largest source
			var use =""
			var useCount = 0
			for (var x in sourceCount){

				if (sourceCount[x].length > useCount){
					use = x
					useCount = sourceCount[x].length
				}
			}

			var finalUse = []

			// for (var x in sourceCount[use]){

			// 	x = sourceCount[use][x]
			// 	finalUse.push({ bnumber: "b" + data.bnumber, vol: volEnumerationLookup[x],  url: 'http://hdl.handle.net/2027/' + x, hathiTitle:  title  })

			// }

			//just add them all

			for (var source in sourceCount){

				for (var x in sourceCount[source]){

					x = sourceCount[source][x]
					finalUse.push({ bnumber: "b" + data.bnumber, vol: volEnumerationLookup[x],  url: 'http://hdl.handle.net/2027/' + x, hathiTitle:  title  })

					//write to file
					rs.push("b" + data.bnumber + "\t" + volEnumerationLookup[x] + "\t"  + hathiId + "\t" + 'http://hdl.handle.net/2027/' + x + "\t" + title + "\n" )

				}
			}




		}



		totalRecords++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( "Processing: " + totalRecords +"|" + totalRecordsAdded )


	})


	parserCatalog.on('end', function(obj) {
		rs.push(null)
		rsError.push(null)
	})



	streamCatalog.pipe(parserCatalog).pipe(processData)

})

stream.pipe(parser).pipe(processData)