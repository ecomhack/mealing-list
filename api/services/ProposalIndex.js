var _ = require('lodash');
var async = require('async');
var algoliasearch = require('algoliasearch');

var client = algoliasearch("ZF5BFPYBEC", "17e0330e09b1e6cc30a1044e9c298c69");
var index = client.initIndex('foodIndex');
index.setSettings({
	attributesToIndex: ['title']
});

module.exports = {
	queryIndex: function(query, cb) {
		index.search(query, function(err, content) {
			if (err)
				return cb(err);

			cb(null, content);
		});
	},
	buildIndex: function buildIndex(cb) {
		Proposal.find().exec(function(err, results) {
			if (err)
				return cb(err);

			results = results.map(function(result) {
				result.objectID = result.id;
				return result;
			});

			var chunkedResults = _.chunk(results, 5000);

			async.each(chunkedResults, index.saveObjects.bind(index), function(err) {
				if (err)
					return cb(err);

				cb();
			});
		});
	},
};
