/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title: 'string',

    date: 'datetime',

    location: 'string',

    shortlink: 'string',

    dishes: {
      collection: 'dish',
      via: 'event'
    },

    participants: {
      collection: 'participant',
      via: 'events'
    }

  },

  getOutStanding: function getOutStanding(event, cb) {
    Dish.find({ event: event }).populate('ingredients').exec(function(err, result) {
      if (err)
        return cb(err);

      var all = result.reduce(function(prev, cur) {
        return prev.concat(cur.ingredients.filter(function(i) {
          return !i.providedBy || i.providedBy == '0';
        }));
      }, []);
      cb(null, all);
    });
  }

};

