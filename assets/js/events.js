// event.js

$(function() {
	$('#ingredients input[data-type="search"]').on('keydown', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			$(this).scope().createIngredient($(this).text());
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
						});
				});
				$ul.listview("refresh");
				$ul.trigger("updatelayout");
			});
		}
	})
})