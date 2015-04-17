var assert = require('assert')
var should = require('should')
var fs = require('fs')

var archivesSplit = require("../process/split_archives_components.js");


describe('archivesComponentSplit', function () {

	it('should parse a archives components extract into seperate files', function (done) {


		archivesSplit.setExtractsPath("./test/data/archives_components.json")
		archivesSplit.setExtractsSplitPath("./test/data/tmp/")

		archivesSplit.splitComponents(function(){

			//these are the components's parent collection ids in the  in the test file
			var expected = ['1','5917','5916']
			for (var x in expected){
				var r = fs.unlinkSync("./test/data/tmp/" + expected[x] + ".json");
			}

			done()


		})

	})


})