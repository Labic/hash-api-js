module.exports = function(Tweet) {

  Tweet.remoteMethod('analytics', {
    accepts: [
      { arg: 'type', type: 'string', required: true },
      { arg: 'filter', type: 'object', http: { source: 'query' }, required: true }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/analytics', verb: 'get' }
  });

  Tweet.analytics = function(type, filter, callback) {
    Tweet.analytics.mongodb(type, filter, callback);
  }

};