// SphereController.js

var SphereClient = require('sphere-node-sdk').SphereClient;

var Config = {
  client_id: process.env.SPHERE_CLIENT || '',
  client_secret: process.env.SPHERE_SECRET || '',
  project_key: process.env.SPHERE_PROJECT || ''
};

module.exports = {
	getProduct: function(req, res) {
		//var product = req.param('product');
		var product = "Rice";

		// init SphereIO connection
		var client = new SphereClient(Config);

		var service = client.productProjections;
		service.where('name(en = "'+product+'")').staged(true).fetch()
		.then(function(result) {
		    res.send(result);
		    console.log(result);
		});
	}
};