var assert = require('assert')
var should = require('should')
var mmsProcess = require("../process/mms_process.js");


describe('mssProcess', function () {

	var testRecord = {"id":4400054,"d_id":26994,"d_type":"Collection","uuid":"1837b570-c605-012f-2625-58d385a7bc34","solr_doc_hash":{"type":"collection","mms_id":26994,"uuid":"1837b570-c605-012f-2625-58d385a7bc34","mms_name":"The Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ...","ingested":false,"org_unit_name_short":"Berg Collection","org_unit_code":"BRG","mms_org_unit_id":10002,"digitization_approved":null,"desc_md_status":"draft","title":["The  Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ..."],"title_sort":[" Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ..."],"title_primary":[true],"title_supplied":[true],"title_lang":["eng"],"title_script":[""],"title_type":[""],"title_authority":["",""],"title_uri":[""],"title_authority_record_id":[],"identifier_local_hades":["618679"],"identifier_idx_local_hades":["618679"],"identifier_local_other":["NYPG784271303-B"],"identifier_idx_local_other":["NYPG784271303-B"],"identifier_local_catnyp":["b1493851"],"identifier_idx_local_catnyp":["b1493851"],"identifier_local_bnumber":["b10483503"],"identifier_idx_local_bnumber":["b10483503"],"date":["1761-01-01T12:00:00Z"],"date_year":[1761],"date_point":["single"],"date_type":["dateIssued"],"date_qualifier":[""],"date_index":[0],"date_year_index":[0],"name":["Newbery, John (1713-1767)","Goldsmith, Oliver (1730?-1774)","Telescope, Tom"],"name_primary":[false,false,false],"name_type":["personal","personal","personal"],"name_authority":["naf","naf","naf"],"name_uri":["","",""],"name_role":["aut","aut","aut"],"name_authority_record_id":["","",""],"name_display_form":["","",""],"name_affiliation":["","",""],"name_description":["","",""],"note":["\"To the young gentlemen and ladies of Great Britain and Ireland, this philosophy of tops and balls is ... inscribed, by ... J. Newbery\": 3d prelim. p.","For variations see: Babson Institute Library Newton Collection, 115//","Imperfect: p. 111-112 mutilated, affecting 2 words of text.","Publisher's advertisements: p. 126-140.","Sometimes attributed to Oliver Goldsmith."],"note_type":["content","content","content","content","content"],"location_repository":["nn"],"location_division":["Berg Collection"],"location_shelflocator":[],"identifier_local_call":["Berg Coll. 77-645"],"identifier_idx_local_call":["Berg Coll. 77-645"]},"xml":"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<mods xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://uri.nypl.org/schema/nypl_mods\" version=\"3.4\" xsi:schemaLocation=\"http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods\">\n<titleInfo ID=\"titleInfo_0\" usage=\"primary\" supplied=\"no\" lang=\"eng\"><nonSort>The </nonSort><title>Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ...</title></titleInfo><name ID=\"name_0\" type=\"personal\" authority=\"naf\" valueURI=\"\" authorityRecordId=\"\"><namePart>Newbery, John (1713-1767)</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><name ID=\"name_1\" type=\"personal\" authority=\"naf\" valueURI=\"\" authorityRecordId=\"\"><namePart>Goldsmith, Oliver (1730?-1774)</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><name ID=\"name_2\" type=\"personal\" authority=\"naf\" valueURI=\"\" authorityRecordId=\"\"><namePart>Telescope, Tom</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><originInfo ID=\"originInfo_0\"><dateIssued encoding=\"w3cdtf\" keyDate=\"yes\">1761</dateIssued><place><placeTerm>London</placeTerm></place></originInfo><note ID=\"note_0\" type=\"content\">\"To the young gentlemen and ladies of Great Britain and Ireland, this philosophy of tops and balls is ... inscribed, by ... J. Newbery\": 3d prelim. p.</note><note ID=\"note_1\" type=\"content\">For variations see: Babson Institute Library Newton Collection, 115//</note><note ID=\"note_2\" type=\"content\">Imperfect: p. 111-112 mutilated, affecting 2 words of text.</note><note ID=\"note_3\" type=\"content\">Publisher's advertisements: p. 126-140.</note><note ID=\"note_4\" type=\"content\">Sometimes attributed to Oliver Goldsmith.</note><identifier ID=\"identifier_0\" type=\"local_hades\" displayLabel=\"Hades struc ID (legacy)\">618679</identifier><identifier ID=\"identifier_1\" type=\"local_other\" displayLabel=\"RLIN/OCLC\">NYPG784271303-B</identifier><identifier ID=\"identifier_2\" type=\"local_catnyp\" displayLabel=\"CATNYP ID (legacy)\">b1493851</identifier><identifier ID=\"identifier_3\" type=\"local_bnumber\" displayLabel=\"NYPL catalog ID (B-number)\">b10483503</identifier><location ID=\"location_0\"><physicalLocation authority=\"marcorg\" type=\"repository\">nn</physicalLocation><physicalLocation type=\"division\">Berg Collection</physicalLocation><shelfLocator>Berg Coll. 77-645</shelfLocator></location></mods>\n"};

	it('should parse a mms record into identfiers used to match', function () {

		var r = mmsProcess.extractIds(testRecord)	

		r['mmsDb'].should.equal("26994")
		r['oclc'].should.equal('NYPG784271303-B')
		r['callNumber'].should.equal('Berg Coll. 77-645')

		r['title'].should.equal('The Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ...')
		
	})



	it('should accept a mms division abbrv. and stream each record through a provided function passing each record', function (done) {

		mmsProcess.setPathOverride("./test/data/")


		var options = {

			abbreviation : 'mms_test',

			action: function(data){ 	
					//all the mss records will have this prop. so if it exists then it is working				
					data.should.have.property('uuid')
				}, 

			unitCb:  function(){ 
					done() 
				}
		}


		mmsProcess.streamRecords(options)	
	})


	it('should return a hiearchy map of a collection by passsing the collection uuid', function (done) {

		mmsProcess.setExtractsSplitPath("./test/data/childrenSplits/")

		//this is a test file in the data dir
		mmsProcess.returnChildHierarchyLayout('8122ebf0-c5f4-012f-59ef-58d385a7bc34', function(hierarchyMap){

			//console.log(hierarchyMap)

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