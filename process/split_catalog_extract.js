"use strict"

var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	lineByLineReader = require('line-by-line'),
	exceptionReport = require("../util/exception_report.js")


var exports = module.exports = {}

var pathToCatalogExtract = config.get('Storage')['extracts']['catalogFull']
var pathToCatalogResearchOutput = config.get('Storage')['extracts']['catalogResearch']

var pathToCatalogBindexOutput = config.get('Storage')['extracts']['catalogBindex']
var pathToCatalogTmsIndexOutput = config.get('Storage')['extracts']['catalogTmsindex']
var pathToCatalogUniqueIndexOutput = config.get('Storage')['extracts']['catalogUniqueindex']
var pathToCatalogClassify = config.get('Storage')['extracts']['catalogClassify']


var locationsMap = config.get('Catalog')['includeLocations']
var materialTypes = config.get('Catalog')['materialTypes']
var bibCode3 = config.get('Catalog')['bibCode3']
var bibLevels = config.get('Catalog')['bibLevels']



var counter = 0, counterAdded = 0, locations = [], bnumbers = {}

//--------

var excludeMaterialTypes = [
	materialTypes.audioBook,
	materialTypes.dvd,
	materialTypes.eAudioBook,
	materialTypes.eBook,
	materialTypes.eMusic,
	materialTypes.eVideo,
	materialTypes.game,
	materialTypes.kit,
	materialTypes.largePrint,
	materialTypes['3dObject'],
	materialTypes.teacherSet,
	materialTypes.blueRay
]

//we want collections for surre
var includeBibLevels = [bibLevels.archives, bibLevels.collection, bibLevels.subunit ]


var masterCheck = function(bib,line){


	//if it is a new record not yet cataloged or on order or a book set or delete do not use
	if (!checkBibCode3(bib,line)) return false

	//if it is a bib level that is a archives or collection or sub collection we want to include it
	if (checkBibLevel(bib,line)) return true

	//drop the location hammer
	if (!checkLocation(bib,line)) return false

	//do a broad reject of the records that have branch shelf locators
	if (line.search('"marcTag":"091"')>-1){

		//only if it does not have a resarch call number
		if (line.search('"marcTag":"852"')>-1){
			return true
		}else{
			return false
		}

	}

	//reject the dewey
	if (line.search('"marcTag":"082"')>-1){

		//only if it does not have a resarch call number
		if (line.search('"marcTag":"852"')>-1){
			return true
		}else{
			return false
		}

	}

	// //does it have a research call number
	// if (line.search('"marcTag":"852"')>-1){
	// 	return true
	// }




	return true


}


var checkMaterialType = function(bib,line){

	if (excludeMaterialTypes.indexOf(bib.materialType.code) > -1){
		console.log(bib)
		return false
	}else{
		return true
	}

}



//if it is a bib level that is a archives or collection or sub collection we want to include it
var checkBibLevel = function(bib,line){

	if (includeBibLevels.indexOf(bib.bibLevel.code) > -1){
		return true
	}else{
		return false
	}

}


var checkBibCode3 = function(bib, line){

	//if it is a new record being cataloged a book set, or deleted do not include it
	if (bib.fixedFields){
		if (bib.fixedFields['31']){
			if (bib.fixedFields['31'].value){
				if (['f','g','e','d'].indexOf(bib.fixedFields['31'].value) > -1 ){

					return false

				}
			}
		}
	}

	return true


}


var checkLocation = function(bib,line){



	if (bib.fixedFields['26'].value){

		var value = bib.fixedFields['26'].value.trim()
		var display = (bib.fixedFields['26'].display) ? bib.fixedFields['26'].display.trim() : 'undefined'


		if (value == 'multi'){

			return checkMulti(bib, line)

		}else{

			//is it's location description included in our list
			if (locationsMap[display] === false){

				//edge cases for things in circ locations that were miss cataloged
				if (display == 'Electronic Material for Adults'){

					//does it have a research call number
					if (line.search('"marcTag":"852"')>-1){
						return true
					}


				}

				return false


			}else if (locationsMap[display] === true){


				return true


			}else{


				exceptionReport.log("catalog split","unkown location",display)


			}


		}


	}else{

		console.log("No 26 value")


	}




}




