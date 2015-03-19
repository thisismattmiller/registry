var should = require('should')
var archivesLoad = require("../process/archives_collections.js")


describe('archivesLoad', function () {

	it('should load the archives collection json and extract important identifiers', function () {

		archivesLoad.loadData("./test/data/archives_collections.json", function(archivesCollections){
			
			archivesCollections.should.be.type('object');
			archivesCollections['1']['title'].should.equal('Thomas Addis Emmet collection')
			archivesCollections['1']['local_call'].should.equal('MssCol 927')
			archivesCollections['1']['local_mss'].should.equal('927')
			archivesCollections['1']['local_b'].should.equal(false)
			archivesCollections['1']['call_number'].should.equal('MssCol 927')

		})
	})

	it('should find collection level record(s) by passing an identifier', function () {

		archivesLoad.loadData("./test/data/archives_collections.json", function(archivesCollections){
	
			var r = archivesLoad.matchIdentifier('MssCol 2993')
			r.should.be.type('object')			
			r.length.should.equal(1)
			r[0]['call_number'].should.equal('MssCol 2993')

			var r = archivesLoad.matchIdentifier('b19614101')
			r.should.be.type('object')			
			r.length.should.equal(1)
			r[0]['bnumber'].should.equal('b19614101')

			var r = archivesLoad.matchIdentifier('4033')
			r.should.be.type('object')			
			r.length.should.equal(1)
			r[0]['local_mss'].should.equal('4033')


		})
	})



})


