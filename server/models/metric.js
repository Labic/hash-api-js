module.exports = function(Metric) {

  Metric.remoteMethod('tweetsMetrics', {
    accepts: [
      { arg: 'name', type: 'String', required: true },
      { arg: 'since', type: 'Date', required: true },
      { arg: 'until', type: 'Date', required: true },
      { arg: 'tags', type: 'String' }, // Categories alias
      { arg: 'hashtags', type: 'String' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/tweets/:name', verb: 'get'}
  });

  Metric.tweetsMetrics = function(name, since, until, tags, hashtags, cb) {
    tweetsMetricsMethods[name](since, until, tags, hashtags, cb);
  }

  var tweetsMetricsMethods = {};
  
  tweetsMetricsMethods['count'] = function (since, until, tags, hashtags, cb) { 
    if (isNaN(since.getTime()) || isNaN(until.getTime())) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.statusCode = 400;

      return cb(err);
    }

    var query = {
      'status.timestamp_ms': {
        $gte: since.getTime(),
        $lte: until.getTime()
      }
    };

    if (tags)
      query.categories = { $all: tags.split(',') };
      // query.categories = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      query['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/count \n %j', query);

    var Tweet = Metric.app.models.Tweet;
    return Tweet.mongodb.count(query, function(err, result) {
      if (err) 
        return cb(err, null);
      else 
        return cb(err, result);
    });
  };

  tweetsMetricsMethods['count_images'] = function (since, until, tags, hashtags, cb) { 
    if (isNaN(since.getTime()) || isNaN(until.getTime())) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.statusCode = 400;

      return cb(err);
    }

    var pipeline = [
      { $match: {
        'status.entities.media.0': { $exists: true },
        'status.timestamp_ms': {
          $gte: since.getTime(),
          $lte: until.getTime()
        }
      } },
      { $group: {
        _id: 0,
        count: { $sum: 1 }
      } },
      { $project: {
        _id: 0,
        count: '$count'
      } }
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/count_images \n %j', pipeline);

    var Tweet = Metric.app.models.Tweet;
    return Tweet.aggregate(pipeline, function(err, result) {
      console.log(result);

      if (err) 
        return cb(err, null);
      else 
        return cb(null, result[0]);
    });
  }

  tweetsMetricsMethods['geolocation'] = function (since, until, tags, hashtags, cb) { 
    if (isNaN(since.getTime()) || isNaN(until.getTime())) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.statusCode = 400;

      return cb(err);
    }

    var pipeline = [
      { $match: {
        $or: [ { 'status.geo': { $ne: null } }, 
               { 'city_geo': { $exists: true } } ],
        'status.timestamp_ms': {
          $gte: since.getTime(),
          $lte: until.getTime()
        }
      } }, 
      { $group: {
        _id: 0,
        features: { $push: { 
          type: {  $literal: 'Feature' },
          properties: {
            id_str: '$status.id_str',
          },
          geometry: {
            type: {  $literal: 'Point' }, 
            coordinates: { $cond: [ { $ne: [ '$status.geo', null ] }, '$status.geo.coordinates', '$city_geo' ] }
          }
        } }
      } },
      { $project: {
        _id: 0,
        type: {  $literal: 'FeatureCollection' },
        features: '$features'
      } }
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/geolocation \n %j', pipeline);

    var Tweet = Metric.app.models.Tweet;
    return Tweet.aggregate(pipeline, function(err, result) {
      console.log(result);

      if (err) 
        return cb(err, null);
      else 
        return cb(null, result[0]);
    });
  }

};