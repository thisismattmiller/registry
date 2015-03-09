var should = require('should')


//make sure the config is setup the way we expect it, kinf of a config check

describe('Config', function () {

	var config = require('config');

	it('should have a Storage property', function () {		
		config.should.have.property("Storage")
	})

	it('should have a Storage outputPaths', function () {		
		config['Storage'].should.have.property("outputPaths")
	})

	it('should have a mms outputPaths', function () {		
		config['Storage']['outputPaths'].should.have.property("mms")
	})

})