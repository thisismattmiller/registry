var assert = require('assert')
var should = require('should')
var compareHierarchy = require("../util/compare_hierarchy.js")
var mmsProcess = require("../process/mms_process.js");
var archivesProcess = require("../process/archives_process.js");


describe('compareHierarchy', function () {


	this.timeout(25000);


	it('should parse two hiearchies with matching idents', function (done) {
		

		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")


		//this is a collection lloaded via the archives ingest so the idents should be 100%
		mmsProcess.returnChildHierarchyLayout('49ff04f0-a5ab-0132-7e32-58d385a7b928',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("1272", function(archivesHierarchy){


				var r = compareHierarchy.compareByIdents( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]

				stats.a.matched.should.equal(296)
				stats.b.matched.should.equal(296)


				done()

			})



		})



	})


	it('should parse two hiearchies and match depth parent title, title and date', function (done) {
		

		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//load Nathaniel Hawthorne collection of papers, 1694-1931 bulk (1817-1864).
		mmsProcess.returnChildHierarchyLayout('84b97660-371f-0130-802e-58d385a7b928',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("4435", function(archivesHierarchy){


				var r = compareHierarchy.compareByDepthParentTitleDateStrict( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]

				//there are some title variances but it matches more than 96%
				stats['a']['matched'].should.be.above(96)
				stats['b']['matched'].should.be.above(96)

				done()

			})



		})



	})

	it('should parse two hiearchies and match depth parent title and title', function (done) {
		

		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//load The Earl Conrad/Harriet Tubman Research Materials
		mmsProcess.returnChildHierarchyLayout('49ff04f0-a5ab-0132-7e32-58d385a7b928',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("1272", function(archivesHierarchy){

				var r = compareHierarchy.compareByDepthParentTitle( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]

				stats['a']['matched'].should.be.above(89)
				stats['b']['matched'].should.be.above(89)

				done()

			})



		})



	})

	it('should parse two hiearchies and match depth parent title and title FUZZY', function (done) {
		

		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//load tilden
		mmsProcess.returnChildHierarchyLayout('954eecd0-c5bf-012f-9413-58d385a7bc34',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("2", function(archivesHierarchy){

				var r = compareHierarchy.compareByDepthParentTitleFuzzy( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]


				stats['a']['matched'].should.be.above(6)
				stats['b']['matched'].should.be.above(8)

				done()

			})



		})



	})


	it('should parse two hiearchies and match by depth, title and date', function (done) {
		
		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//load the mms  collection
		mmsProcess.returnChildHierarchyLayout('49ff04f0-a5ab-0132-7e32-58d385a7b928',function(mmsHierarchy){ //tubman

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("1272", function(archivesHierarchy){


				var r = compareHierarchy.compareByDepthTitleDate( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]

				stats['a']['matched'].should.equal(280)
				stats['b']['matched'].should.equal(281)





				done()

			})



		})



	})




	it('should parse two hiearchies and match by title and date', function (done) {
		


		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")



		//load Abraham Lincoln collection, 1847-1864
		mmsProcess.returnChildHierarchyLayout('a27b4dc0-c6cf-012f-fa8e-3c075448cc4b',function(mmsHierarchy){ 

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("72", function(archivesHierarchy){


				var r = compareHierarchy.compareByTitleDate( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]

				stats['a']['matched'].should.equal(20)
				stats['a']['matched'].should.equal(20)





				done()

			})



		})



	})




