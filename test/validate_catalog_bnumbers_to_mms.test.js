var should = require('should')
var fs = require('fs')
var utils = require("../util/utils.js");
var catalogBnumberCheckMms = require("../jobs/validate_catalog_bnumbers_to_mms.js")





describe('catalogBnumberToMss', function () {


	it('should pass all mms records through the bnumber lookup', function (done) {

		//overwrite the default settings for testing
		catalogBnumberCheckMms.loadDivisionsReset()
		catalogBnumberCheckMms.setResultsOutput('./test/data/tmp/')
		catalogBnumberCheckMms.setBnumberIndex('./test/data/catalog_bindex_test.json')

		//override with our test extract
		var r = catalogBnumberCheckMms.loadDivisionsAbbreviations(['mms_test'])

		catalogBnumberCheckMms.process(
			{pathMms : './test/data/'},
			function(returnVal){


				returnVal['b15260749'].length.should.equal(1)


				var r = fs.unlinkSync('./test/data/tmp/mms_to_catalog.json')

				done()
		})





	})


})