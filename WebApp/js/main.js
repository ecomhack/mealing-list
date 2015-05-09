// main.js
// (c) 2015 by Milan Gruner

var ingredients = [3999, 140, 4853, 5155, 1337, 548, 18];

function getFoodData(ingredient) {
	 jQuery.ajax({ 
		headers : {
			"X-Application-ID": "ec05d5d3",
			"X-Application-Key": "55c949b646227173b8f99df6cbae8e08"
		},
		url: "https://api.foodpairing.com/ingredients/"+ingredient,
		type: "GET",
		dataType: "JSON", 
		data: {},
		success: function(data) {
			console.log(data);
			addIngredient(data);
		},
		xhrField: {
			withCredentials: false
		}
	});
}

function addIngredient(data) {
	var img = '<img src="'+data._links.image.src+'" alt="No preview image!" />'+

	var html = 
		'<li><h3><span id="ingredient">'+data.product+'</span></h3>'+ img +
		//'<p><em>Amount:</em> <strong><span id="amount">'+data.amount+'</span></strong></p>'+
		'<p><em>Description:</em> <strong><span id="description">'+data.description+'</span></strong></p></li>';

	$('#dishes ul').append(html);
}

function loadIngredients() {
	for(var i = ingredients.length - 1; i >= 0; i--) {
		getFoodData(ingredients[i]);
	}

	$('#ingredients').listview("refresh");
}

function main() {
	/*$.each(ingredients, function(index, ingredient) {
		getFoodData(ingredient);
	});*/

	loadIngredients();
}

$(main);