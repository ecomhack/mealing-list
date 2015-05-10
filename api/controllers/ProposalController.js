var request = require('request');

var MAX_SUGGESTIONS = 10;
var CATEGORY_SAMPLES = 3;
var MIN_SCORE = 0.3;

var ingredients = [3999, 140, 4853, 5155, 1337, 548, 18];
var categories = [376, 377, 378, 379, 380, 381, 382];

var urls = {
  ingredient: "https://api.foodpairing.com/ingredients/%1",
  matches: "https://api.foodpairing.com/generators/elements/%1/ingredients/%2/pairings?include=ingredient,ingredient%5Bimage%5D",
  pairings: "https://api.foodpairing.com/generators/targets/%1/elements/%2/ingredients/%3/pairings"
};

function loadMatches(element, ingredient, count, cb) {
  if(count != null)
    var limiter = "&limit="+count;
  else
    var limiter = "";

  var url = urls.matches
    .replace("%1", element)
    .replace("%2", ingredient) + limiter;

  getFoodData(url, cb);
}

function getFoodData(url, cb) {
  request({
    url: url,
    headers : {
      "X-Application-ID": "ec05d5d3",
      "X-Application-Key": "55c949b646227173b8f99df6cbae8e08"
    }
  }, function(err, res, body) {
    var data;

    if (err || res.statusCode >= 300)
      return cb(err);

    try {
      data = JSON.parse(body);
    } catch (e) {
      return cb(e);
    }

    var list = [];
    data.forEach(function(entry) {
      var rel = entry.matches.all.rel;

      list.push({
        id: entry._links.ingredient.id,
        image: entry._links.ingredient._links.image.size_240,
        title: entry._links.ingredient.product,
        score: rel
      });
    });

    cb(null, list);
  });
}


module.exports = {
  getProposals: function(req, res) {
    var done = 0;
    var all = [];

    // used must have comma separated list.
    var usedIngredients = req.param('used');

    categories.forEach(function(cat) {
      loadMatches(cat, usedIngredients, CATEGORY_SAMPLES, function(err, data) {
        all = all.concat(data);

        if (++done == categories.length) {
          all.sort(function(a, b) {
            return b.score - a.score;
          });

          return res.send(all);
        }
      });
    });
  },

  propose: function(req, res) {
    ProposalIndex.queryIndex(req.param('q'), function(err, data) {
      if (err)
        return res.negotiate(err);

      console.log(data);
      return res.send(data);
    })
  }
};

