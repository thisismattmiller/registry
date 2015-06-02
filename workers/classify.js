var cluster = require('cluster'),
	config = require("config"),
	fs = require("fs"),
	readable = require('stream').Readable,
	jsonStream = require('JSONStream'),
	async = require("async"),
	request = require('request'),
	es = require('event-stream')




var urlOclc = "http://classify.oclc.org/classify2/Classify?oclc={ID}"
var urlIsbn = "http://classify.oclc.org/classify2/Classify?isbn={ID}"
var urlIssn = "http://classify.oclc.org/classify2/Classify?issn={ID}"
var urlTitleAuthor = "http://classify.oclc.org/classify2/Classify?author={author}&title={title}"
var urlTitle = "http://classify.oclc.org/classify2/Classify?title={title}"
var debug = false



if (cluster.isMaster) {
  // Fork workers.


  //workfile location
  var pathToCatalogClassify = config.get('Storage')['extracts']['catalogClassify']


  //tmp
  pathToCatalogClassify = "/Users/matt/Desktop/data/results/catalog_classify_test.json"


  //stream the file into memory

	var stream = fs.createReadStream(pathToCatalogClassify, {encoding: 'utf8'})

	var parser = jsonStream.parse('*')

	var index = {}

	var workers = {}

	var totalRecords = 0



	//this is the function that will be called for each data line in the file
	var processData = es.mapSync(function (data) {

		data.complete = false
		data.working = false
		data.workingStart = 0

		index[data.bnumber.toString()] = data


		// bnumbers['b'+data.id] = true
		totalRecords++
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		process.stdout.write( "Loading: " + totalRecords )




	})


	parser.on('end', function(obj) {



		var buildWorker = function(){

			setTimeout(function(){

				var worker = cluster.fork();

				worker.on('message', function(msg) {
					// we only want to intercept messages that have a chat property
					if (msg.req) {

						if (debug) console.log("Worker#", msg.req.id, "Asking for work");

						if (msg.req.complete){

							//the worker finished one
							index[msg.req.complete.bnumber.toString()].complete = true
							index[msg.req.complete.bnumber.toString()].working = false
							index[msg.req.complete.bnumber.toString()].workingStart = Math.floor(Date.now() / 1000)

							//good job :)

							workers[msg.req.id.toString()].complete++


						}

						var foundWork = false

						//find a new one
						for (var x in index){

							if (index[x].complete === false && index[x].working === false ){

								index[x].working = true
								if (debug) console.log("Master: Sending", index[x].bnumber )
								worker.send({ req: { record: index[x] } })
								foundWork = true

								break

							}
						}


						if (!foundWork){
							console.log("No more work?")
						}


					}
				});


			}, Math.floor(Math.random() * (10000 - 0))   )

		}




	  	for (var i = 1; i < 16; i++) {

	  		workers[i.toString()] = { complete : 0 }

	  		buildWorker()

	  	}


	  	console.log("\nSpawned",Object.keys(workers).length, "workers" )


	  	//this is the update and cleanup watcher, make sure no records are checked out for a long time and update to screen status
	  	setInterval(function(){

	  		var now = Math.floor(Date.now() / 1000)
	  		var complete = 0

	  		//loop over all the records
			for (var x in index){

				//make sure it has not been checked out forever
				if (index[x].working === true ){

					//5min
					if (index[x].workingStart - now > 300){
						console.log("RESETING:",index[x])
						index[x].complete = false
						index[x].working = false
						index[x].workingStart = 0
					}
				}

				if (index[x].complete){
					complete++
				}



			}

			var wString = ""
			for (var x in workers){
				wString = wString + x + ":" + workers[x].complete + "|"
			}



			process.stdout.clearLine()
			process.stdout.cursorTo(0)
			process.stdout.write( complete + "/" + totalRecords + "(" + Math.floor(complete/totalRecords*100) + ") " + wString )




	  	},1000)




	})



	stream.pipe(parser).pipe(processData)









} else {

	var activeRecord = false
	var foundSomething = false
	var finished = false
	var results = []


	var pathToCatalogClassifyResults = config.get('Storage')['extracts']['catalogClassifyResults']


	//kick off the first record
	process.send({ req: {complete: activeRecord, id: cluster.worker.id} });

	process.on('message', function(msg) {



		if (msg.req) {

			activeRecord = msg.req.record

			foundSomething = false
			finished = false
			results = []

			if (debug) console.log(activeRecord)


			if (activeRecord.oclc.length>0){

				//we want to grab all the oclc responses and end if we have any non zero responses

				async.eachSeries(activeRecord.oclc, function(oclcNumber, callback){
					var url = urlOclc.replace('{ID}',oclcNumber)
					if (debug) console.log(url)
					request({ encoding: "utf8",  uri: url}, function (error, response, body) {

						if (!error && response.statusCode == 200) {
							//did we get a hit?
							if (body.search('<response code="2"')>-1) foundSomething = true
							results.push(body)
						}else{
							if (debug) console.log("Request ERROR:",response.statusCode,error)
						}

						callback()

					})



				}, function(error){


					if (!foundSomething){


						// we did not get a single match on the oclc numbers try isbn and then issn


						async.eachSeries(activeRecord.isbn, function(isbnNumber, callback){
							var url = urlIsbn.replace('{ID}',isbnNumber)
							if (debug) console.log(url)
							request({ encoding: "utf8",  uri: url}, function (error, response, body) {

								if (!error && response.statusCode == 200) {
									//did we get a hit?
									if (body.search('<response code="2"')>-1) foundSomething = true
									results.push(body)
								}else{
									if (debug) console.log("Request ERROR:",response.statusCode,error)
								}

								callback()

							})



						}, function(error){


							async.eachSeries(activeRecord.issn, function(issnNumber, callback){
								var url = urlIssn.replace('{ID}',issnNumber)
								if (debug) console.log(url)
								request({ encoding: "utf8",  uri: url}, function (error, response, body) {

									if (!error && response.statusCode == 200) {
										//did we get a hit?
										if (body.search('<response code="2"')>-1) foundSomething = true
										results.push(body)
									}else{
										if (debug) console.log("Request ERROR:",response.statusCode,error)
									}

									callback()

								})



							}, function(error){

								//if we did not find something after all of that then try the title and author
								if (!foundSomething){


									if (activeRecord.title && activeRecord.author){
										var url = urlTitleAuthor.replace('{title}',encodeURIComponent(activeRecord.title)).replace('{author}',encodeURIComponent(activeRecord.author))
									}else{
										var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
									}

									request({ encoding: "utf8",  uri: url}, function (error, response, body) {

										if (!error && response.statusCode == 200) {
											//did we get a hit?
											if (body.search('<response code="2"')>-1) foundSomething = true

											results.push(body)
										}else{
											if (debug) console.log("Request ERROR:",response.statusCode,error)
										}

										//did we find nothing, try just the title
										if (activeRecord.author && foundSomething == false){

											var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
											request({ encoding: "utf8",  uri: url}, function (error, response, body) {

												if (!error && response.statusCode == 200) {
													//did we get a hit?
													if (body.search('<response code="2"')>-1) foundSomething = true

													results.push(body)
												}else{
													if (debug) console.log("Request ERROR:",response.statusCode,error)
												}

												finished = true

											})



										}else{
											finished = true
										}



									})


								}else{

									finished = true

								}

							})

						})


					}else{

						//we are good
						finished = true

					}

				})



			}else if (activeRecord.isbn.length>0 || activeRecord.issn.length>0){


				//no OCLC but it has isbn or issn


				async.eachSeries(activeRecord.isbn, function(isbnNumber, callback){
					var url = urlIsbn.replace('{ID}',isbnNumber)
					if (debug) console.log(url)
					request({ encoding: "utf8",  uri: url}, function (error, response, body) {

						if (!error && response.statusCode == 200) {
							//did we get a hit?
							if (body.search('<response code="2"')>-1) foundSomething = true
							results.push(body)
						}else{
							if (debug) console.log("Request ERROR:",response.statusCode,error)
						}

						callback()

					})



				}, function(error){

					//try the issn as well
					async.eachSeries(activeRecord.issn, function(issnNumber, callback){
						var url = urlIssn.replace('{ID}',issnNumber)
						if (debug) console.log(url)
						request({ encoding: "utf8",  uri: url}, function (error, response, body) {

							if (!error && response.statusCode == 200) {
								//did we get a hit?
								if (body.search('<response code="2"')>-1) foundSomething = true
								results.push(body)
							}else{
								if (debug) console.log("Request ERROR:",response.statusCode,error)
							}

							callback()

						})



					}, function(error){


						//if we did not find something after all of that then try the title and author
						if (!foundSomething){


							if (activeRecord.title && activeRecord.author){
								var url = urlTitleAuthor.replace('{title}',encodeURIComponent(activeRecord.title)).replace('{author}',encodeURIComponent(activeRecord.author))
							}else{
								var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
							}

							if (debug) console.log(url)
							request({ encoding: "utf8",  uri: url}, function (error, response, body) {

								if (!error && response.statusCode == 200) {
									//did we get a hit?
									if (body.search('<response code="2"')>-1) foundSomething = true

									results.push(body)
								}else{
									if (debug) console.log("Request ERROR:",response.statusCode,error)
								}

								//did we find nothing, try just the title
								if (activeRecord.author && foundSomething == false){

									var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
									request({ encoding: "utf8",  uri: url}, function (error, response, body) {

										if (!error && response.statusCode == 200) {
											//did we get a hit?
											if (body.search('<response code="2"')>-1) foundSomething = true

											results.push(body)
										}else{
											if (debug) console.log("Request ERROR:",response.statusCode,error)
										}

										finished = true

									})



								}else{
									finished = true
								}

							})


						}else{

							finished = true

						}

					})




				})


			}else if (activeRecord.possibleOclc.length>0 ){

				//we have a possible OCLC number, try it and then try the title if not

				async.eachSeries(activeRecord.possibleOclc, function(oclcNumber, callback){
					var url = urlOclc.replace('{ID}',oclcNumber)
					if (debug) console.log(url)
					request({ encoding: "utf8",  uri: url}, function (error, response, body) {

						if (!error && response.statusCode == 200) {
							//did we get a hit?
							if (body.search('<response code="2"')>-1) foundSomething = true
							results.push(body)
						}else{
							if (debug) console.log("Request ERROR:",response.statusCode,error)
						}

						callback()

					})



				}, function(error){


					//if we did not find something after all of that then try the title and author
					if (!foundSomething){


						if (activeRecord.title && activeRecord.author){
							var url = urlTitleAuthor.replace('{title}',encodeURIComponent(activeRecord.title)).replace('{author}',encodeURIComponent(activeRecord.author))
						}else{
							var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
						}

						if (debug) console.log(url)


						request({ encoding: "utf8",  uri: url}, function (error, response, body) {

							if (!error && response.statusCode == 200) {
								//did we get a hit?
								if (body.search('<response code="2"')>-1) foundSomething = true

								results.push(body)
							}else{
								if (debug) console.log("Request ERROR:",response.statusCode,error)
							}

							//did we find nothing, try just the title
							if (activeRecord.author && foundSomething == false){

								var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
								request({ encoding: "utf8",  uri: url}, function (error, response, body) {

									if (!error && response.statusCode == 200) {
										//did we get a hit?
										if (body.search('<response code="2"')>-1) foundSomething = true

										results.push(body)
									}else{
										if (debug) console.log("Request ERROR:",response.statusCode,error)
									}

									finished = true

								})



							}else{
								finished = true
							}



						})



					}else{

						finished = true

					}

				})







			}else{

				//okay just do a title/author lookup

				if (activeRecord.title && activeRecord.author){
					var url = urlTitleAuthor.replace('{title}',encodeURIComponent(activeRecord.title)).replace('{author}',encodeURIComponent(activeRecord.author))
				}else{
					var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
				}

				if (debug) console.log(url)
				request({ encoding: "utf8",  uri: url}, function (error, response, body) {

					if (!error && response.statusCode == 200) {
						//did we get a hit?
						if (body.search('<response code="2"')>-1) foundSomething = true

						results.push(body)
					}else{
						if (debug) console.log("Request ERROR:",response.statusCode,error)
					}

					//did we find nothing, try just the title
					if (activeRecord.author && foundSomething == false){

						var url = urlTitle.replace('{title}',encodeURIComponent(activeRecord.title) )
						request({ encoding: "utf8",  uri: url}, function (error, response, body) {

							if (!error && response.statusCode == 200) {
								//did we get a hit?
								if (body.search('<response code="2"')>-1) foundSomething = true

								results.push(body)
							}else{
								if (debug) console.log("Request ERROR:",response.statusCode,error)
							}

							finished = true

						})



					}else{
						finished = true
					}



				})



			}


		}


	});


	setInterval(function(){

		if (activeRecord){

			//if (debug) console.log(cluster.worker.id, "Asking for work")
			//if (debug) console.log(cluster.worker.id, "Working:",activeRecord.bnumber)
			if (debug) console.log("finished:",finished,"resultsLength:",results.length)

			if (finished){

				//we want to write our results out to the file system and get the next work

				activeRecord.foundSomething = foundSomething
				activeRecord.resultsLength = results.length
				activeRecord.results = results

				//write
				var tmp = fs.createWriteStream(pathToCatalogClassifyResults + activeRecord.bnumber + '.json',{'flags': 'w'})
				tmp.end(JSON.stringify(activeRecord))

				tmp.on("finish",function(){

					process.send({ req: {complete: activeRecord, id: cluster.worker.id} });
					activeRecord = false
					if (debug) console.log("WROTE")

				})







			}


		}

	},Math.floor(Math.random() * (2000 - 500)))

}