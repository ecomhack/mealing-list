/**
 * ParticipantController
 *
 * @description :: Server-side logic for managing Participants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var TWITTER_CONSUMER_KEY = '8kY86pflTIZOBuKEUGimvtfFB';
var TWITTER_CONSUMER_SECRET = 'wjWZn5xILs4EQzObBWz7eM50LIP7qQCoZibRljQ7x2X6kgnVl5';

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://cloud.tombeckmann.de/auth/twitter/callback"
}, function(token, tokenSecret, profile, done) {
  if (err)
    return done(err); 

  done(null, profile);
  console.log(profile);
}));

module.exports = {

  createTwitter: passport.authenticate('twitter'),
  twitterCallback: passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),

};

