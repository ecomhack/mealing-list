// megacrawler.js
// (c) 2015 by Milan Gruner

var DELAY = 500;
var CRAWL_BEGIN = 183;
var CRAWL_END = 300;
//var URL = "https://api.foodpairing.com/ingredients/";
var URL = "https://api.foodpairing.com/generators/elements/%1/ingredients/0/pairings?include=ingredient&limit=75";

var current_index = 1;

function getFoodData(url, callback) {
	jQuery.ajax({ 
		headers : {
			"X-Application-ID": "ec05d5d3",
			"X-Application-Key": "55c949b646227173b8f99df6cbae8e08"
		},
		url: url,
		type: "GET",
		dataType: "JSON", 
		data: {},
		success: function(data) {
			callback(data);
		},
	});
}

function saveEntry(data) {
	document.write(data.id+","+data.product+"\n");
}

function saveAll(data) {
	data.forEach(function(entry) {
		document.write(entry._links.ingredient.id + "," + entry._links.ingredient.product + "\n");
	});
}

function fuckingCrawl() {
	/*for(var i = CRAWL_BEGIN; i < CRAWL_END; i++) {
		current_index = i;
		//setTimeout(function() {
			getFoodData(URL + current_index, saveEntry);
		//}, DELAY);
	}*/
	for(var category = 376; category <= 382; category++) {
		getFoodData(URL.replace("%1", category), saveAll);
	}
}

$(fuckingCrawl);
