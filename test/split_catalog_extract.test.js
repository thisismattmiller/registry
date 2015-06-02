var should = require('should')
var fs = require('fs')

var splitCatalogExtract = require("../process/split_catalog_extract.js")



describe('splitCatalogExtract', function () {


	this.timeout(25000);

	it('should parse the large catalog extract and seperate resarch record extract', function (done) {


		splitCatalogExtract.setPathToCatalogExtract("./test/data/catalog_test.json")

		splitCatalogExtract.setPathToCatalogResearchOutput("./test/data/tmp/catalog_research_test.json")

		splitCatalogExtract.splitResearchFromFull(function(){


			//load one of the files and make sure if parse as json
			fs.readFile("./test/data/tmp/catalog_research_test.json", 'utf8', function (err, data) {
				if (err) {
					throw "The output of the process was not able to be read"

				}

				var r = fs.unlinkSync("./test/data/tmp/catalog_research_test.json");

				done()

			});
		})

	})



	it('should parse research catalog extract and create a bnumber Index', function (done) {


		splitCatalogExtract.setPathToCatalogResearchOutput("./test/data/catalog_test.json")

		splitCatalogExtract.setPathToCatalogBindexOutput("./test/data/tmp/catalog_bindex_test.json")

		splitCatalogExtract.createBnumberLookup(function(){


			//load one of the files and make sure if parse as json
			fs.readFile("./test/data/tmp/catalog_bindex_test.json", 'utf8', function (err, data) {
				if (err) {
					throw "The output of the process was not able to be read"

				}

				var r = fs.unlinkSync("./test/data/tmp/catalog_bindex_test.json");

				done()

			});
		})

	})


})