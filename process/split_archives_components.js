"use strict"

var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	findRemoveSync = require('find-remove'),
	glob = require("glob")

var exports = module.exports = {}

var pathToComponentsExtract = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesComponents']
var pathToComponentsSplitDir = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesComponentsSplit']


exports.splitComponents = function(cb){

	//delete the current data
	var result = findRemoveSync(pathToComponentsSplitDir, {extensions: ['.json']})

	var stream = fs.createReadStream(pathToComponentsExtract, {encoding: 'utf8'}),
		parser = jsonStream.parse('*')

	
	var count = 0, components = [], lastId = false


	//this is the function that will be called for each data line in the archives export
	var processData = es.map(function (data, callback) {


			if (lastId != data['collection_id']){

				//if the id changes then we are on another collection unless they are out of order,
				//in that case open up the old file and read it in so we can write it all out again
				//hopefully that does not happen too often
				if (lastId){


					//try to open the oldfile
					try{


						var writtenRecords = fs.readFileSync(pathToComponentsSplitDir + lastId + '.json')

						//that worked, we now have the file, combine the old and new data and write out
						writtenRecords = JSON.parse(writtenRecords).concat(components)
						var tmp = fs.createWriteStream(pathToComponentsSplitDir + lastId + '.json')
						tmp.end(JSON.stringify(writtenRecords))


					}catch  (e) {

						//there was no file, this is the first file, just write it out
						var tmp = fs.createWriteStream(pathToComponentsSplitDir + lastId + '.json')
						tmp.end(JSON.stringify(components))
						process.stdout.write("Total Collections Split: "  + ++count + "\r")

					}

					//doing it async would mean pausing the pipe map emitter, so lets just do it sync
					// fs.readFile(pathToComponentsSplitDir + lastId + '.json', "utf8", function(err, oldData) {
						
					// 	if (err){

					// 		//there was no file, this is the first file, just write it out
					// 		var tmp = fs.createWriteStream(pathToComponentsSplitDir + lastId + '.json')
					// 		tmp.end(JSON.stringify(components))
					// 		process.stdout.write("Total Collections Split: "  + ++count + "\r")

					// 	}else{


					// 		//that worked, we now have the file, combine the old and new data
					// 		var writtenRecords = JSON.parse(oldData).concat(components)

					// 		//write out the combined data
					// 		var tmp = fs.createWriteStream(pathToComponentsSplitDir + lastId + '.json')
					// 		tmp.end(JSON.stringify(writtenRecords))

					// 	}


					// });
					
				}

				components = []
				lastId = data['collection_id']

			}


			components.push(data)
			lastId = data['collection_id']


	})

	parser.on('end', function(obj) {
		//the last one
		var tmp = fs.createWriteStream(pathToComponentsSplitDir + lastId + '.json')
		tmp.end(JSON.stringify(components))
		process.stdout.write("Total Collections Split: "  + ++count + "\r")

		console.log("\n\n")
		//callback and pass the data object in the local namespace
		if (cb)	cb()
	})

	stream.pipe(parser).pipe(processData)
	
}



//set it for testing
exports.setExtractsPath = function(path){
	pathToComponentsExtract = path
}
//set it for testing
exports.setExtractsSplitPath = function(path){
	pathToComponentsSplitDir = path
}
