var should = require('should')
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


	it('should pass a mms record through the archives collection check and return a match for each', function (done) {

		mmsCollectionsToArchivesCollections.loadDivisionsReset()

		var r = mmsCollectionsToArchivesCollections.loadDivisionsAbbreviations(['mms_test'])

		mmsCollectionsToArchivesCollections.process({pathMms : './test/data/', pathArchives : './test/data/archives_collections.json'}, function(){ done() } )





	})


})