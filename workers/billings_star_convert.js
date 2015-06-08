"use strict"

var config = require("config"),
    lineByLineReader = require('line-by-line')


var billingsExtract = config.get('Storage')['extracts']['billingsStarDump']




//find if the line has a billings on it
var billingsLine = new RegExp(/\.{10,}.*?\t(.+\s|.+[A-Z])/)



//put each line into memeory

var lr = new lineByLineReader(billingsExtract)


var lines = []


lr.on('line', function (line) {

	lr.pause();

	lines.push(line)

	lr.resume();


})

lr.on('end', function () {



	var previousLineIsPartOfRecord = {}, isTitle = {}


	for (var x in lines){

		var line = lines[x]

		previousLineIsPartOfRecord[x] = false

		var previousLine1 = lines[x-1],
			previousLine2 = lines[x-2],
			previousLine3 = lines[x-3],
			nextLine1 = lines[parseInt(x)+1],
			nextLine2 = lines[parseInt(x)+2],
			nextLine3 = lines[parseInt(x)+3]


		var m = line.match(billingsLine)

		isTitle[(parseInt(x))]= false

		if (m){
			m =  m[1]
			m = m.replace(/\./g,"").replace(/"/g,"").trim()
			if (m == '') m = false
		}

		//just get the first and endish lines out of here, nothing interesting
		if (x < 6 || x >= 4075) continue

		if (m){

			isTitle[(parseInt(x))]= true

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
						//Does it not have a * meaning it is likely a see also
						if (previousLine1.search(/\*/)==-1){
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


		var code = line.match(billingsLine)
		if (code){
			code =  code[1]
			code = code.replace(/\./g,"").replace(/"/g,"").trim()
		}

		if (isTitle[x] && previousLineIsPartOfRecord[x]){

			//console.log(previousLine1, "<<")
			//console.log(line, "<")

			title = previousLine1 + "\n" + line


		}else if (isTitle[x]){
			//console.log(line)
			title = line
		}


		if (title){


			console.log(code)


			var possibleNotes = []
			//start going through the next lines and see when the next title happens
			for (var y = 1; y <100; y++){

				var newX = parseInt(x)+y;

				//console.log(y)

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
				var note = possibleNotes[z].trim()

				if (note.charAt(note.length-1) == '-'){
					note = note.substr(0,note.length-1)
				}else{
					note = note + " "
				}

				notes = notes  + note

			}


			//console.log(notes)



		}


	}



})


var isGroupCodeLine = function(line){

	if (line.match(billingsLine)) return true

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