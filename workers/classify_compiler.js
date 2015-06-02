var config = require("config"),
	glob = require("glob"),
	fs = require('fs')



var pathToCatalogClassifyResults = config.get('Storage')['extracts']['catalogClassifyResults']











glob(pathToCatalogClassifyResults + "*.json", {}, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.

  console.log(files.length)

  var foundSomethingTrue = 0, foundSomethingFalse = 0

  for (var file in files){

  	file = files[file]


  	console.log(file)

 	var data = fs.readFileSync(file)

 	var obj = JSON.parse(data)

 	if (obj.foundSomething){
 		foundSomethingTrue++
 	}else{
 		foundSomethingFalse++
 	}





  }

  console.log(files.length, foundSomethingTrue,foundSomethingFalse)





})