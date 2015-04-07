var assert = require('assert')
var should = require('should')
var mmsReport = require("../process/mms_report.js");


describe('mmsReport', function () {





	it('should take a mms export record and count the fields present', function () {

		var testRecord = {"id":4263031,"d_id":3992205,"d_type":"Item","uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","solr_doc_hash":{"type":"item","mms_id":3992205,"uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","mms_name":"Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781","ingested":false,"org_unit_name_short":"Berg Collection","org_unit_code":"BRG","mms_org_unit_id":10002,"sib_seq":1,"identifier_local_image_id":"1691141","identifier_idx_local_image_id":"1691141","digitization_approved":true,"desc_md_status":"approved","rights_use_nypl_web":true,"rights_use_nypl_commercial":true,"title":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_sort":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_primary":[true],"title_supplied":[true],"title_lang":["eng"],"title_script":[""],"title_type":[""],"title_authority":["",""],"title_uri":[""],"title_authority_record_id":[],"identifier_local_hades":["1860789"],"identifier_idx_local_hades":["1860789"],"typeofResource":["text"],"typeofResource_primary":[false],"typeofResource_manuscript":[false],"typeofResource_collection":[false],"date":["1781-05-08T12:00:00Z"],"date_year":[1781],"date_point":["single"],"date_type":["dateCreated"],"date_qualifier":[""],"date_index":[0],"date_year_index":[0],"name":["Jefferson, Thomas (1743-1826 )"],"name_primary":[true],"name_type":["personal"],"name_authority":["naf"],"name_uri":[""],"name_role":["aut"],"name_authority_record_id":[""],"name_display_form":[""],"name_affiliation":[""],"name_description":[""],"location_repository":["nn"],"location_division":["Berg Collection"],"location_shelflocator":[],"identifier_local_call":["Berg Coll"],"identifier_idx_local_call":["Berg Coll"]},"xml":"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<mods xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://uri.nypl.org/schema/nypl_mods\" version=\"3.4\" xsi:schemaLocation=\"http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods\">\n<titleInfo ID=\"titleInfo_0\" usage=\"primary\" supplied=\"no\" lang=\"eng\"><title>Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781</title></titleInfo><name ID=\"name_0\" type=\"personal\" authority=\"naf\" valueURI=\"\" usage=\"primary\" authorityRecordId=\"\"><namePart>Jefferson, Thomas (1743-1826 )</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><typeOfResource ID=\"typeOfResource_0\">text</typeOfResource><originInfo ID=\"originInfo_0\"><dateCreated encoding=\"w3cdtf\" keyDate=\"yes\">1781-05-08</dateCreated></originInfo><identifier ID=\"identifier_0\" type=\"local_hades\" displayLabel=\"Hades struc ID (legacy)\">1860789</identifier><location ID=\"location_0\"><physicalLocation type=\"division\">Berg Collection</physicalLocation><shelfLocator>Berg Coll</shelfLocator></location></mods>\n"};

		var r = mmsReport.countHashFields(testRecord)	
		r.should.have.property("mms_org_unit_id")
		r.should.have.property("name")
		r['name'].should.equal(1)

	})

	it('should take a mms export record and count the divisions', function () {
		
		var testRecord = {"id":4263031,"d_id":3992205,"d_type":"Item","uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","solr_doc_hash":{"type":"item","mms_id":3992205,"uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","mms_name":"Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781","ingested":false,"org_unit_name_short":"Berg Collection","org_unit_code":"BRG","mms_org_unit_id":10002,"sib_seq":1,"identifier_local_image_id":"1691141","identifier_idx_local_image_id":"1691141","digitization_approved":true,"desc_md_status":"approved","rights_use_nypl_web":true,"rights_use_nypl_commercial":true,"title":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_sort":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_primary":[true],"title_supplied":[true],"title_lang":["eng"],"title_script":[""],"title_type":[""],"title_authority":["",""],"title_uri":[""],"title_authority_record_id":[],"identifier_local_hades":["1860789"],"identifier_idx_local_hades":["1860789"],"typeofResource":["text"],"typeofResource_primary":[false],"typeofResource_manuscript":[false],"typeofResource_collection":[false],"date":["1781-05-08T12:00:00Z"],"date_year":[1781],"date_point":["single"],"date_type":["dateCreated"],"date_qualifier":[""],"date_index":[0],"date_year_index":[0],"name":["Jefferson, Thomas (1743-1826 )"],"name_primary":[true],"name_type":["personal"],"name_authority":["naf"],"name_uri":[""],"name_role":["aut"],"name_authority_record_id":[""],"name_display_form":[""],"name_affiliation":[""],"name_description":[""],"location_repository":["nn"],"location_division":["Berg Collection"],"location_shelflocator":[],"identifier_local_call":["Berg Coll"],"identifier_idx_local_call":["Berg Coll"]},"xml":"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<mods xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://uri.nypl.org/schema/nypl_mods\" version=\"3.4\" xsi:schemaLocation=\"http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods\">\n<titleInfo ID=\"titleInfo_0\" usage=\"primary\" supplied=\"no\" lang=\"eng\"><title>Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781</title></titleInfo><name ID=\"name_0\" type=\"personal\" authority=\"naf\" valueURI=\"\" usage=\"primary\" authorityRecordId=\"\"><namePart>Jefferson, Thomas (1743-1826 )</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><typeOfResource ID=\"typeOfResource_0\">text</typeOfResource><originInfo ID=\"originInfo_0\"><dateCreated encoding=\"w3cdtf\" keyDate=\"yes\">1781-05-08</dateCreated></originInfo><identifier ID=\"identifier_0\" type=\"local_hades\" displayLabel=\"Hades struc ID (legacy)\">1860789</identifier><location ID=\"location_0\"><physicalLocation type=\"division\">Berg Collection</physicalLocation><shelfLocator>Berg Coll</shelfLocator></location></mods>\n"};

		var r = mmsReport.countDivision(testRecord)	

		r.should.equal('BRG')

		mmsReport.returnDivisions().should.have.property("Berg Collection")
		mmsReport.returnDivisions()['Berg Collection'].should.have.property("code")
		mmsReport.returnDivisions()['Berg Collection']['code'].should.equal('BRG')
		mmsReport.returnDivisions()['Berg Collection']['items'].should.equal(1)


		//also test this new way they are storing multiple divisions
		var testRecord = {"id":4263031,"d_id":3992205,"d_type":"Item","uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","solr_doc_hash":{"type":"item","mms_id":3992205,"uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","mms_name":"Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781","ingested":false,"org_unit_name_short":"Berg Collection","org_unit_code":",BRG,DAN","mms_org_unit_id":10002,"sib_seq":1,"identifier_local_image_id":"1691141","identifier_idx_local_image_id":"1691141","digitization_approved":true,"desc_md_status":"approved","rights_use_nypl_web":true,"rights_use_nypl_commercial":true,"title":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_sort":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_primary":[true],"title_supplied":[true],"title_lang":["eng"],"title_script":[""],"title_type":[""],"title_authority":["",""],"title_uri":[""],"title_authority_record_id":[],"identifier_local_hades":["1860789"],"identifier_idx_local_hades":["1860789"],"typeofResource":["text"],"typeofResource_primary":[false],"typeofResource_manuscript":[false],"typeofResource_collection":[false],"date":["1781-05-08T12:00:00Z"],"date_year":[1781],"date_point":["single"],"date_type":["dateCreated"],"date_qualifier":[""],"date_index":[0],"date_year_index":[0],"name":["Jefferson, Thomas (1743-1826 )"],"name_primary":[true],"name_type":["personal"],"name_authority":["naf"],"name_uri":[""],"name_role":["aut"],"name_authority_record_id":[""],"name_display_form":[""],"name_affiliation":[""],"name_description":[""],"location_repository":["nn"],"location_division":["Berg Collection"],"location_shelflocator":[],"identifier_local_call":["Berg Coll"],"identifier_idx_local_call":["Berg Coll"]},"xml":"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<mods xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://uri.nypl.org/schema/nypl_mods\" version=\"3.4\" xsi:schemaLocation=\"http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods\">\n<titleInfo ID=\"titleInfo_0\" usage=\"primary\" supplied=\"no\" lang=\"eng\"><title>Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781</title></titleInfo><name ID=\"name_0\" type=\"personal\" authority=\"naf\" valueURI=\"\" usage=\"primary\" authorityRecordId=\"\"><namePart>Jefferson, Thomas (1743-1826 )</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><typeOfResource ID=\"typeOfResource_0\">text</typeOfResource><originInfo ID=\"originInfo_0\"><dateCreated encoding=\"w3cdtf\" keyDate=\"yes\">1781-05-08</dateCreated></originInfo><identifier ID=\"identifier_0\" type=\"local_hades\" displayLabel=\"Hades struc ID (legacy)\">1860789</identifier><location ID=\"location_0\"><physicalLocation type=\"division\">Berg Collection</physicalLocation><shelfLocator>Berg Coll</shelfLocator></location></mods>\n"};
		var r = mmsReport.countDivision(testRecord)	

		r.should.equal('BRG')

		//also test this new way they are storing no divsiion
		var testRecord = {"id":4263031,"d_id":3992205,"d_type":"Item","uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","solr_doc_hash":{"type":"item","mms_id":3992205,"uuid":"ec080230-c5e9-012f-8518-58d385a7bc34","mms_name":"Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781","ingested":false,"org_unit_name_short":"Berg Collection","org_unit_code":", ","mms_org_unit_id":10002,"sib_seq":1,"identifier_local_image_id":"1691141","identifier_idx_local_image_id":"1691141","digitization_approved":true,"desc_md_status":"approved","rights_use_nypl_web":true,"rights_use_nypl_commercial":true,"title":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_sort":[" Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781"],"title_primary":[true],"title_supplied":[true],"title_lang":["eng"],"title_script":[""],"title_type":[""],"title_authority":["",""],"title_uri":[""],"title_authority_record_id":[],"identifier_local_hades":["1860789"],"identifier_idx_local_hades":["1860789"],"typeofResource":["text"],"typeofResource_primary":[false],"typeofResource_manuscript":[false],"typeofResource_collection":[false],"date":["1781-05-08T12:00:00Z"],"date_year":[1781],"date_point":["single"],"date_type":["dateCreated"],"date_qualifier":[""],"date_index":[0],"date_year_index":[0],"name":["Jefferson, Thomas (1743-1826 )"],"name_primary":[true],"name_type":["personal"],"name_authority":["naf"],"name_uri":[""],"name_role":["aut"],"name_authority_record_id":[""],"name_display_form":[""],"name_affiliation":[""],"name_description":[""],"location_repository":["nn"],"location_division":["Berg Collection"],"location_shelflocator":[],"identifier_local_call":["Berg Coll"],"identifier_idx_local_call":["Berg Coll"]},"xml":"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<mods xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://uri.nypl.org/schema/nypl_mods\" version=\"3.4\" xsi:schemaLocation=\"http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods\">\n<titleInfo ID=\"titleInfo_0\" usage=\"primary\" supplied=\"no\" lang=\"eng\"><title>Thomas Jefferson. Autograph letter, signed, to Colonel Archibald Ritchie, May 8, 1781</title></titleInfo><name ID=\"name_0\" type=\"personal\" authority=\"naf\" valueURI=\"\" usage=\"primary\" authorityRecordId=\"\"><namePart>Jefferson, Thomas (1743-1826 )</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><typeOfResource ID=\"typeOfResource_0\">text</typeOfResource><originInfo ID=\"originInfo_0\"><dateCreated encoding=\"w3cdtf\" keyDate=\"yes\">1781-05-08</dateCreated></originInfo><identifier ID=\"identifier_0\" type=\"local_hades\" displayLabel=\"Hades struc ID (legacy)\">1860789</identifier><location ID=\"location_0\"><physicalLocation type=\"division\">Berg Collection</physicalLocation><shelfLocator>Berg Coll</shelfLocator></location></mods>\n"};
		var r = mmsReport.countDivision(testRecord)	

		r.should.equal('undefined')


	})
	

	it('should split the mms export into seperate files based on division', function (done) {

		
		mmsReport.process("./test/data/mms_test.json", "./test/data/", function(){

			var fs = require('fs');
			
			var expected = ["rbk","map","rha","nodiv","brg","report"]

			//try deleteing them, if they were not created/split then they will error out
			for (var x in expected){
				var r = fs.unlinkSync("./test/data/" + expected[x] + ".json");
			}

			done()

		})



	})


})