// event.js

// SETTINGS
var MAX_PROPOSALS = 10;
var INGR_ID = 4824;

$(function() {
	var searchInput = ($('input[data-type="search"]'));
	$('input[data-type="search"]').on('keydown', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		console.log('AAAA', $(this).val(), code);
		if(code == 13) {
			$(this).scope().createIngredient($(this).val());
			$(this).val('');
		}
	});

	$('#ingredients').on("filterablebeforefilter", function(e, data) {
		var $ul = $(this),
			$input = $(data.input),
			value = $input.val(),
			html = "";
		$ul.html("");

		if(value && value.length > 2) {
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				url: "/propose",
				dataType: "json",
				data: {
					q: $input.val()
				}
			}).then( function ( response ) {
				$.each(response, function ( i, val ) {
					var li = $('<li><a>' + val.html + '</a></li>')
						.appendTo($ul)
						.click(function() {
							$(this).scope().createIngredient(val.text);
							searchInput.val('');
						});
				});
				$ul.listview("refresh");
				$ul.trigger("updatelayout");
			});

			// add some proposals to the list
			var proposals = $('#proposals');
			proposals.html('<li data-role="list-divider">You might also like:</li>');
			
			$.ajax({
				url: "/proposals",
				dataType: "json",
				data: {
					used: INGR_ID
				}
			}).then( function ( response ) {
				$.each(response, function ( i, val ) {
					if(i >= MAX_PROPOSALS) return;

					var li = $('<li><a href="#"><img src="'+val.image+'">'+val.title+'</a></li>')
						.appendTo(proposals)
						.click(function() {
							$(this).scope().createIngredient(val.title);
						});
				});
				proposals.listview("refresh");
				proposals.trigger("updatelayout");
			});
		}
	})
})
