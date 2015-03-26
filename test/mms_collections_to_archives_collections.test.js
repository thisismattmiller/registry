var should = require('should')
var utils = require("../util/utils.js");
var mmsCollectionsToArchivesCollections = require("../jobs/mms_collections_to_archives_collections.js")


describe('mmsCollectionsToArchivesCollections', function () {


	it('should load the mms divisions based on the process archives flag or custom array passed', function () {


		var r = mmsCollectionsToArchivesCollections.loadDivisionsAbbreviations()

		console.log(r)

		Array.isArray(r).should.equal(true)
		r.length.should.be.above(10)

		mmsCollectionsToArchivesCollections.loadDivisionsReset()
		var r2 = mmsCollectionsToArchivesCollections.loadDivisionsAbbreviations(['test1','test2'])

		console.log(r2.length)
		Array.isArray(r2).should.equal(true)
		r2.length.should.equal(2)
		r2[0].should.equal('test1')



		// r['match'].should.equal(true)
		// r['matchOn'].indexOf('bNumber').should.equal(0)

		// r = compare.compareIdentifiersExact(mmsIdents,archivesIdents2)

		// r['match'].should.equal(false)


	})


})