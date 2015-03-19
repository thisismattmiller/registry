"use strict"

var mmsReport = require("../process/mms_report.js");
var archivesLoad = require("../process/archives_collections.js")
var archivesLoad = require("../process/archives_collections.js")
var exceptionReport = require("../util/exception_report.js")



archivesLoad.loadData("/Users/matt/Desktop/data/extracts/archives_collections.json", function(){


	exceptionReport.deleteOperation("archives to mms")


	var r = archivesLoad.matchIdentifier('b16651716z')

	if (r.length==1){

		console.log(archivesLoad.markAsMatched(r[0]['portal_id']))

	}else if (r.length == 0){

		exceptionReport.log("archives to mms","no match in mms","data")

	}else if (r.length > 1){

	}



})

//archivesLoad.matchIdentifier("SADFsad fasd fadsf DSAF &gt; 32423 ~@#$% FDGSDFG Whap whap")

//mmsReport.process("/Users/matt/Downloads/2014-9-3.json")
//mmsReport.process("/Users/matt/Downloads/mms_test.json")

//mmsHiearchy.process("/Users/matt/Downloads/2014-9-3.json")