// main.js
// (c) 2015 by Milan Gruner

// settings
var MAX_SUGGESTIONS = 10;
var CATEGORY_SAMPLES = 3;
var MIN_SCORE = 0.3;

// FoodPairing API Data
var ingredients = [3999, 140, 4853, 5155, 1337, 548, 18];
var categories = [376, 377, 378, 379, 380, 381, 382];

var urls = {
	ingredient: "https://api.foodpairing.com/ingredients/%1",
	matches: "https://api.foodpairing.com/generators/elements/%1/ingredients/%2/pairings?include=ingredient,ingredient%5Bimage%5D",
	pairings: "https://api.foodpairing.com/generators/targets/%1/elements/%2/ingredients/%3/pairings"
};

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
			console.log(data);
			callback(data);
		},
		xhrField: {
			withCredentials: false
		}
	});
}

function loadMatches(element, ingredient, count) {
	if(count != null)
		var limiter = "&limit="+count;
	else
		var limiter = "";

	getFoodData(urls.matches.replace("%1", element).replace("%2", ingredient)+limiter, addMatches);
}

function addMatches(data) {
	$.each(data, function(index, elem) {
		var rel = elem.matches.all.rel;
		console.log(rel, elem._links.ingredient.name);

		//if(rel < 0.5) return;

		usedIngredients.unshift(elem._links.ingredient.id);
		scores.push({
			id: elem._links.ingredient.id,
			ingredient: elem._links.ingredient,
			score: rel
		});
		
		//addIngredient(elem._links.ingredient);
	});

	categoryCounter++;

	// when we have all the data, make sense of it
	if(categoryCounter == categories.length) {
		scores.sort(function(x, y) {
			return x.score - y.score;
		});

		scores.reverse();
		console.log(scores);

		var suggestions = 0;

		scores.forEach(function(score) {
			if(suggestions < MAX_SUGGESTIONS && score.score >= MIN_SCORE) {
				addIngredient(score.ingredient);
				suggestions++;
			}
		});
	}
}

function loadIngredients() {
	for(var i = ingredients.length - 1; i >= 0; i--) {
		getFoodData(urls.ingredient.replace("%1", ingredients[i]), addIngredient);
	}
}

function loadIngredient(ingredient) {
	getFoodData(urls.ingredient.replace("%1", ingredient), addIngredient);
}

function addIngredient(data) {
	if(data._links.image.src != undefined)
		var img = '<img src="'+data._links.image.src+'" alt="No preview image!" />';
	else
		var img = '';

	if(data.description != undefined && data.description != "")
		var desc = '<p><em>Description:</em> <strong><span id="description">'+data.description+'</span></strong></p></li>';
	else
		var desc = '';

	var html = '<li><h3><span id="ingredient">'+data.product+'</span></h3>'+ img + desc;
	
	//'<p><em>Amount:</em> <strong><span id="amount">'+data.amount+'</span></strong></p>'+	

	$('#dishes ul').append(html);

	//$('#ingredients').listview("refresh");
}

function main() {
	//loadIngredients();
	//loadMatches(377, 4824);
	//loadMatches(378, "5155");
	//loadIngredient(5155);

	var usedIngredients = [3999];
	var scores = [];
	var categoryCounter = 0; // keep track of the async ajax events

	categories.forEach(function(cat) {
		loadMatches(cat, usedIngredients.join(), CATEGORY_SAMPLES);
	});
}

$(main);