var config = require("config"),
	findRemoveSync = require('find-remove'),
	fs = require("fs"),
	glob = require("glob"),
	utils = require("../util/utils")
	


var exports = module.exports = {}

var path = config.get('Storage')['outputPaths']['exceptions']


exports.setPath = function(newPath){
	path = newPath
}

exports.log = function(operation,type,data){


	type = type.replace(/\s/g,'_')
	operation = operation.replace(/\s/g,'_')

	operation = utils.normalize(operation)
	type = utils.normalize(type)

	var log = fs.createWriteStream(path + operation + '.' + type + '.txt', {'flags': 'a'})
	log.end(JSON.stringify({ type: type,  operation: operation, data : data }) + "\n" );

	log.on('error', function(error) {

		console.log("Error writing log file:",error.code)


	})


}

exports.deleteAll = function(){
	var result = findRemoveSync(path, {extensions: ['.txt']})
}

exports.deleteOperation = function(operation){

	operation = operation.replace(/\s/g,'_')
	operation = utils.normalize(operation)

	var files = glob(path + operation + "*", {sync:true})
	for (var x in files){
		var result = findRemoveSync(path, {files: files[x].replace(path,"") })
	}	

}

exports.deleteType = function(type){

	type = type.replace(/\s/g,'_')
	type = utils.normalize(type)

	var files = glob(path + "*." + type + ".txt", {sync:true})
	for (var x in files){
		var result = findRemoveSync(path, {files: files[x].replace(path,"") })
	}	

}