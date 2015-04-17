"use strict"

var config = require("config"),
  	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	findRemoveSync = require('find-remove'),
	lineByLineReader = require('line-by-line')

var exports = module.exports = {}

var pathToMmsSplitDir = config.get('Storage')['extracts']['base'] + config.get('Storage')['extracts']['mmsChildrenSplit']


exports.splitChildren = function(pathToMmsExtract, cb){


	//delete the current data
	var result = findRemoveSync(pathToMmsSplitDir, {extensions: ['.json']})

	var stream = fs.createReadStream(pathToMmsExtract, {encoding: 'utf8'}),
		parser = jsonStream.parse('*')

	
	var count = 0, components = [], lastId = false

	var allCollectionIds = []


	//this is the function that will be called for each data line in the archives export
	var processData = es.map(function (data, callback) {


		if (data['solr_doc_hash']){

			if (data['solr_doc_hash']['collection_uuid']){

				process.stdout.write("Total Children Processed: "  + ++count + " - " + data['solr_doc_hash']['collection_uuid'] + " (" + allCollectionIds.length + ")" + "\r")

				if (lastId != data['solr_doc_hash']['collection_uuid']){


					if ( allCollectionIds.indexOf(data['solr_doc_hash']['collection_uuid']) == -1 ){
						allCollectionIds.push(data['solr_doc_hash']['collection_uuid'])
					} 


					if (lastId){
						var tmp = fs.createWriteStream(pathToMmsSplitDir + lastId + '.json', {'flags': 'a'})
						tmp.end(components.join("\n")+"\n")						
					}

					components = []
					lastId = data['solr_doc_hash']['collection_uuid']

				}


				components.push(JSON.stringify(data))
				lastId = data['solr_doc_hash']['collection_uuid']

			}

		}


	})
	
	cb = function(){console.log("DONNNNNNE")}


	parser.on('end', function(obj) {
		//the last one
		var tmp = fs.createWriteStream(pathToMmsSplitDir + lastId + '.json',{'flags': 'a'})
		tmp.end(components.join("\n")+"\n")
		process.stdout.write("Total Children Processed: "  + ++count + "\r")
		console.log("\n\n")

		var countDone = 0

		//each file is passed here to stream through the json stringify
		var writeout = function(filename, count, uuid,cb){

			var rs = new readable({objectMode: true});
			var outfile = fs.createWriteStream(filename+'.tmp');
			var stringify = jsonStream.stringify("[\n",",\n","\n]\n");
			rs._read = function () {};
			rs.pipe(stringify).pipe(outfile);


			var lr = new lineByLineReader(filename);

			lr.on('line', function (line) {
				//console.log(line)
				rs.push(JSON.parse(line))
			});

			lr.on('end', function () {
				rs.push(null)			
			});

			outfile.on('finish', function () {

				allCollectionIds.splice(allCollectionIds.indexOf(uuid),1)

				process.stdout.write("Converting to JSON streamable: "  + (++countDone) + "\r")

				outfile.end()

				//replace it
				fs.rename(filename+'.tmp', filename, function(err) {
				    if ( err ) console.log('ERROR: ' + err);
				})

				if (allCollectionIds.length == 0){
					console.log("\n\n")
					if (cb) cb()
				}
			});




		}

		//to get around ENFILE limits break the group into 100s and offset them
		var size = 100;

		for (var i=0; i<allCollectionIds.length; i+=size) {

			var smallarray = allCollectionIds.slice(i,i+size);

			setTimeout(function(smallarray){


				for (var x in smallarray){
					var filename = pathToMmsSplitDir + smallarray[x] + '.json'
					writeout.call(this, filename, x, smallarray[x],cb)
				}


			}, (1250 * i/100), smallarray ) 

			

		}



		console.log("\n\n")


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
