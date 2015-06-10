"use strict"

var config = require("config"),
	fs = require("fs"),
	readable = require('stream').Readable,
    lineByLineReader = require('line-by-line')


var billingsExtract = config.get('Storage')['extracts']['billingsMainDump']
var billingsExtractResults = config.get('Storage')['extracts']['billingsMainDump'] + ".tsv"




//find if the line has a billings on it
var billingsLineRegExp = new RegExp(/\.{10,}\s*(.*?)\s/)
var titleRegExp = new RegExp(/(.*?)\.{5}/)



//put each line into memeory

var lr = new lineByLineReader(billingsExtract)


var lines = []


lr.on('line', function (line) {

	lr.pause()

	lines.push(line.replace("	.	",'. '))

	setTimeout(function(){
		lr.resume()
	},0)


})


lr.on('end', function (x) {


	var previousLineIsPartOfRecord = {}, isTitle = {}, results = {}

	for (var x in lines){

		var line = lines[x] + "\n"


		previousLineIsPartOfRecord[x] = false

		var previousLine1 = lines[x-1],
			previousLine2 = lines[x-2],
			previousLine3 = lines[x-3],
			nextLine1 = lines[parseInt(x)+1],
			nextLine2 = lines[parseInt(x)+2],
			nextLine3 = lines[parseInt(x)+3]


		var m = line.match(billingsLineRegExp)

		isTitle[x]= false

		if (m){

			m =  m[1]
			m = m.replace(/\./g,"").replace(/"/g,"").trim()
			if (m == '') m = false


		}

		if (m){

			isTitle[x]= true

			var previousLineIsStart = false

			//we want to see if the line above us is a continuation
			if (!isGroupCodeLine(previousLine1)){

				//is it at a higher indent than us
				if (indetLevel(previousLine1) < indetLevel(line)){
					previousLineIsStart = true
				}else if (indetLevel(previousLine1) == indetLevel(line)){
					//does it end in a terminating char
					if (previousLine1.trim().charAt(previousLine1.trim().length-1) == '-' || previousLine1.trim().charAt(previousLine1.trim().length-1) == ','){
						previousLineIsStart = true
					}else{
						//Does it not have some uppercase things meaning it is likely a see also
						if (previousLine1.search(/[A-Z]{2}/)==-1){
							previousLineIsStart = true
						}
					}
				}
			}

			if (previousLineIsStart){
				previousLineIsPartOfRecord[x] = true
			}



		}
	}


	//loop again now that we know all the titles and where they start
	for (var x in lines){

		var line = lines[x]

		var previousLine1 = lines[parseInt(x)-1],
			previousLine2 = lines[parseInt(x)-2],
			previousLine3 = lines[parseInt(x)-3],
			nextLine1 = lines[parseInt(x)+1],
			nextLine2 = lines[parseInt(x)+2],
			nextLine3 = lines[parseInt(x)+3]


		//console.log("~-~~-~~-~~-~~-~~-~~-~~-~~-~~-~~-~~-~~-~~-~~-~")

		var title = false
		var code = false


		var code = line.match(billingsLineRegExp)
		if (code){
			code =  code[1]
			code = code.replace(/\./g,"").replace(/"/g,"").trim()
			code = code.replace(/ /g,'')
		}

		if (isTitle[x] && previousLineIsPartOfRecord[x]){

			//console.log(previousLine1, "<<")
			//console.log(line, "<")

			title = previousLine1.trim()

			if (title.charAt(title.length-1) == '-'){
				title = title.substr(0,title.length-1)
			}else{
				title = title + " "
			}


			var titleOnly = line.match(titleRegExp)
			if (titleOnly){
				titleOnly = titleOnly[1].trim()
				title = title + titleOnly
			}else{
				console.log("Regexp error:",line)
			}




		}else if (isTitle[x]){
			//console.log(line)

			var titleOnly = line.match(titleRegExp)

			if (titleOnly){
				titleOnly = titleOnly[1].trim()
				title = titleOnly
			}else{
				console.log("Regexp error:",line)
			}


		}


		if (title){


			title = title.trim().replace(/\s+/g,' ')



			var possibleNotes = []
			//start going through the next lines and see when the next title happens
			for (var y = 1; y <100; y++){

				var newX = parseInt(x)+y;


				if (isTitle[newX] || previousLineIsPartOfRecord[newX]){

					//if it is previous line we need to pop off the last line
					if (previousLineIsPartOfRecord[newX]){
						possibleNotes.splice(-1,1)
					}

					break
				}else if (indetLevel(lines[newX]) < indetLevel(line) ){


					break
				}else{
					possibleNotes.push(lines[newX])
				}
			}

			var notes = ""


			for (var z in possibleNotes){

				if (possibleNotes[z]){
					var note = possibleNotes[z].trim()

					if (note.charAt(note.length-1) == '-'){
						note = note.substr(0,note.length-1)
					}else{
						note = note + " "
					}

					notes = notes  + note
				}

			}


			if (results[code]){

				//if it is a primary code don't do it but grab the notes
				if (code.length == 1){

					if (notes.length > results[code].notes.length) results[code].notes = notes

				}else{

					// console.log("Trying to overwrite")
					// console.log(results[code].code,results[code].title,results[code].notes)
					// console.log("With")
					// console.log(code, title, notes)
					// console.log("\n")

					// //do(n't) it
					// results[code] = {code: code, title: title, notes: notes}

				}

			}else{
				results[code] = {code: code, title: title, notes: notes}
			}


		}


	}

	var rs = new readable({objectMode: true})
	var outfile = fs.createWriteStream(billingsExtractResults)
	rs._read = function () {}
	rs.pipe(outfile)



	for (var code in results){


		if (code.search("-") == -1){

			var newCode = code

			var hierarchy = []
			//whatever...
			if (newCode.length == 1){
				hierarchy.push(newCode)
			}

			if (newCode.length == 2){
				hierarchy.push(newCode.charAt(0))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1))
			}

			if (newCode.length == 3){
				hierarchy.push(newCode.charAt(0))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1) + newCode.charAt(2))
			}

			if (newCode.length == 4){
				hierarchy.push(newCode.charAt(0))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1) + newCode.charAt(2))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1) + newCode.charAt(2) + newCode.charAt(3))

			}

			if (newCode.length == 5){
				hierarchy.push(newCode.charAt(0))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1) + newCode.charAt(2))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1) + newCode.charAt(2) + newCode.charAt(3))
				hierarchy.push(newCode.charAt(0) + newCode.charAt(1) + newCode.charAt(2) + newCode.charAt(3) + newCode.charAt(4))
			}

			if (newCode.length > 4) console.log(newCode)


			var line = ""

			line = line + results[code].code + "\t"

			for (var x in hierarchy){

				if (!results[hierarchy[x]]){

					//console.log("No Parent",hierarchy[x] )
					//console.log(hierarchy)

					line = line + "---" + "\t"


				}else{
					line = line + results[hierarchy[x]].title + "\t"
				}
			}

			if (hierarchy.length < 5){

				for (var q = hierarchy.length; q < 5; q++){
					line = line + "\t"
				}


			}


			line = line + results[code].notes





		}else{

			line = "FIXME:" + "\t" + results[code].code+ results[code].title+ results[code].notes
			//fixme
		}


		//console.log(line)
		rs.push(line + "\n")


	}

	rs.push(null)



})


var isGroupCodeLine = function(line){
	if (line) {
		if (line.match(billingsLineRegExp)) return true
	}

	return false

}

var indetLevel = function(line){

	var level = 0

	if (!line) return level

	line = line.replace(/ /g,"")



	for (var aChar in line){
		if (line[aChar] == "\t"){
			level++
		}else{
			return level
		}


	}


}