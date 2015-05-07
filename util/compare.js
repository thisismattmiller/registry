
var	utils = require("../util/utils"),
	string_score = require("string_score")



var exports = module.exports = {}

//some words that are not nessisary to the title but can cause problems in comparison
var removeFromTitles = [
	
	//"Series A "
	new RegExp("Series\\s[A-Z]", 'g')




]


exports.removePunctAndKeyWords = function(s){

	if (!s) s = ""

	//take out punctuation and extra whitespace
	s = s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g," ").replace(/\s+/g, " ").trim()

	for (var x in removeFromTitles){
		s = s.replace(removeFromTitles[x],'').trim()
	}
	return s
}




//compare words in two titles instead of the whole string
exports.compareByWords = function(a,b,fuzzy){

	if (!fuzzy) var fuzzy = false

	if (!a || !b) return false

	//normalize the strings and lower them
	a = exports.removePunctAndKeyWords(a).toLowerCase()
	b = exports.removePunctAndKeyWords(b).toLowerCase()

	//split by word
	aSplit = a.split(" ")
	bSplit = b.split(" ")

	var compare = function(longer,shorter){

		var totalMatch = 0
		var totalWords = shorter.length


		//loop through an see if each word occurs within the the longer
		if (fuzzy){

			for (var shorterX in shorter){				
				for (var longerX in longer){
					if (longer[longerX].score(shorter[shorterX]) >= 0.75) totalMatch++
				}
			}
		}else{
			for (var shorterX in shorter){
				//check to see if it occurs within the longer string
				if (longer.indexOf(shorter[shorterX]) >-1) totalMatch++
			}
		}


		//console.log(longer.join(" "))
		//console.log(shorter.join(" "))
		//console.log("totalWords:",totalWords,"totalMatch:",totalMatch, totalMatch/totalWords*100)

		//more than XX% of the words matched?
		if (totalMatch/totalWords*100 > 50){
			return true
		}else{
			return false
		}

	}

	//we want to remove any short words.
	var tmp = []
	for (var x in aSplit){
		if (aSplit[x].length >= 4) tmp.push(aSplit[x])
	}
	aSplit = tmp

	var tmp = []
	for (var x in bSplit){
		if (bSplit[x].length >= 4) tmp.push(bSplit[x])
	}
	bSplit = tmp


	if (aSplit.length>bSplit.length){
		var r = compare(aSplit,bSplit)
	}else{
		var r = compare(bSplit,aSplit)
	}


	return r

}


//simple string comparison on two "dates" passed in an array
exports.compareDateArray = function(a,b){

	//if they are both empty arrays then that is a match
	if (a.length == 0 && b.length == 0) return true

	var matched = false

	for (var aX in a){

		for (var bX in b){

			if ( exports.removePunctAndKeyWords(a[aX].toString()) == exports.removePunctAndKeyWords(b[bX].toString()) ) matched = true


		}
	}


	return matched
}




//passes two strings will find the similarity and return float if fuzzy then use that 0.0-1
//take out extra whitespace, punctuation 
exports.compareNormalizedTitles = function(a,b,fuzzy){
	if (!a || !b) return false

	a = exports.removePunctAndKeyWords(a)
	b = exports.removePunctAndKeyWords(b)

	if (a.toString().length >= b.toString().length){
		if (fuzzy){
			return a.toString().score(b,fuzzy)
		}else{
			return a.toString().score(b)
		}
	}else{
		if (fuzzy){
			return b.toString().score(a,fuzzy)
		}else{
			return b.toString().score(a)
		}
	}
}

//passes two strings will find the similarity and return float if fuzzy then use that 0.0-1
exports.compareTitles = function(a,b,fuzzy){
	if (!a || !b) return false

	if (a.toString().length >= b.toString().length){
		if (fuzzy){
			return a.toString().score(b,fuzzy)
		}else{
			return a.toString().score(b)
		}
	}else{
		if (fuzzy){
			return b.toString().score(a,fuzzy)
		}else{
			return b.toString().score(a)
		}
	}
}

//this function assumes it is being passed two objects that have the same keys to check for matching identifiers 
exports.compareIdentifiersExact = function(source, target,normalize){


	if (typeof source != 'object' || typeof target != 'object')	return false

	if (typeof normalize == 'undefined') var normalize = true


	var result ={

		match: false,
		matchOn: [],
		confidence: 1 

	}


	for (var sourceKey in source){
		for (var targetKey in target){
			if (sourceKey == targetKey && (sourceKey!='title')){


				var sourceVal = source[sourceKey]
				var targetVal = target[targetKey]


				//normalize the value 
				if (normalize){
					sourceVal = utils.normalize(source[sourceKey])
					targetVal = utils.normalize(target[targetKey])
				}



				//if one of the values came back false skip this attribute "b1234567890" != false
				if (!sourceVal) continue
				if (!targetVal) continue

				if (sourceVal == targetVal){

					result.match = true
					result.matchOn.push(sourceKey)
					result.confidence = 1
				}
			}
		}
	}



	//some double checking
	if (result.matchOn.length == 1){

		//if we only matched on call number it is a dubious match 
		if (result.matchOn[0] == 'callNumber'){



			//if they are mms col numbers then they are okay to exact match on
			if (source['callNumber'].toLowerCase().search("mss") > -1 && target['callNumber'].toLowerCase().search("mss") > -1){

				result.match = true

			}else{

				if (source['bNumber'] && target['bNumber']){

					//if they also both have bnumbers and they do not match then that is not a match, 
					//it is likely that they are a shelf locator or something
					if ( utils.normalize(source['bNumber']) != utils.normalize(target['bNumber']) ){
						result.match = false	
						result.matchOn = []	
					}
				}else if ( source['title'] && target['title']  ){


					//no title no comparison don't want to things like Untitled
					if (source['title'].length < 9 || target['title'].length < 9){
						result.match = false	
					}else{


						//see if the titles are the same or similar
						
						if (source['title'].length == target['title'].length ){
							var titleLong  = source['title']
							var titleShort = target['title']
						}else if (source['title'].length > target['title'].length ){
							var titleLong  = source['title']
							var titleShort = target['title']
						}else{
							var titleLong  = target['title']
							var titleShort = source['title']	
						}

						if ( utils.normalize(titleLong) == utils.normalize(titleShort) ){
							result.confidence = 1
						}else if ( titleLong.score(titleShort) >= 0.75) {
							result.confidence = 1
						}else{
							result.match = false
						}
					}

				}else{



					//they don't both have b numbers so it becomes more suspect TODO
					result.match = false
					result.confidence = 0.25

				}

			}


		}


	}



	return result


}