var checkMulti = function(bib,line){



	//is it marked as having multiple locations?
	if (line.search('"value":"multi')>-1){

		//does it not have call number we can use to filter stuff out?
		if (line.search('"852",')==-1){

			//does it not have a branch call number (like FIC A)
			if (line.search('"marcTag":"091"')==-1){

				//is it not surpressed? Meaning eiher it needs to be deleted or it is out of service(?)
				if (!bib.suppressed){

					//console.log(JSON.stringify(bib,null,2))

					//is it a DVD or whatever
					if (excludeMaterialTypes.indexOf(bib.materialType.code) == -1){


						//does it have a dewy field
						if (line.search('"marcTag":"082"')==-1){


							//if it has a bib code 3 = f it is not a complete record yet, so ignore it
							if (bib.fixedFields['31'] != 'f' && bib.materialType.code != 'a'){

								return true

								//does it have some subject headings that would filter it out
								//if (line.search('FICTION /')==-1 && line.search('iction."}')==-1){




								//} //dont need to include fiction books

							}// don't neeed to include new book records

						}//dont need to include dewy books



					}//else these are materials we don't want to include

				}else{

					//todo


				}



			}// it does have a branch id so we don't want it in our data




		}else{


			//include it
			return true


		}

	}else{


	}


	return false

}


exports.splitResearchFromFull = function(cb){

	counter = 0
	var buffer = []

	var lr = new lineByLineReader(pathToCatalogExtract)


	var rs = new readable({objectMode: true})
	var outfile = fs.createWriteStream(pathToCatalogResearchOutput)
	var stringify = jsonStream.stringify("[\n",",\n","\n]\n")
	rs._read = function () {}
	rs.pipe(stringify).pipe(outfile)



	lr.on('line', function (line) {


		counter++

		process.stdout.clearLine()
		process.stdout.cursorTo(0)

		process.stdout.write( counter + " - " + counterAdded + " "  )


		//if (counter<7000000) return

		var bib = JSON.parse(line)


		if (masterCheck(bib,line)){
			buffer.push(bib)
		}


		if (buffer.length > 100){
			//pause the line by line
			lr.pause();
			//add the data to the write out stream
			for (var x in buffer){
				counterAdded++
				rs.push(buffer[x])
			}

			//wait for the buffer to drain before resuming
			var interval = setInterval(function(){

				if (rs['_readableState'].length == 0){
					lr.resume();
					clearTimeout(interval)
				}
			},10)
			//drop the buffered data
			buffer = []

		}



	});

	lr.on('end', function () {
		rs.push(null)
	});

	outfile.on('finish', function () {

		if (cb) cb()

	});

}

exports.createBnumberLookup = function(cb){



	var stream = fs.createReadStream(pathToCatalogResearchOutput, {encoding: 'utf8'})

	var parser = jsonStream.parse('*')


	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {
		bnumbers['b'+data.id] = true
		counter++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( counter + " " )
	})


	parser.on('end', function(obj) {


		var bOut = fs.createWriteStream(pathToCatalogBindexOutput)
		bOut.end( JSON.stringify(bnumbers) );

		bOut.on('error', function(error) {
			console.log("Error writing bnumbers file:",error.code)
		})


		bOut.on('finish', function() {
			console.log("Done",pathToCatalogBindexOutput)
			if (cb) cb()

		})


	})


	stream.pipe(parser).pipe(processData)


}

exports.createCallNumberTms = function(cb){


	var stream = fs.createReadStream(pathToCatalogResearchOutput, {encoding: 'utf8'})

	var parser = jsonStream.parse('*')

	var index = {}







	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {




		var display = (data.fixedFields['26'].display) ? data.fixedFields['26'].display.trim() : 'undefined'

		if (display == 'Schwarzman Building - Print Collection Rm 308' || display == 'Schwarzman Building - Photography Collection Rm 308' || display == 'Schwarzman Building - Art & Architecture Rm 300' || display == 'Schomburg Center - Photographs & Prints'){

			//if (data.fixedFields['30'].value == 'k'){

			for (var x in data.varFields){


				if (data.varFields[x].marcTag == '852'){


					for (var xx in data.varFields[x].subfields){
						if (data.varFields[x].subfields[xx].tag == 'h'){



							if (index[data.varFields[x].subfields[xx]]){
								index[data.varFields[x].subfields[xx].content].push('b'+data.id)
							}else{
								index[data.varFields[x].subfields[xx].content]= ['b'+data.id]
							}


						}
					}


				}

			}


		}

		// bnumbers['b'+data.id] = true
		counter++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( counter + " " )


	})


	parser.on('end', function(obj) {


		var bOut = fs.createWriteStream(pathToCatalogTmsIndexOutput)
		bOut.end( JSON.stringify(index,null,2) );

		bOut.on('error', function(error) {
			console.log("Error writing bnumbers file:",error.code)
		})


		bOut.on('finish', function() {
			console.log("Done",pathToCatalogBindexOutput)
			if (cb) cb()

		})


	})


	stream.pipe(parser).pipe(processData)


}


