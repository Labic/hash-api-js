var periodEnum = require('./enums/periodEnum'),
    granularityEnum = require('./enums/granularityEnum'),
    cacheTTLenum = require('./enums/cacheTTLenum');

module.exports = function(Metric) {

  Metric.remoteMethod('facebookPostsMetrics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      { arg: 'profile_type', type: 'string', required: true },
      { arg: 'post_type', type: '[string]' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Metric.remoteMethod('twitterMetrics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      { arg: 'granularity', type: 'string' },
      { arg: 'filter', type: '[string]' },
      { arg: 'tags', type: '[string]' },
      { arg: 'hashtags', type: '[string]' },
      { arg: 'has', type: '[string]' }, // Used for count method
      { arg: 'retrive_blocked', type: 'boolean' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/twitter/:method', verb: 'GET' }
  });

  Metric.facebookPostsMetrics = function(method, period, profileType, postType, page, perPage, cb) {
    if (!facebookPostsMetricsMethods[method]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['method'];
      err.status = 400;

      return cb(err);
    }

    var params = {
      endpoint: '/metrics/facebook',
      method: method,
      period: period === undefined ? '1h' : period,
      profileType: profileType,
      postType: postType === undefined ? null : postType.sort(),
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage
    };

    if (!periodEnum[params.period]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['period'];
      err.status = 400;

      return cb(err);
    }

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };

    switch (params.profileType) {
      case 'user':
        var model = Metric.app.models.FacebookPost;
        break;
      
      case 'page':
        var model = Metric.app.models.FacebookPagePost;
        break;
      
      default:
        var err = new Error('Malformed request syntax. Check the query string arguments!');
        err.fields = ['profile_type'];
        err.status = 400;

        return cb(err);
        break; 
    }
    
    facebookPostsMetricsMethods[method](params, model, options, cb);
  }

  Metric.twitterMetrics = function(method, period, granularity, filter, tags, hashtags, has, retriveBlocked, page, perPage, cb) {
    if (!twitterMetricsMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/metrics/twitter',
      method: method,
      period: period === undefined ? '1h' : period,
      granularity: granularity === undefined ? 'PT15M' : granularity,
      filter: {
        tags: tags === undefined ? null : tags.sort(),
        hashtags: hashtags === undefined ? null : hashtags.sort(),
        has: has, 
        blocked: retriveBlocked === undefined ? false : retriveBlocked
      },
      tags: tags === undefined ? null : tags.sort(),
      hashtags: hashtags === undefined ? null : hashtags.sort(),
      has: has, 
      retriveBlocked: retriveBlocked === undefined ? false : retriveBlocked,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage
    };

    if (!periodEnum[params.period]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['period'];
      err.status = 400;

      return cb(err);
    }

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };
    
    var model = Metric.app.models.Tweet;
    twitterMetricsMethods[method](params, model, options, cb);
  }

  var twitterMetricsMethods = {};
  twitterMetricsMethods['count'] = function(params, model, options, cb) { 
    var resultCache = Metric.cache.get(options.cache.key);
    if (resultCache) return cb(null, resultCache);

    var query = {
      'status.timestamp_ms': {
        $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
        $lte: new Date().getTime()
      },
      block: params.retriveBlocked
    };

    if(params.has) {
      if(params.has.indexOf('media') > -1)
        query['status.entities.media.0'] = { $exists: true };
      if(params.has.indexOf('url') > -1)
        query['status.entities.media.0'] = { $exists: true };
    }
    
    if(params.tags)
      query.categories = { $all: params.tags };
    
    if(params.hashtags)
      query['status.entities.hashtags.text'] = { $in: params.hashtags };
    
    return model.dao.mongodb.count(query, function(err, result) {
      if (err) return cb(err, null);
      
      Metric.cache.put(options.cache.key, { count: result }, options.cache.ttl);
      return cb(null, { count: result });
    });
  };

  twitterMetricsMethods['post_rate'] = function(params, model, options, cb) { 
    var resultCache = Metric.cache.get(options.cache.key);
    if (resultCache) return cb(null, resultCache);

    var group = {
    }

    var pipeline = [
      { $match: {
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.filter.blocked
      } },
      { $group: {
        _id: { 
          year: { $year: '$status.created_at' },
          month: { $month: '$status.created_at' },
          day: { $dayOfMonth: '$status.created_at' }
        },
        count: { $sum: 1 }
      } },
      { $sort: { count: -1 } },
      { $project: {
        _id: 0,
        count: '$count'
      } },
      { $limit: params.perPage * params.page },
      { $skip : (params.perPage * params.page) - params.perPage }
    ];

    if(params.has)
      if(params.has.indexOf('media') > -1)
        pipeline[0].$match['status.entities.media.0'] = { $exists: true };
      if(params.has.indexOf('url') > -1)
        pipeline[0].$match['status.entities.media.0'] = { $exists: true };

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };
    
    return model.dao.mongodb.count(query, function(err, result) {
      if (err) return cb(err, null);
      
      Metric.cache.put(options.cache.key, { count: result }, options.cache.ttl);
      return cb(null, { count: result });
    });
  };

  var facebookPostsMetricsMethods = {};
  facebookPostsMetricsMethods['count'] = function(params, model, options, cb) { 
    var resultCache = Metric.cache.get(options.cache.key);
    if (resultCache) return cb(null, resultCache);

    var query = {
      created_time_ms: {
        $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
        $lte: new Date().getTime()
      }
    };

    if (params.postType)
      query.type = { $in: params.postType };
    
    return model.dao.mongodb.count(query, function(err, result) {
      if (err) return cb(err, null);
      
      Metric.cache.put(options.cache.key, { count: result }, options.cache.ttl);
      return cb(null, { count: result });
    });
  };

};

// https://blog.bufferapp.com/social-media-metrics
// https://hdf5-json.readthedocs.org/en/latest/index.html