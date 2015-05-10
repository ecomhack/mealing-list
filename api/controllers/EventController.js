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
        Event.getOutStanding(event, function(err, list) {
            if (err)
                return res.negotiate(err);

            return res.send(list);
        });
    }

};

