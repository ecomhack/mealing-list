/**
 * DishController
 *
 * @description :: Server-side logic for managing Dishes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

module.exports = {

	getForEventDeep: function(req, res) {
		var event = req.param('event');
		if (!event)
			return res.badRequest();

		Dish.find({ event: event }).populateAll().exec(function(err, dishes) {
			var idsToGrab = [];
			var waitingEntities = [];
			dishes.forEach(function(dish) {
				if (!dish.ingredients)
					return;

				dish.ingredients.forEach(function(ing) {
					if (ing.providedBy && ing.providedBy != '0') {
						idsToGrab.push(ing.providedBy);
						waitingEntities.push(ing);
					}
				});
			});

			idsToGrab = _.uniq(idsToGrab);

			Participant.find({ id: idsToGrab }).exec(function(err, parts) {
				if (err)
					return res.negotiate(err);

				var map = {};
				parts.forEach(function(entry) {
					map[entry.id] = entry;
				});

				waitingEntities.forEach(function(entry) {
					entry.providedBy = map[entry.providedBy];
				});

				if (req.isSocket) {
					Dish.watch(req);
					Dish.subscribe(req.socket, dishes);
				}

				res.send(dishes);
			});
		});
	}

};

