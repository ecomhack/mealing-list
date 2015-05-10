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
    }


};

