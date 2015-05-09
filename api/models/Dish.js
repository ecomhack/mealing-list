/**
* Dish.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title: 'string',

    creator: {
      model: 'participant'
    },

    locked: 'bool',

    ingredients: {
      collection: 'ingredient',
      via: 'dish'
    },

    event: {
      model: 'event'
    }

  }

};

