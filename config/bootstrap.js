/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var fs = require('fs');

module.exports.bootstrap = function(cb) {

  // init gateway
  BtGateway.getGateway();

  ProposalIndex.buildIndex(function(err) {
    if (err)
      console.log(err);

    cb();
  });

  return;

  var file = fs.readFileSync(__dirname + '/../WebApp/js/food.csv') + '';
  var lines = file.split('\n');

  var due = lines.length + 1;

  lines.forEach(function(line) {
    var parts = line.split(',');
    Proposal.create({
      foreignId: parts[0],
      title: parts[1]
    }).exec(function(err) {
      if (err)
        console.log(err);

      if (--due <= 0)
        return cb();
    });
  });
};
