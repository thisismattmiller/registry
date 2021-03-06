var should = require('should')
var compare = require("../util/compare.js");
var utils = require("../util/utils.js");
var mmsProcess = require("../process/mms_process.js");
var archivesLoad = require("../process/archives_collections.js")


describe('compareFlat', function () {

	var mmsCollectionTestRecord = {"id":4400054,"d_id":26994,"d_type":"Collection","uuid":"1837b570-c605-012f-2625-58d385a7bc34","solr_doc_hash":{"type":"collection","mms_id":26994,"uuid":"1837b570-c605-012f-2625-58d385a7bc34","mms_name":"The Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ...","ingested":false,"org_unit_name_short":"Berg Collection","org_unit_code":"BRG","mms_org_unit_id":10002,"digitization_approved":null,"desc_md_status":"draft","title":["The  Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ..."],"title_sort":[" Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ..."],"title_primary":[true],"title_supplied":[true],"title_lang":["eng"],"title_script":[""],"title_type":[""],"title_authority":["",""],"title_uri":[""],"title_authority_record_id":[],"identifier_local_hades":["618679"],"identifier_idx_local_hades":["618679"],"identifier_local_other":["NYPG784271303-B"],"identifier_idx_local_other":["NYPG784271303-B"],"identifier_local_catnyp":["b1493851"],"identifier_idx_local_catnyp":["b1493851"],"identifier_local_bnumber":["b10483503"],"identifier_idx_local_bnumber":["b10483503"],"date":["1761-01-01T12:00:00Z"],"date_year":[1761],"date_point":["single"],"date_type":["dateIssued"],"date_qualifier":[""],"date_index":[0],"date_year_index":[0],"name":["Newbery, John (1713-1767)","Goldsmith, Oliver (1730?-1774)","Telescope, Tom"],"name_primary":[false,false,false],"name_type":["personal","personal","personal"],"name_authority":["naf","naf","naf"],"name_uri":["","",""],"name_role":["aut","aut","aut"],"name_authority_record_id":["","",""],"name_display_form":["","",""],"name_affiliation":["","",""],"name_description":["","",""],"note":["\"To the young gentlemen and ladies of Great Britain and Ireland, this philosophy of tops and balls is ... inscribed, by ... J. Newbery\": 3d prelim. p.","For variations see: Babson Institute Library Newton Collection, 115//","Imperfect: p. 111-112 mutilated, affecting 2 words of text.","Publisher's advertisements: p. 126-140.","Sometimes attributed to Oliver Goldsmith."],"note_type":["content","content","content","content","content"],"location_repository":["nn"],"location_division":["Berg Collection"],"location_shelflocator":[],"identifier_local_call":["Berg Coll. 77-645"],"identifier_idx_local_call":["Berg Coll. 77-645"]},"xml":"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<mods xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://uri.nypl.org/schema/nypl_mods\" version=\"3.4\" xsi:schemaLocation=\"http://uri.nypl.org/schema/nypl_mods http://uri.nypl.org/schema/nypl_mods\">\n<titleInfo ID=\"titleInfo_0\" usage=\"primary\" supplied=\"no\" lang=\"eng\"><nonSort>The </nonSort><title>Newtonian system of philosophy, adapted to the capacities of young gentlemen and ladies ... being the substance of six lectures read to the Lilliputian Society, by Tom Telescope, A. M., and collected and methodized for the benefit of the youth of these Kingdoms, by their old friend Mr. Newbery ...</title></titleInfo><name ID=\"name_0\" type=\"personal\" authority=\"naf\" valueURI=\"\" authorityRecordId=\"\"><namePart>Newbery, John (1713-1767)</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><name ID=\"name_1\" type=\"personal\" authority=\"naf\" valueURI=\"\" authorityRecordId=\"\"><namePart>Goldsmith, Oliver (1730?-1774)</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><name ID=\"name_2\" type=\"personal\" authority=\"naf\" valueURI=\"\" authorityRecordId=\"\"><namePart>Telescope, Tom</namePart><affiliation/><role><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"code\">aut</roleTerm><roleTerm valueURI=\"http://id.loc.gov/vocabulary/relators/aut\" authority=\"marcrelator\" type=\"text\">Author</roleTerm></role></name><originInfo ID=\"originInfo_0\"><dateIssued encoding=\"w3cdtf\" keyDate=\"yes\">1761</dateIssued><place><placeTerm>London</placeTerm></place></originInfo><note ID=\"note_0\" type=\"content\">\"To the young gentlemen and ladies of Great Britain and Ireland, this philosophy of tops and balls is ... inscribed, by ... J. Newbery\": 3d prelim. p.</note><note ID=\"note_1\" type=\"content\">For variations see: Babson Institute Library Newton Collection, 115//</note><note ID=\"note_2\" type=\"content\">Imperfect: p. 111-112 mutilated, affecting 2 words of text.</note><note ID=\"note_3\" type=\"content\">Publisher's advertisements: p. 126-140.</note><note ID=\"note_4\" type=\"content\">Sometimes attributed to Oliver Goldsmith.</note><identifier ID=\"identifier_0\" type=\"local_hades\" displayLabel=\"Hades struc ID (legacy)\">618679</identifier><identifier ID=\"identifier_1\" type=\"local_other\" displayLabel=\"RLIN/OCLC\">NYPG784271303-B</identifier><identifier ID=\"identifier_2\" type=\"local_catnyp\" displayLabel=\"CATNYP ID (legacy)\">b1493851</identifier><identifier ID=\"identifier_3\" type=\"local_bnumber\" displayLabel=\"NYPL catalog ID (B-number)\">b10483503</identifier><location ID=\"location_0\"><physicalLocation authority=\"marcorg\" type=\"repository\">nn</physicalLocation><physicalLocation type=\"division\">Berg Collection</physicalLocation><shelfLocator>Berg Coll. 77-645</shelfLocator></location></mods>\n"}
	var archivesCollectionTestRecord = {"active":true,"bnumber":"b10483503","boost_queries":null,"call_number":"MssArc RG8 5844","component_layout_id":null,"created_at":"2013-04-01T14:58:47Z","data":{"unitdate":[{"value":"1908-2000","type":"inclusive"}],"date_inclusive_start":1908,"date_inclusive_end":2000,"keydate":"1908","dates_index":[1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000],"unittitle":[{"value":"115th Street Branch records"}],"physdesc":[{"format":"structured","physdesc_components":[{"name":"extent","value":".33 linear foot","unit":"linear feet"},{"name":"extent","value":"1 box","unit":"containers"}],"supress_display":true}],"repository":[{"value":"<span class=\"corpname\">The New York Public Library. <span class=\"subarea\">Manuscripts and Archives Division</span></span> <div class=\"address\"> <span class=\"addressline\">New York, New York</span></div>"}],"langmaterial":[{"value":"English"}],"prefercite":[{"value":"<p>115th Street Branch Records, Manuscripts and Archives Division, The New York Public Library.</p>"}],"origination":[{"value":"New York Public Library. 115th Street Branch","type":"corpname"}],"bioghist":[{"value":"<p>The 115th Street Branch of The New York Public Library was opened in 1908. The library building was designed by the architectural firm of McKim, Mead &amp; White and was constructed with funds provided by Andrew Carnegie.</p>","supress_display":true}],"scopecontent":[{"value":"<p>Publicity materials and administrative files documenting the operations of the 115th Street Branch of The New York Public Library.</p>","supress_display":true}],"acqinfo":[{"value":"<p>Transferred from 115th Street Branch Library.</p>"}],"unitid":[{"value":"MssArc RG8 5844","type":"local_call"},{"value":"5844","type":"local_mss"}],"processinfo":[{"value":"<p>Compiled Jim Moske; machine readable finding aid created by FAKER.</p>"}],"abstract":[{"value":"The 115th Street Branch of The New York Public Library was opened in 1908. The library building was designed by the architectural firm of McKim, Mead &amp; White and was constructed with funds provided by Andrew Carnegie. Publicity materials and administrative files documenting the operations of the 115th Street Branch of The New York Public Library.","generated":true}],"extent_statement":".33 linear feet (1 box)"},"date_processed":2005,"date_statement":"1908-2000","extent_statement":".33 linear feet (1 box)","featured_seq":null,"fully_digitized":0,"has_digital":0,"id":3,"identifier_type":"local_mss","identifier_value":"5844","keydate":1908,"linear_feet":0.33,"max_depth":2,"org_unit_id":14,"origination":"New York Public Library. 115th Street Branch","pdf_finding_aid":{"url":null},"series_count":1,"title":"115th Street Branch records","updated_at":"2014-12-04T21:22:08Z"}
	var archivesCollectionTestRecord2 = {"active":true,"bnumber":"b12345","boost_queries":null,"call_number":"MssArc RG8 5844","component_layout_id":null,"created_at":"2013-04-01T14:58:47Z","data":{"unitdate":[{"value":"1908-2000","type":"inclusive"}],"date_inclusive_start":1908,"date_inclusive_end":2000,"keydate":"1908","dates_index":[1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000],"unittitle":[{"value":"115th Street Branch records"}],"physdesc":[{"format":"structured","physdesc_components":[{"name":"extent","value":".33 linear foot","unit":"linear feet"},{"name":"extent","value":"1 box","unit":"containers"}],"supress_display":true}],"repository":[{"value":"<span class=\"corpname\">The New York Public Library. <span class=\"subarea\">Manuscripts and Archives Division</span></span> <div class=\"address\"> <span class=\"addressline\">New York, New York</span></div>"}],"langmaterial":[{"value":"English"}],"prefercite":[{"value":"<p>115th Street Branch Records, Manuscripts and Archives Division, The New York Public Library.</p>"}],"origination":[{"value":"New York Public Library. 115th Street Branch","type":"corpname"}],"bioghist":[{"value":"<p>The 115th Street Branch of The New York Public Library was opened in 1908. The library building was designed by the architectural firm of McKim, Mead &amp; White and was constructed with funds provided by Andrew Carnegie.</p>","supress_display":true}],"scopecontent":[{"value":"<p>Publicity materials and administrative files documenting the operations of the 115th Street Branch of The New York Public Library.</p>","supress_display":true}],"acqinfo":[{"value":"<p>Transferred from 115th Street Branch Library.</p>"}],"unitid":[{"value":"MssArc RG8 5844","type":"local_call"},{"value":"5844","type":"local_mss"}],"processinfo":[{"value":"<p>Compiled Jim Moske; machine readable finding aid created by FAKER.</p>"}],"abstract":[{"value":"The 115th Street Branch of The New York Public Library was opened in 1908. The library building was designed by the architectural firm of McKim, Mead &amp; White and was constructed with funds provided by Andrew Carnegie. Publicity materials and administrative files documenting the operations of the 115th Street Branch of The New York Public Library.","generated":true}],"extent_statement":".33 linear feet (1 box)"},"date_processed":2005,"date_statement":"1908-2000","extent_statement":".33 linear feet (1 box)","featured_seq":null,"fully_digitized":0,"has_digital":0,"id":3,"identifier_type":"local_mss","identifier_value":"5844","keydate":1908,"linear_feet":0.33,"max_depth":2,"org_unit_id":14,"origination":"New York Public Library. 115th Street Branch","pdf_finding_aid":{"url":null},"series_count":1,"title":"115th Street Branch records","updated_at":"2014-12-04T21:22:08Z"}

	var mmsIdents = mmsProcess.extractIds(mmsCollectionTestRecord)	
	var archivesIdents = archivesLoad.extractIds(archivesCollectionTestRecord)
	var archivesIdents2 = archivesLoad.extractIds(archivesCollectionTestRecord2)


	it('should take two record ident objects and compare all keys looking for matches: Match ', function () {



		var r = compare.compareIdentifiersExact(mmsIdents,archivesIdents)

		r['match'].should.equal(true)
		r['matchOn'].indexOf('bNumber').should.equal(0)


	})

	it('should take two record ident objects and compare all keys looking for matches: No Match', function () {

		r = compare.compareIdentifiersExact(mmsIdents,archivesIdents2)
		r['match'].should.equal(false)


	})

	it('should take two record ident objects and compare all keys looking for matches: Call w/ diff bNumber  ', function () {

		//with only match on callnumber but diffrent b numbers
		var a = {"callNumber" : "ABCD", "bNumber" : "b1234567"}
		var b = {"callNumber" : "ABCD", "bNumber" : "b7654321"}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(false)

	})

	it('should take two record ident objects and compare all keys looking for matches: Call w/ same bNumber ', function () {

		//with only match on callnumber but same b numbers
		var a = {"callNumber" : "ABCD", "bNumber" : "b1234567"}
		var b = {"callNumber" : "ABCD", "bNumber" : "b1234567"}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(true)


	})

	it('should take two record ident objects and compare all keys looking for matches: Call no title ', function () {

		//with only match on callnumber no bnumber ot title
		var a = {"callNumber" : "ABCD"}
		var b = {"callNumber" : "ABCD"}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(false)

	})

	it('should take two record ident objects and compare all keys looking for matches: Call w/ title', function () {


		//with only matching call numbers and similar looking titles

		var a = { title: 'Richard Tucker photographs', callNumber: '*T-VIM 1995-005' }
		var b = { callNumber: '*T-Vim 1995-005', title: 'Richard Tucker photographs'}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(true)
		r['confidence'].should.equal(1)



	})
	it('should take two record ident objects and compare all keys looking for matches: Call with slightly diff title ', function () {


		var a = { title: 'Richard Tucker photographs, 1934-1951', callNumber: '*T-VIM 1995-005' }
		var b = { callNumber: '*T-Vim 1995-005', title: 'Richard Tucker photographs'}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(true)
		r['confidence'].should.equal(1)

	})

	it('should take two record ident objects and compare all keys looking for matches: Call Number only okay if MSS Col ', function () {


		var a = { bNumber: "b1234567", callNumber: 'MssCol 3101' }
		var b = { callNumber: 'MssCol 3101', bNumber: false}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(true)
		r['confidence'].should.equal(1)

	})


	it('should take two record ident objects and compare all keys looking for matches: Call with Untitled title', function () {
		var a = { title: 'Untitled', callNumber: '*T-VIM 1995-005' }
		var b = { callNumber: '*T-Vim 1995-005', title: 'Untitled'}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(false)

	})

	it('should take two record ident objects and compare on MSS DB id', function () {
		var a = { title: 'Untitled', mssDb: '12345' }
		var b = { mssDb: '12345', title: 'Untitled'}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(true)

	})




	it('should take two record ident objects and compare all keys looking for matches: Call Only try 2', function () {
		var a = { callNumber: '*T-Mss 1996-016',
				  mss: '21740',
				  bNumber: 'b16098291',
				  barcode: false,
				  keydate: 1815,
				  date_inclusive_start: 1815,
				  date_inclusive_end: 1988,
				  title: 'Emeline Clark Roche Collection',
				  origination: 'Roche, Emeline Clark, 1902-1995',
				  mssDb: 1833
				}


		var b = { mmsDb: '40984',
			      mmsType: 'Collection',
			      mmsUuid: 'ef56d760-2ae9-0131-5dd5-58d385a7b928',
			      title: 'Emeline Clark Roche Collection',
			      bNumber: '16098283',
			      callNumber: '*T-Mss 1996-016',
   				}

		r = compare.compareIdentifiersExact(a,b)
		r['match'].should.equal(true)

	})




	it('should take two strings and return their similarity no fuzzy', function () {
		r = compare.compareTitles('Richard Tucker photographs, 1934-1951', 'Richard Tucker photographs')
		r.should.be.above(0.8)
	})

	it('should take two strings and return their similarity with fuzzy', function () {
		r = compare.compareTitles('Richard Tucker photographs', 'Richardersd Tuckers [sic] photographs',0.75)
		r.should.be.above(0.75)
	})


	it('should take two strings and compare them by words: non-fuzzy', function () {
		r = compare.compareByWords("Deposition of Christian Goodman in Lincoln's hand", 'A. D folio (1 leaf). Deposition of Christian Goodman')
		r.should.equal(true)
	})

	it('should take two strings and compare them by words: fuzzy', function () {
		r = compare.compareByWords("Deposition of Christian Goodman in Lincoln's hand", 'A. D folio (1 leaf). Depositions of Christians Goodman',true)
		r.should.equal(true)
	})

	it('should take date string arrays and return t/f if they share a stirng', function () {
		r = compare.compareDateArray(["1982","July 4, 1776"], ["1992","July 4, 1776"] )
		r.should.equal(true)
	})

})