var assert = require('assert')
var should = require('should')
var compareHierarchy = require("../util/compare_hierarchy.js")
var mmsProcess = require("../process/mms_process.js");
var archivesProcess = require("../process/archives_process.js");


describe('compareHierarchy', function () {



	// it('should parse two hiearchies with matching idents', function (done) {
		
	// 	this.timeout(15000);

	// 	mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
	// 	archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")



	// 	//load the mms tilden collection
	// 	mmsProcess.returnChildHierarchyLayout('49ff04f0-a5ab-0132-7e32-58d385a7b928',function(mmsHierarchy){

	// 		//load the archives
	// 		archivesProcess.returnComponentHierarchyLayout("1272", function(archivesHierarchy){


	// 			var r = compareHierarchy.compareByIdents( mmsHierarchy, archivesHierarchy )

	// 			mmsHierarchy = r[0]
	// 			archivesHierarchy = r[1]
	// 			var stats = r[2]

	// 			for (var x in mmsHierarchy){
	// 				mmsHierarchy[x].should.have.property('matchedArchives')
	// 			}
	// 			for (var x in archivesHierarchy){
	// 				archivesHierarchy[x].should.have.property('matchedMms')
	// 			}

	// 			done()

	// 		})



	// 	})



	// })



	it('should parse two hiearchies and match titles', function (done) {
		
		this.timeout(15000);

		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")



		//load the mms tilden collection
		mmsProcess.returnChildHierarchyLayout('49ff04f0-a5ab-0132-7e32-58d385a7b928',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("1272", function(archivesHierarchy){


				var r = compareHierarchy.compareByIdents( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]

				for (var x in mmsHierarchy){
					mmsHierarchy[x].should.have.property('matchedArchives')
				}
				for (var x in archivesHierarchy){
					archivesHierarchy[x].should.have.property('matchedMms')
				}

				done()

			})



		})



	})


})
