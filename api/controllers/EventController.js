/**
 * EventController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    view: function(req, res) {
      var id = req.param('id');

      res.view('event', {
        eventId: id
      });
    },

    pay: function(req, res) {
      var id = req.param('id');

      res.view('pay', {
        eventId: id
      });
    },

    outstanding: function(req, res) {
        var event = req.param('id');
        Dish.find({ event: event }).populate('ingredients').exec(function(err, result) {
            if (err)
                return res.negotiate(err);

            var all = result.reduce(function(prev, cur) {
                return prev.concat(cur.ingredients.filter(function(i) {
                    return !i.providedBy || i.providedBy == '0';
                }));
            }, []);
            res.send(all);
        });
    }

};

