var should = require('should')
var utils = require("../util/utils.js");


describe('utils', function () {

	it('should take funky string and lowercase remove whitespace and convert any html codes', function () {
		utils.normalize("     Hello There  4  ").should.equal("hellothere4")
		utils.normalize("Hello &gt; There").should.equal("hello>there")


		utils.normalize(false).should.equal(false)

		utils.normalize(null).should.equal(false)
		utils.normalize(1234).should.equal('1234')
	})


})