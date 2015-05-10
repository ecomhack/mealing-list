// megacrawler.js
// (c) 2015 by Milan Gruner

var CRAWL_BEGIN = 73;
var CRAWL_END = 74;
var URL = "https://api.foodpairing.com/ingredients/";

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

function fuckingCrawl() {
	for(var i = CRAWL_BEGIN; i < CRAWL_END; i++) {
		getFoodData(URL+i, saveEntry);
	}
}

$(fuckingCrawl);
