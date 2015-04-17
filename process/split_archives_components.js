"use strict"

var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream')


var exports = module.exports = {}

var pathToComponentsExtract = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesComponents']
var pathToComponentsSplitDir = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['archivesComponentsSplit']


exports.splitComponents = function(cb){



	var stream = fs.createReadStream(pathToComponentsExtract, {encoding: 'utf8'}),
		parser = jsonStream.parse('*')

	
	var count = 0, components = [], lastId = false


	//this is the function that will be called for each data line in the archives export
	var processData = es.map(function (data, callback) {


			if (lastId != data['collection_id']){

				if (lastId){
					var tmp = fs.createWriteStream(pathToComponentsSplitDir + lastId + '.json')
					tmp.end(JSON.stringify(components))
					process.stdout.write("Total Collections Split: "  + ++count + "\r")
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
