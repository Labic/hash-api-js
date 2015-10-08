module.exports = function(Tweet) {

  Tweet.remoteMethod('analytics', {
    accepts: [
      {arg: 'type', type: 'string', required: true },
      {arg: 'filter', type: 'object', http: { source: 'query' }, required: true}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/analytics', verb: 'get'}
  });

  Tweet.remoteMethod('metrics', {
    accepts: [
      {arg: 'name', type: 'string', required: true },
      {arg: 'since', type: 'string', required: true },
      {arg: 'until', type: 'string', required: true },
      {arg: 'tags', type: 'string' }, // Categories alias
      {arg: 'hashtags', type: 'string' }
    ],
    returns: {type: 'object', root: true},
    http: {path: '/metrics', verb: 'get'}
  });

  Tweet.analytics = function(type, filter, callback) {
    Tweet.analytics.mongodb(type, filter, callback);
  }

  Tweet.metrics = function(name, since, until, tags, hashtags, cb) {
    var query = {
      'status.timestamp_ms': {
        $gte: new Date(since).getTime(),
        $lte: new Date(until).getTime()
      }
    }

    if (tags)
      query.categories = { $all: tags.split(',') };
      //query.categories = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      query['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };
    
    if (query.$gte == null || query.$lte == null) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.statusCode = 400;

      return cb(err);
    }

    console.log('metric?name=count \n %j', query);

    return Tweet.mongodb.count(query, function(err, result) {
      console.log(result);
      result = {
        count: result
      };

      cb(err, result)
    });
  }

};