exports.createCallNumberUnique = function(cb){



	var stream = fs.createReadStream(pathToCatalogResearchOutput, {encoding: 'utf8'})

	var parser = jsonStream.parse('*')

	var index = {}

	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		var thisRecordsCallNumbers = []

		for (var x in data.varFields){


			if (data.varFields[x].marcTag == '852'){


				for (var xx in data.varFields[x].subfields){
					if (data.varFields[x].subfields[xx].tag == 'h'){

						if (data.varFields[x].subfields[xx].content){


							if (thisRecordsCallNumbers.indexOf(data.varFields[x].subfields[xx].content) == -1){

								thisRecordsCallNumbers.push(data.varFields[x].subfields[xx].content)

								if (index[data.varFields[x].subfields[xx].content]){
									index[data.varFields[x].subfields[xx].content]++

								}else{
									index[data.varFields[x].subfields[xx].content] = 1
								}

							}

						}

					}
				}


			}

		}



		// bnumbers['b'+data.id] = true
		counter++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( counter + " " )


	})


	parser.on('end', function(obj) {


		var allData = []

		for (var x in index){

			var z = {}
			z[x] = index[x]
			allData.push(z)
		}
		index=null





		var rs = new readable({objectMode: true});
		var outfile = fs.createWriteStream(pathToCatalogUniqueIndexOutput);
		var stringify = jsonStream.stringify("[\n",",\n","\n]\n");
		rs._read = function () {};
		rs.pipe(stringify).pipe(outfile);


		var currentPos = 0
		var allDataLength = allData.length

		var interval = setInterval(function(){

			if (rs['_readableState'].length == 0){

				//add 100 more
				for (var x = 0; x < 101; x++ ){

					currentPos++

					if (allData[currentPos]){

						rs.push(allData[currentPos])
					}

				}


			}

			if (currentPos >= allDataLength) rs.push(null)


		},10)


		outfile.on('finish', function () {

			clearTimeout(interval)
			console.log("\n")

			if (cb) cb()

		});




	})


	stream.pipe(parser).pipe(processData)


}



