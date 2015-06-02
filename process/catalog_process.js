"use strict"

var config = require("config"),
	readable = require('stream').Readable,
  	fs = require("fs"),
	jsonStream = require('JSONStream'),
	es = require('event-stream'),
	exceptionReport = require("../util/exception_report.js")


var pathToCatalogBindex = config.get('Storage')['extracts']['catalogBindex']


var exports = module.exports = {}

var bnumbers = {}, counter = 0

exports.loadBnumbers = function(cb){


	fs.readFile(pathToCatalogBindex, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		data = JSON.parse(data)

		if (cb) cb(data)
	});



}


exports.setPathToCatalogBindex = function(path){
	pathToCatalogBindex = path
}
