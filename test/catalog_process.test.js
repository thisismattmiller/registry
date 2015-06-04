var should = require('should')
var fs = require('fs')

var catalogProcess = require("../process/catalog_process.js")

describe('catalogProcess', function () {

	this.timeout(25000);

	it('should load bnumber index', function (done) {
		catalogProcess.setPathToCatalogBindex("./test/data/catalog_bindex_test.json")
		catalogProcess.loadBnumbers(function(data){
			Object.keys(data).length.should.be.above(100)
			done()
		})
	})
})