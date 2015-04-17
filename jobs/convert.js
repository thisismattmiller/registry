"use strict"

var mmsReport = require("../process/mms_report.js");
var mssProcess = require("../process/mms_process.js")
var archivesLoad = require("../process/archives_collections.js")
var exceptionReport = require("../util/exception_report.js")
var archivesComponentsSplit = require("../process/split_archives_components.js")
var mmsChildrenSplit = require("../process/split_mms_children.js")




mmsChildrenSplit.splitChildren("/Users/matt/Downloads/last_import.json")

//mmsReport.process("/Users/matt/Downloads/last_import.json")



//mssProcess.



// archivesLoad.loadData("/Users/matt/Desktop/data/extracts/archives_collections.json", function(){


// 	exceptionReport.deleteOperation("archives to mms")


// 	var r = archivesLoad.matchIdentifier({"bNumber" : 'b16651716', 'mss' : 4340 })

// 	if (r.length==1){

// 		//console.log(archivesLoad.markAsMatched(r[0]['portal_id']))

// 		console.log(r)


// 	}else if (r.length == 0){

// 		exceptionReport.log("archives to mms","no match in mms","data")

// 	}else if (r.length > 1){

// 	}



// })

//archivesLoad.matchIdentifier("SADFsad fasd fadsf DSAF &gt; 32423 ~@#$% FDGSDFG Whap whap")

//mmsReport.process("/Users/matt/Downloads/last_import.json")
//mmsReport.process("/Users/matt/Downloads/mms_test.json")

//mmsHiearchy.process("/Users/matt/Downloads/2014-9-3.json")