exports.createClassifyExtract = function(cb){


	//pathToCatalogResearchOutput = '/Users/matt/Desktop/data/results/catalog_test_large.json'

	var stream = fs.createReadStream(pathToCatalogResearchOutput, {encoding: 'utf8'})

	var parser = jsonStream.parse('*')

	var records = []

	var oclcRegExp = new RegExp(/\(ocolc\).*?"/ig)

	var fiveOrMoreNumbersRegExp = new RegExp(/[0-9]{5}/i)

	var totalOclc = 0, totalIsbn = 0, totalIssn = 0, currentPos = 0, totalPossibleOclc = 0

	var doneReading = false, isPaused = false

	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {


		var line = JSON.stringify(data)
		var lineMatch = line.match(oclcRegExp)
		var oclcNumbers = [], isbnNumbers = [], issnNumbers = [], possibleOclc = []
		var title = false, author = false

		for (var x in lineMatch){

			x = lineMatch[x]

			if (x.search("fst") == -1 && x.search("FST") == -1){

				//clean it up
				oclcNumbers.push( x.toLowerCase().replace('(ocolc)','').replace('"','')  )


			}



		}


		//do we not have it yet

		var f001 = false, f003 = false, title = false, f020 = false

		//loop throguh the varfields and store what we need
		for (var x in data.varFields){
			x = data.varFields[x]
			if (x.marcTag == '001') f001 = x.content
			if (x.marcTag == '003') f003 = x.content


			if (x.marcTag == '022'){

				var a = false

				for (var subfield in x.subfields){
					subfield = x.subfields[subfield]

					if (subfield.tag == 'a') a = subfield.content
				}


				if (a){
					issnNumbers.push(a)
				}



			}

			if (x.marcTag == '020'){

				var a = false

				for (var subfield in x.subfields){
					subfield = x.subfields[subfield]

					if (subfield.tag == 'a') a = subfield.content
				}

				if (a){
					try{
						a = a.match(/\d+/)[0]
						isbnNumbers.push(a)
					}catch (e) {
						//no numbers present...
					}
				}

			}

			if (x.marcTag == '245'){
				var a = "", n = "", b =""

				//build the title from $a + $n + $b
				for (var subfield in x.subfields){
					subfield = x.subfields[subfield]

					if (subfield.tag == 'a') a = subfield.content
					if (subfield.tag == 'n') n = subfield.content
					if (subfield.tag == 'b') b = subfield.content

				}
				title = a + " " + n + b
			}

			//look in the 9xx fields we sometimes store oclc numbers in $y
			if (x.marcTag){
				if (x.marcTag.charAt(0) == '9'){


					for (var subfield in x.subfields){
						subfield = x.subfields[subfield]

						if (subfield.content && subfield.tag){
							if (!isNaN(subfield.content) && subfield.tag == 'y'){
								oclcNumbers.push(subfield.content)
							}
						}

					}




				}
			}


		}

		if (f003 && f001){
			if (f003.toLowerCase() == 'ocolc'){

				//pull out the numbers from the string
				try{
					var oclcNumber = f001.match(/\d+/)[0]
					oclcNumbers.push(oclcNumber)
				}catch (e) {
					//no numbers present...
					console.log("\n")
					console.log("weird OCLC:",f001)
				}

			}
		}

		if (f001){

			if (!isNaN(f001)){
				if (oclcNumbers.indexOf(f001.toString().trim()) == -1){
					possibleOclc.push(f001.toString().trim())
				}
			}

		}


		if (data.author) author = data.author

		var record = {

			oclc: oclcNumbers,
			isbn: isbnNumbers,
			issn: issnNumbers,
			possibleOclc: possibleOclc,
			title: title,
			author: author,
			bnumber: data.id

		}


		if (record.oclc.length > 0) totalOclc++
		if (record.possibleOclc.length > 0) totalPossibleOclc++
		if (record.isbn.length > 0) totalIsbn++
		if (record.issn.length > 0) totalIssn++


		//
		//if (lineMatch) console.log(data.id, oclcNumbers)


		// bnumbers['b'+data.id] = true
		counter++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( "Total: " + counter + " OCLC: " + totalOclc + " ISBN: " + totalIsbn + " ISSN: " + totalIssn + " Possible OCLC: " + totalPossibleOclc + " || Wrote: " + currentPos  )


		records.push(record)

		record = null
		oclcNumbers = null
		isbnNumbers = null
		issnNumbers = null
		possibleOclc = null
		line = null
		data = null



	})


	parser.on('end', function(obj) {

		doneReading = true


		console.log("\n\n")
		console.log("total",counter, "totalOclc", totalOclc, "totalIsbn", totalIsbn, "totalIssn", totalIssn, "totalPossibleOclc", totalPossibleOclc )



	})


	stream.pipe(parser).pipe(processData)






	//now we handle the write out stream
	var rs = new readable({objectMode: true})
	var outfile = fs.createWriteStream(pathToCatalogClassify)
	var stringify = jsonStream.stringify("[\n",",\n","\n]\n")
	rs._read = function () {}
	rs.pipe(stringify).pipe(outfile)


	var interval = setInterval(function(){

		if (records.length < 6000) return false

		//if the ratio to read/write is too high pause the read for a min to catch up the write
		if (currentPos/counter <= 0.95){
			isPaused = true
			stream.pause()
		}else{
			if (isPaused){
				isPaused = false
				stream.resume()
			}
		}

		if (rs['_readableState'].length == 0){

			//add 100 more
			for (var x = 0; x < 100; x++ ){

				currentPos++

				if (records[currentPos]){
					rs.push(records[currentPos])

					records[currentPos] = null
				}

			}


		}

		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( "Total: " + counter + " OCLC: " + totalOclc + " ISBN: " + totalIsbn + " ISSN: " + totalIssn + " Possible OCLC: " + totalPossibleOclc + " || Wrote: " + currentPos  )





		if (doneReading){


			if (currentPos >= counter) {
				rs.push(null)
			}
		}



	},10)




	outfile.on('finish', function () {

		clearTimeout(interval)
		console.log("\n")

		if (cb) cb()

	});





}








//set it for testing
exports.setPathToCatalogExtract = function(path){
	pathToCatalogExtract = path
}

exports.setPathToCatalogResearchOutput = function(path){
	pathToCatalogResearchOutput = path
}

exports.setPathToCatalogBindexOutput = function(path){
	pathToCatalogBindexOutput = path
}
