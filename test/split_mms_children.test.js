var assert = require('assert')
var should = require('should')
var fs = require('fs')

var mmsChildrenSplit = require("../process/split_mms_children.js");


describe('mmsChildrenSplit', function () {

	it('should parse the large MMS extract and seperate files by collection', function (done) {


		mmsChildrenSplit.setExtractsSplitPath("./test/data/tmp/")


		mmsChildrenSplit.splitChildren("./test/data/mms_test.json", function(){

			//these are the components's parent collection ids in the  in the test file
			// var expected = ['1','5917','5916']

			console.log("dunnnn")

			//these are collections in the mms tes file
			var expected = ["5cd94760-c52a-012f-bcd4-3c075448cc4b.json", "45a50ab0-c61e-012f-e73f-58d385a7bc34.json", "50546ca0-c5f2-012f-d4c9-58d385a7bc34.json", "a0fc4ef0-c6d3-012f-6b4e-58d385a7bc34.json", "e5114e30-c52f-012f-993c-58d385a7bc34.json" ]

			//load one of the files and make sure if parse as json
			fs.readFile("./test/data/tmp/" + expected[0], 'utf8', function (err, data) {
				if (err) {
					
					throw "The output of the process was not able to be parsed as json"
					return
				}

				for (var x in expected){
					var r = fs.unlinkSync("./test/data/tmp/" + expected[x]);
				}

				done()


			});




		})

	})


})