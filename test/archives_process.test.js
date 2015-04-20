var assert = require('assert')
var should = require('should')
var archivesProcess = require("../process/archives_process.js");


describe('archivesProcess', function () {

	it('should return a hiearchy map of a collection by passsing the collection id', function (done) {

		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//this is a test file in the data dir
		archivesProcess.returnComponentHierarchyLayout('72', function(hierarchyMap){

			for (var x in hierarchyMap){

				hierarchyMap[x].should.have.property('parent')
				hierarchyMap[x].should.have.property('depth')
				hierarchyMap[x].should.have.property('parentName')
				hierarchyMap[x].should.have.property('name')
				hierarchyMap[x].should.have.property('data')
				hierarchyMap[x].should.have.property('hasChildren')
				hierarchyMap[x].should.have.property('idents')
			}





			done()
		})


	})



})