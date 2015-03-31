var should = require('should')
var archivesLoad = require("../process/archives_collections.js")


describe('archivesLoad', function () {

	it('should load the archives collection json and extract important identifiers', function (done) {

		archivesLoad.loadData("./test/data/archives_collections.json", function(archivesCollections){
			
			archivesCollections.should.be.type('object');
			archivesCollections['1']['title'].should.equal('Thomas Addis Emmet collection')
			archivesCollections['1']['callNumber'].should.equal('MssCol 927')
			archivesCollections['1']['mss'].should.equal('927')
			archivesCollections['1']['bNumber'].should.equal(false)

			done()

		})
	})

	it('should find collection level record(s) by passing an identifier', function (done) {

		archivesLoad.loadData("./test/data/archives_collections.json", function(archivesCollections){
	
			var r = archivesLoad.matchIdentifier({'callNumber' : 'MssCol 2993'})
			r.should.be.type('object')			
			r.length.should.equal(1)
			r[0]['callNumber'].should.equal('MssCol 2993')

			var r = archivesLoad.matchIdentifier({'bNumber': 'b19614101'})
			r.should.be.type('object')			
			r.length.should.equal(1)
			r[0]['bNumber'].should.equal('b19614101')

			var r = archivesLoad.matchIdentifier({ 'mss' : 4033 })
			r.should.be.type('object')			
			r.length.should.equal(1)
			r[0]['mss'].should.equal('4033')

			done()


		})
	})


	it('should use the quick match lookup to find a possible match on identifier', function (done) {

		archivesLoad.loadData("./test/data/archives_collections.json", function(archivesCollections){
		
			

			archivesLoad.matchIdentifierIndex("bNumber","b11985357").should.equal(true)
			archivesLoad.matchIdentifierIndex("callNumber","hgnfdgshrtv").should.equal(false)
			archivesLoad.matchIdentifierIndex("bNumber","1").should.equal(false)
			archivesLoad.matchIdentifierIndex("Whatever",0).should.equal(false)


			done()


		})
	})


	it('should return the extracted identifiers from a passed archives collection level extract record', function () {

		var archivesCollectionTestRecord = {"active":true,"bnumber":"b16045173","boost_queries":null,"call_number":"MssArc RG8 5844","component_layout_id":null,"created_at":"2013-04-01T14:58:47Z","data":{"unitdate":[{"value":"1908-2000","type":"inclusive"}],"date_inclusive_start":1908,"date_inclusive_end":2000,"keydate":"1908","dates_index":[1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000],"unittitle":[{"value":"115th Street Branch records"}],"physdesc":[{"format":"structured","physdesc_components":[{"name":"extent","value":".33 linear foot","unit":"linear feet"},{"name":"extent","value":"1 box","unit":"containers"}],"supress_display":true}],"repository":[{"value":"<span class=\"corpname\">The New York Public Library. <span class=\"subarea\">Manuscripts and Archives Division</span></span> <div class=\"address\"> <span class=\"addressline\">New York, New York</span></div>"}],"langmaterial":[{"value":"English"}],"prefercite":[{"value":"<p>115th Street Branch Records, Manuscripts and Archives Division, The New York Public Library.</p>"}],"origination":[{"value":"New York Public Library. 115th Street Branch","type":"corpname"}],"bioghist":[{"value":"<p>The 115th Street Branch of The New York Public Library was opened in 1908. The library building was designed by the architectural firm of McKim, Mead &amp; White and was constructed with funds provided by Andrew Carnegie.</p>","supress_display":true}],"scopecontent":[{"value":"<p>Publicity materials and administrative files documenting the operations of the 115th Street Branch of The New York Public Library.</p>","supress_display":true}],"acqinfo":[{"value":"<p>Transferred from 115th Street Branch Library.</p>"}],"unitid":[{"value":"MssArc RG8 5844","type":"local_call"},{"value":"5844","type":"local_mss"}],"processinfo":[{"value":"<p>Compiled Jim Moske; machine readable finding aid created by FAKER.</p>"}],"abstract":[{"value":"The 115th Street Branch of The New York Public Library was opened in 1908. The library building was designed by the architectural firm of McKim, Mead &amp; White and was constructed with funds provided by Andrew Carnegie. Publicity materials and administrative files documenting the operations of the 115th Street Branch of The New York Public Library.","generated":true}],"extent_statement":".33 linear feet (1 box)"},"date_processed":2005,"date_statement":"1908-2000","extent_statement":".33 linear feet (1 box)","featured_seq":null,"fully_digitized":0,"has_digital":0,"id":3,"identifier_type":"local_mss","identifier_value":"5844","keydate":1908,"linear_feet":0.33,"max_depth":2,"org_unit_id":14,"origination":"New York Public Library. 115th Street Branch","pdf_finding_aid":{"url":null},"series_count":1,"title":"115th Street Branch records","updated_at":"2014-12-04T21:22:08Z"}
		var r = archivesLoad.extractIds(archivesCollectionTestRecord)
		r.should.be.type('object')			
		r['bNumber'].should.equal('b16045173')
		r['callNumber'].should.equal('MssArc RG8 5844')

	})


})


