var should = require('should')
var fs = require('fs')
var utils = require("../util/utils.js");
var catalogBnumberCheckArchives = require("../jobs/validate_catalog_bnumbers_to_archives.js")





describe('catalogBnumberToArchives', function () {


	it('should pass all archives collections records through the bnumber lookup', function (done) {

		//overwrite the default settings for testing

		catalogBnumberCheckArchives.setResultsOutput('./test/data/tmp/')
		catalogBnumberCheckArchives.setBnumberIndex('./test/data/catalog_bindex_test.json')
		catalogBnumberCheckArchives.setArchivesCollections('./test/data/archives_collections.json')


		catalogBnumberCheckArchives.process(
			function(returnVal){


				returnVal['b10007641'].length.should.equal(1)
				var r = fs.unlinkSync('./test/data/tmp/archives_to_catalog.json')

				done()
		})





	})


})