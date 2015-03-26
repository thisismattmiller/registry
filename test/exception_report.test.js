var should = require('should')
var exceptionReport = require("../util/exception_report.js")
var glob = require("glob")
var fs = require("fs")

describe('exception_report', function () {

	before(function() {
		var files = glob("./test/data/tmp/" + "*", {sync:true})
		for (var x in files){
			var r = fs.unlinkSync(files[x])
		}							
	})


	it('shoud generate a exception file based on operation and type passed', function () {
		exceptionReport.setPath("./test/data/tmp/")
		exceptionReport.log("test1","test2",{somedata: "Yeahhhh"})
		//fs.unlinkSync("./test/data/tmp/test1.test2.txt")
	})

	it('shoud only delete exception files by operation', function () {

		
		exceptionReport.setPath("./test/data/tmp/")

		exceptionReport.deleteAll()

		exceptionReport.log("test1","test2",{somedata: "Yeahhhh"})
		exceptionReport.log("test3","test4",{somedata: "Yeahhhh"})

		exceptionReport.deleteOperation("test1")

		var ableToDelete = true;
		try {

			//this should error out if the function was able to remove the file
			fs.unlinkSync("./test/data/tmp/test1.test2.txt")

		}catch (err) {
			//not found
			if (err.errno != 34){
				throw "Unexpected error"
			}else{
				ableToDelete = false
			}

		} finally {
			if (ableToDelete) throw "Was able to delete that file, it was not removed, exceptionReport.deleteOperation not working"
		}

		
	})

	it('shoud only delete exception files by type', function () {

		
		exceptionReport.setPath("./test/data/tmp/")

		exceptionReport.deleteAll()

		exceptionReport.log("test1","test2",{somedata: "Yeahhhh"})
		exceptionReport.log("test3","test4",{somedata: "Yeahhhh"})

		exceptionReport.deleteType("test4")

		var ableToDelete = true;
		try {

			//this should error out if the function was able to remove the file
			fs.unlinkSync("./test/data/tmp/test3.test4.txt")

		}catch (err) {
			//not found
			if (err.errno != 34){
				throw "Unexpected error"
			}else{
				ableToDelete = false
			}

		} finally {
			if (ableToDelete) throw "Was able to delete that file, it was not removed, exceptionReport.deleteType not working"
		}

		
	})


})