it('should parse two hiearchies and match by title if unique not fuzzy', function (done) {
		


		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")



		//load Gran Fury collection
		mmsProcess.returnChildHierarchyLayout('a54b6f80-c6b8-012f-4e07-58d385a7bc34',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("2424", function(archivesHierarchy){


				var r = compareHierarchy.compareByTitleUnique( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]


				stats['a']['matched'].should.be.above(37)
				stats['b']['matched'].should.be.above(28)


				done()

			})



		})



	})



	it('should parse two hiearchies and match by title if unique Fuzzy', function (done) {
		


		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")
		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")



		//load Gran Fury collection
		mmsProcess.returnChildHierarchyLayout('a54b6f80-c6b8-012f-4e07-58d385a7bc34',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("2424", function(archivesHierarchy){


				var r = compareHierarchy.compareByTitleUniqueFuzzy( mmsHierarchy, archivesHierarchy )

				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]


				stats['a']['matched'].should.be.above(35)
				stats['b']['matched'].should.be.above(29)




				done()

			})



		})



	})



	it('should parse two hiearchies with matching capture ids', function (done) {
		


		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")



		//load the gran fury collection that has capture ids in its notes field
		mmsProcess.returnChildHierarchyLayout('a54b6f80-c6b8-012f-4e07-58d385a7bc34',function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout("2424", function(archivesHierarchy){


				var r = compareHierarchy.compareByIdents( mmsHierarchy, archivesHierarchy )


				mmsHierarchy = r[0]
				archivesHierarchy = r[1]
				var stats = r[2]


				stats['a']['matched'].should.be.above(153)
				stats['b']['matched'].should.be.above(84)


				done()

			})



		})



	})

	
	return


	//used this to develop 



	it('hierarchy qa ALL', function (done) {
		


		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		var mmsUUID = '37ff6270-2642-0132-c7c5-58d385a7bbd0', archivesId = "9097"


		//load the mms tilden collection
		mmsProcess.returnChildHierarchyLayout(mmsUUID,function(mmsHierarchy){

			//load the archives
			archivesProcess.returnComponentHierarchyLayout(archivesId, function(archivesHierarchy){



				var compareByIdents = compareHierarchy.compareByIdents( mmsHierarchy, archivesHierarchy )
		//console.log("compareByIdents\n", compareByIdents[2])

				//set them to the results to they compile in one object
				mmsHierarchy = compareByIdents[0]
				archivesHierarchy = compareByIdents[1]

				var compareByDepthParentTitleDateStrict = compareHierarchy.compareByDepthParentTitleDateStrict( mmsHierarchy, archivesHierarchy )
				console.log("compareByDepthParentTitleDateStrict\n", compareByDepthParentTitleDateStrict[2])

				mmsHierarchy = compareByDepthParentTitleDateStrict[0]
				archivesHierarchy = compareByDepthParentTitleDateStrict[1]


				var compareByDepthParentTitle = compareHierarchy.compareByDepthParentTitle( mmsHierarchy, archivesHierarchy )
				console.log("compareByDepthParentTitle\n", compareByDepthParentTitle[2])

				mmsHierarchy = compareByDepthParentTitleDateStrict[0]
				archivesHierarchy = compareByDepthParentTitleDateStrict[1]


				var compareByDepthParentTitleFuzzy = compareHierarchy.compareByDepthParentTitleFuzzy( mmsHierarchy, archivesHierarchy )
				console.log("compareByDepthParentTitleFuzzy\n", compareByDepthParentTitleFuzzy[2])

				mmsHierarchy = compareByDepthParentTitleDateStrict[0]
				archivesHierarchy = compareByDepthParentTitleDateStrict[1]


				var compareByDepthTitleDate = compareHierarchy.compareByDepthTitleDate( mmsHierarchy, archivesHierarchy )
				console.log("compareByDepthTitleDate\n", compareByDepthTitleDate[2])


				mmsHierarchy = compareByDepthTitleDate[0]
				archivesHierarchy = compareByDepthTitleDate[1]


				var compareByTitleDate = compareHierarchy.compareByTitleDate( mmsHierarchy, archivesHierarchy )
				console.log("compareByTitleDate\n", compareByTitleDate[2])

				mmsHierarchy = compareByTitleDate[0]
				archivesHierarchy = compareByTitleDate[1]

				//low confidence belowwwww

				var compareByTitleUnique = compareHierarchy.compareByTitleUnique( mmsHierarchy, archivesHierarchy )
				console.log("compareByTitleUnique\n", compareByTitleUnique[2])

				mmsHierarchy = compareByTitleUnique[0]
				archivesHierarchy = compareByTitleUnique[1]


				var compareByTitleUniqueFuzzy = compareHierarchy.compareByTitleUniqueFuzzy( mmsHierarchy, archivesHierarchy )
				console.log("compareByTitleUniqueFuzzy\n", compareByTitleUniqueFuzzy[2])

				mmsHierarchy = compareByTitleUniqueFuzzy[0]
				archivesHierarchy = compareByTitleUniqueFuzzy[1]



				done()

			})



		})



	})


})
