var assert = require('assert')
var should = require('should')
var archivesProcess = require("../process/archives_process.js");


describe('archivesProcess', function () {


	this.timeout(25000);


	it('should return a hiearchy map of a collection by passsing the collection id', function (done) {

		archivesProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//this is a test file in the data dir
		archivesProcess.returnComponentHierarchyLayout('72', function(hierarchyMap){

			for (var x in hierarchyMap){				
				hierarchyMap[x].should.have.property('parent')
				hierarchyMap[x].should.have.property('depth')
				hierarchyMap[x].should.have.property('id')
				hierarchyMap[x].should.have.property('parentName')
				hierarchyMap[x].should.have.property('data')
				hierarchyMap[x].should.have.property('hasChildren')
				hierarchyMap[x].should.have.property('idents')
				hierarchyMap[x]['idents'].should.have.property('title')
			}

			done()

		})


	})




	it('should extract the idents of a archival component', function () {

	var testComponent = {
	        "boost_queries": null,
	        "collection_id": 72,
	        "created_at": "2014-12-08T20:22:47Z",
	        "data": {
	            "container": [
	                {
	                    "type": "box",
	                    "value": "1"
	                }
	            ],
	            "date_inclusive_end": 1842,
	            "date_inclusive_start": 1842,
	            "dates_index": [
	                1842
	            ],
	            "extent_statement": "2 pages",
	            "keydate": "1842-08-16",
	            "physdesc": [
	                {
	                    "format": "structured",
	                    "physdesc_components": [
	                        {
	                            "name": "extent",
	                            "value": "2 pages"
	                        }
	                    ],
	                    "supress_display": true
	                }
	            ],
	            "unitdate": [
	                {
	                    "calendar": "gregorian",
	                    "era": "ce",
	                    "normal": "1842-08-16",
	                    "value": "1842 August 16"
	                }
	            ],
	            "unitid": [
	                {
	                    "type": "local_mss",
	                    "value": 1064009
	                },
	                {
	                    "type": "local_b",
	                    "value": "b123455678"
	                }	                
	            ],
	            "unittitle": [
	                {
	                    "value": "A. D folio (1 leaf). Deposition of Christian Goodman"
	                }
	            ]
	        },
	        "date_statement": "1842 August 16",
	        "extent_statement": "2 pages",
	        "has_children": false,
	        "id": 919473,
	        "identifier_type": "local_mss",
	        "identifier_value": "1064009",
	        "level_num": 3,
	        "level_text": "file",
	        "linear_feet": null,
	        "load_seq": 3,
	        "max_depth": 0,
	        "org_unit_id": 1,
	        "origination": null,
	        "parent_id": 919472,
	        "resource_type": null,
	        "sib_seq": 1,
	        "title": "A. D folio (1 leaf). Deposition of Christian Goodman",
	        "top_component_id": 919471,
	        "updated_at": "2014-12-09T20:32:40Z"
	    }

		var idents = archivesProcess.returnIdents(testComponent)

		idents.should.have.property('dates')

		idents['bNumber'].should.equal('b12345567')


	});




})