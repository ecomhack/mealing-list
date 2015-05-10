// SphereController.js

var SphereClient = require('sphere-node-sdk').SphereClient;
var util = require('util');

var Config = {
	config: {
		client_id: process.env.SPHERE_CLIENT || 'hyWZkA729LJY-QFwug0IpVej',
		client_secret: process.env.SPHERE_SECRET || 'YMEATGctVjEvpFFrc6JxOkDRsgmZeU2O',
		project_key: process.env.SPHERE_PROJECT || 'ecomhack-demo-45'
	}
};

module.exports = {
	buildCart: function(req, res) {
		var event = req.param('event');

		console.log(Config);
		var client = new SphereClient(Config);
		var service = client.productProjections;

		Event.getOutStanding(event, function(err, list) {
			if (err)
				return res.negotiate(err);

			var due = list.length - 1;

			list.forEach(function(product) {
				console.log(product);

				service.where('name(en = "' + product + '")').staged(true).fetch()
					.then(function(result) {
						console.log('GOT SOMETHIN')
						console.log(result, { showHidden: true, depth: null });

						if (--due <= 0)
							return res.send();
					});
			});
		});
	}
};
