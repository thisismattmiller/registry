var should = require('should')
var exceptionReport = require("../util/exception_report.js")
var glob = require("glob")
var fs = require("fs")

describe('exception_report', function () {

	before(function() {
		var files = glob("./test/data/tmp/" + "*", {sync:true})
		console.log(files)
		for (var x in files){
			var r = fs.unlinkSync(files[x]);
		}							
	})


	it('shoud generate a log file', function () {

		exceptionReport.log("test1","test2",{somedata: "Yeahhhh"});


		// utils.normalize("     Hello There  4  ").should.equal("hellothere4")
		// utils.normalize("Hello &gt; There").should.equal("hello>there")
		// utils.normalize(false).should.equal(false)

		// should.not.exist(utils.normalize(null))
		// utils.normalize(1234).should.equal(1234)
	})


})