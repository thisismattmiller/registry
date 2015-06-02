var should = require('should')
var mmsChildrenToArchivesComponents = require("../jobs/mms_children_to_archives_components.js")
var fs = require("fs")


describe('mmsChildrenToArchivesComponents', function () {

	this.timeout(500000);


	it('should load the mms->archives collection report and match the collection\'s children', function (done) {

		//override the paths for testing
		//output
		mmsChildrenToArchivesComponents.setPathToArchivesChildrenResult("./test/data/tmp/")
		mmsChildrenToArchivesComponents.setPathToMmsChildrenResult("./test/data/tmp/")
		//input
		mmsChildrenToArchivesComponents.setPathToChildrenSource("./test/data/childrenSplits/")
		mmsChildrenToArchivesComponents.setPathToArchivesOutput("./test/data/")



		mmsChildrenToArchivesComponents.process(function(){

			//lets try to delete the data and if that worked then the files were generated
			fs.unlinkSync("./test/data/tmp/49ff04f0-a5ab-0132-7e32-58d385a7b928.json")
			fs.unlinkSync("./test/data/tmp/1272.json")

			done()


		})

	})

})