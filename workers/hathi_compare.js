var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	string_score = require("string_score")


var pathToCatalogClassify = config.get('Storage')['extracts']['catalogClassify']
var pathToHathiMappingResults = "/Users/matt/Downloads/hathi_full_20150601_pd.txt"

//var pathToHathiMappingResults = "/Users/matt/Downloads/hathi_tmp"

var pathToHathiMappingResultsCompare = "/Users/matt/Downloads/hathi_results.txt"


var stream = fs.createReadStream(pathToHathiMappingResults, {encoding: 'utf8'})
var parser = jsonStream.parse('*')
var indexOclc = {},indexIsbn = {},indexIssn = {}
var totalRecords = 0, totalVols = 0

//this is the function that will be called for each data line in the file
var processData = es.mapSync(function (data) {



	//make a lookup for each id type

	for (var x in data.oclc){
		x = data.oclc[x]

		//some dirty data...
		if (x == '10' || x == '12') continue

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
	var totalRecords = 0, totalRecordsAdded = 0, totalSuppressed = 0
	var bIndex = {}

	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		var matchedVolume = [], volEnumerationLookup = {}, title = "", hathiId = ""

		for (var x in data.oclc){

			//loop though all the oclc numbers
			x = data.oclc[x]

			//it is in the index
			if (indexOclc[x]){

				title = indexOclc[x].title
				hathiId = indexOclc[x].hathiId

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

					title = indexIsbn[x].title
					hathiId = indexIsbn[x].hathiId

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

				title = indexIssn[x].title
				hathiId = indexIssn[x].hathiId


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

					if (matchedVolume.indexOf(y) == -1){
						matchedVolume.push(y)
					}
				}
			}
		}




		if (matchedVolume.length>0) {

			totalRecordsAdded++
			totalVols = totalVols + matchedVolume.length

			bIndex["b" + data.bnumber] = true

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


			// for (var x in sourceCount[use]){

			// 	x = sourceCount[use][x]
			// 	finalUse.push({ bnumber: "b" + data.bnumber, vol: volEnumerationLookup[x],  url: 'http://hdl.handle.net/2027/' + x, hathiTitle:  title  })

			// }

			//just add them all
			var addedVolumes = []
			var finalAdd = []

			for (var source in sourceCount){

				for (var x in sourceCount[source]){

					x = sourceCount[source][x]

					var add = true

					if (volEnumerationLookup[x].trim() != ''){
						//strip out common abbr to get at the vol number
						var vol = volEnumerationLookup[x].replace(/\./gi,'').replace(/v/gi,'').trim()
						if (addedVolumes.indexOf(vol) == -1){
							add = true
							addedVolumes.push(vol)
						}else{
							add = false
							//console.log("Not adding ",volEnumerationLookup[x],addedVolumes)
						}

					}

					if (x.split('.')[0]=='nyp') add = true


					var linkText = (volEnumerationLookup[x].trim() == '') ? 'Full text available via HathiTrust' : 'Full text available via HathiTrust - '



					//write to file
					//if (add) rs.push("b" + data.bnumber + "\t" + volEnumerationLookup[x] + "\t"  + hathiId + "\t" + 'http://hdl.handle.net/2027/' + x + "\t" + title + "\n" )
					if (add) finalAdd.push("b" + data.bnumber + "\t" + 'http://hdl.handle.net/2027/' + x + "\t" + linkText + volEnumerationLookup[x] + "\n" )
				}
			}

			if (finalAdd.length > 10){

				//too many vols add a link to the hathi landing page

				rs.push("b" + data.bnumber + "\t" + 'http://catalog.hathitrust.org/Record/' + hathiId + "\t" + 'Full text available via HathiTrust' + "\n")

			}else{

				for (var f in finalAdd){
					rs.push(finalAdd[f])
				}


			}


		}



		totalRecords++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( "Processing: " + totalRecords +"|" + totalRecordsAdded)


	})


	parserCatalog.on('end', function(obj) {

		rs.push(null)
		rsError.push(null)

		console.log("\nDone\n")
		console.log("index keys:", Object.keys(bIndex).length)
		console.log("counter:",totalRecordsAdded)
		console.log("total vosl.:",totalVols)


	})



	streamCatalog.pipe(parserCatalog).pipe(processData)

})

stream.pipe(parser).pipe(processData)