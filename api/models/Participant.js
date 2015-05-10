/**
* Participant.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var md5 = require('MD5');

module.exports = {

  attributes: {

    name: 'string',
    email: 'string',
    emailHash: 'string',

    events: {
      collection: 'event',
      via: 'participants'
    }

  },

  beforeCreate: function(values, cb) {
    values.emailHash = md5(values.email);
    cb();
  }

};

