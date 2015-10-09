module.exports = function(Metric) {

  Metric.remoteMethod('twitterTweetsMetrics', {
    accepts: [
      { arg: 'name', type: 'String', required: true },
      { arg: 'since', type: 'Date', required: true },
      { arg: 'until', type: 'Date', required: true },
      { arg: 'tags', type: 'String' }, // Categories alias
      { arg: 'hashtags', type: 'String' },
      { arg: 'page', type: 'Number' },
      { arg: 'per_page', type: 'Number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/twitter/tweets/:name', verb: 'get' }
  });

  Metric.twitterTweetsMetrics = function(name, since, until, tags, hashtags, page, perPage, cb) {
    if (isNaN(since.getTime()) || isNaN(until.getTime())) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.statusCode = 400;

      return cb(err);
    }

    if (!page) page = 1;
    if (!perPage) perPage = 25;

    var Tweets = Metric.app.models.Tweet;
    twitterTweetsMetricsMethods[name](since, until, tags, hashtags, page, perPage, Tweets, cb);
  }

  var twitterTweetsMetricsMethods = {};
  
  twitterTweetsMetricsMethods['count'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) {
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

    return Tweets.mongodb.count(query, function(err, result) {
      if (err) 
        return cb(err, null);
      else 
        return cb(err, { count: result } );
    });
  };

  twitterTweetsMetricsMethods['count_images'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var query = {
      'status.entities.media.0': { $exists: true },
      'status.timestamp_ms': {
        $gte: since.getTime(),
        $lte: until.getTime()
      }
    };

    if (tags)
      query['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      query['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/count_images \n %j', query);

    return Tweets.mongodb.count(query, function(err, result) {
      if (err) 
        return cb(err, null);
      else 
        return cb(null, { count: result });
    });
  }

  twitterTweetsMetricsMethods['count_retweets'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var pipeline = [
      { $match: { 
        'status.retweeted_status': { $exists: true},
        'status.timestamp_ms': {
          $gte: since.getTime(),
          $lte: until.getTime()
        }
      } }, 
      { $group: { 
          _id: '$status.retweeted_status.id_str', 
          retweets_count: { $sum: 1 } 
      } }, 
      { $group : { 
          _id : '$retweets_count',
          count: { $sum: 1 } 
      } }, 
      { $project: { 
          _id: 0, 
          retweets_count:'$_id', 
          count: '$count' 
      } }, 
      { $sort: { retweets_count: -1 } }, 
      { $limit: perPage * page }, 
      { $skip : (perPage * page) - perPage } 
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/count_retweets \n %j', pipeline);

    return Tweets.aggregate(pipeline, cb);
  }

  twitterTweetsMetricsMethods['top_retweets'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var pipeline = [
      { $match: { 
        'status.retweeted_status': { $exists: true},
        'status.timestamp_ms': {
          $gte: since.getTime(),
          $lte: until.getTime()
        }
      } },
      { $group: {
        _id: '$status.retweeted_status.id_str',
        status: { $last: '$status' },
        count: { $sum: 1 }
      } },
      { $sort: { count: -1 } },
      { $project: {
        _id: 0,
        status: '$status',
        count: '$count'
      } }, 
      { $limit: perPage * page }, 
      { $skip : (perPage * page) - perPage } 
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/top_retweets \n %j', pipeline);

    return Tweets.aggregate(pipeline, cb);
  }

  twitterTweetsMetricsMethods['top_mentions'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var pipeline = [
      { $match: { 
        'status.entities.user_mentions.0': { $exists: true }, 
        'status.timestamp_ms': { 
          $gte: since.getTime(), 
          $lte: until.getTime() 
        } 
      } }, 
      { $unwind: '$status.entities.user_mentions' }, 
      { $group: {
        _id: '$status.entities.user_mentions.screen_name', 
        count: { $sum: 1 }
      } }, 
      { $sort: { count: -1 } }, 
      { $project: { 
        _id: 0, 
        screen_name: '$_id', 
        count: '$count' 
      } }, 
      { $limit: perPage * page }, 
      { $skip : (perPage * page) - perPage } 
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/top_mentions \n %j', pipeline);

    return Tweets.aggregate(pipeline, cb);
  }

  twitterTweetsMetricsMethods['top_urls'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var pipeline = [
      { $match: { 
        'status.entities.urls.0': { $exists: true }, 
        'status.timestamp_ms': { 
          $gte: since.getTime(), 
          $lte: until.getTime() 
        } 
      } }, 
      { $unwind: '$status.entities.urls' }, 
      { $group: { 
        _id: '$status.entities.urls.expanded_url', 
        count: { $sum: 1 }
      } }, 
      { $sort: { count: -1 } }, 
      { $project: { 
        _id: 0, 
        url: '$_id', 
        count: '$count' 
      } }, 
      { $limit: perPage * page }, 
      { $skip : (perPage * page) - perPage } 
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/top_urls \n %j', pipeline);

    return Tweets.aggregate(pipeline, cb);
  }

  twitterTweetsMetricsMethods['top_images'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var pipeline = [
      { $match: { 
        'status.entities.media.0': { $exists: true }, 
        'status.timestamp_ms': { 
          $gte: since.getTime(), 
          $lte: until.getTime() 
        } 
      } }, 
      { $unwind: '$status.entities.media' }, 
      { $group: { 
        _id: '$status.entities.media.media_url_https', 
        status_text: { $last: '$status.text' }, 
        user_id_str: { $last: '$status.user.id_str' }, 
        user_screen_name: { $last: '$status.user.screen_name' }, 
        user_profile_image_url_https: { $last: '$status.user.profile_image_url_https' }, 
        count: { $sum: 1 } 
      } }, 
      { $sort: { count: -1 } }, 
      { $project: { 
        _id: 0, 
        entities: { media: { media_url_https: '$_id' } }, 
        text: '$status_text', 
        user: { 
            id_str: '$user_id_str', 
            screen_name: '$user_screen_name', 
            profile_image_url_https: '$user_profile_image_url_https' 
        }, 
        count: '$count' 
      } }, 
      { $limit: perPage * page }, 
      { $skip : (perPage * page) - perPage } 
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/top_images \n %j', pipeline);

    return Tweets.aggregate(pipeline, cb);
  }

  twitterTweetsMetricsMethods['users_most_active'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
    var pipeline = [
      { $match: { 
        'status.user.screen_name': { $exists: true }, 
        'status.timestamp_ms': { 
          $gte: since.getTime(), 
          $lte: until.getTime() 
        } 
      } }, 
      { $group: { 
        _id: '$status.user.screen_name', 
        count: { $sum: 1 } 
      } }, 
      { $sort: { count: -1 } }, 
      { $project: { 
        _id: 0, 
        screen_name: '$_id', 
        count: '$count' 
      } }, 
      { $limit: perPage * page }, 
      { $skip : (perPage * page) - perPage } 
    ];

    if (tags)
      pipeline[0].$match['categories'] = { $all: tags.split(',') };
      // pipeline[0].$match['categories'] = { $all: tags.replace(/ /g,'').split(',') };

    if (hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $all: hashtags.replace(/ /g,'').split(',') };

    console.log('/tweets/metrics/top_images \n %j', pipeline);

    return Tweets.aggregate(pipeline, cb);
  }

  twitterTweetsMetricsMethods['geolocation'] = function (since, until, tags, hashtags, page, perPage, Tweets, cb) { 
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

    return Tweets.aggregate(pipeline, function(err, result) {
      if (err) 
        return cb(err, null);
      else 
        return cb(null, result[0]);
    });
  }

};