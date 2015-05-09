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

  }

};

