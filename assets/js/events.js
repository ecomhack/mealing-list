// event.js

$(function() {
	console.log($('input[data-type="search"]'));
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
							console.log(val.text);
							$(this).scope().createIngredient(val.text);
						});
				});
				$ul.listview("refresh");
				$ul.trigger("updatelayout");
			});
		}
	})
})
