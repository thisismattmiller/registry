var config = require("config"),
	glob = require("glob"),
	async = require("async"),
	fs = require('fs')



var pathToCatalogClassifyResults = config.get('Storage')['extracts']['catalogClassifyResults']




glob(pathToCatalogClassifyResults + "*.json", {}, function (er, files) {



  //give it a second to make sure all files are settled
  console.log("Getting ready to compress",files.length,"files")
  setTimeout(function(){


	async.eachSeries(files, function(file, callback){


		if (file.search('all.json') === -1) {


			var data = fs.readFileSync(file)

			var allData = fs.createWriteStream(pathToCatalogClassifyResults + 'all.json', {'flags': 'a'})

			allData.end(data + "\n")

			allData.on("finish",function(){

				callback()

			})


		}


	})



  },5000)





})