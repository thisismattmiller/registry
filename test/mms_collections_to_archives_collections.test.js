var should = require('should')
var fs = require('fs')
var utils = require("../util/utils.js");
var mmsCollectionsToArchivesCollections = require("../jobs/mms_collections_to_archives_collections.js")


describe('mmsCollectionsToArchivesCollections', function () {

	it('should load the mms divisions based on the process archives flag or custom array passed', function () {

		var r = mmsCollectionsToArchivesCollections.loadDivisionsAbbreviations()

		Array.isArray(r).should.equal(true)
		r.length.should.be.above(10)

		mmsCollectionsToArchivesCollections.loadDivisionsReset()
		var r2 = mmsCollectionsToArchivesCollections.loadDivisionsAbbreviations(['test1','test2'])

		Array.isArray(r2).should.equal(true)
		r2.length.should.equal(2)
		r2[0].should.equal('test1')

	})


	it('should pass a mms collection record through the archives collection check and return a match for each', function (done) {

		//overwrite the default settings for testing
		mmsCollectionsToArchivesCollections.loadDivisionsReset()
		mmsCollectionsToArchivesCollections.setArchivesOutputPath('./test/data/')
		mmsCollectionsToArchivesCollections.setResultsOutput('./test/data/tmp/')


		//override with our test extract
		var r = mmsCollectionsToArchivesCollections.loadDivisionsAbbreviations(['mms_test'])

		mmsCollectionsToArchivesCollections.process(
			{pathMms : './test/data/', pathArchives : './test/data/archives_collections.json'}, 
			function(returnVal){ 

				returnVal.totalMatches.should.equal(1)

				returnVal.titleMatches.length.should.equal(1)

				//make sure it made the file
				var r = fs.unlinkSync('./test/data/tmp/archives_to_mms_collections.json');
				var r = fs.unlinkSync('./test/data/tmp/archives_collections.json');
				var r = fs.unlinkSync('./test/data/tmp/mms_no_match_to_archives_collections.json');


				

				done() 
		})





	})


})