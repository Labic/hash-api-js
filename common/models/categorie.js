var _ = require('underscore');

module.exports = function(Categorie) {

  Categorie.dictionary = function(filter, callback) {
    filter = filter || {};
    filter.fields = {
      name: true,
      slug: true
    };

    Categorie.find(filter, function(err, instances) {
      callback(err, instances);
    });
  }

  Categorie.remoteMethod('dictionary', {
    accepts: [
      { arg: 'filter', type: 'object', http: { source: 'query' } }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/dictionary', verb: 'get' }
  });
};