var periodEnum = require('./enums/periodEnum'),
    granularityEnum = require('./enums/granularityEnum'),
    cacheTTLenum = require('./enums/cacheTTLenum'),
    _ = require('../lib/underscoreExtended'),
    dao = { 
      mongodb: {
        metricsTwitter: require('../dao/mongodb/metrics-twitter')
      }
    };

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

  Metric.remoteMethod('metricsTwitter', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      { arg: 'granularity', type: 'string' },
      { arg: 'filter', type: 'object', http: function mapping(ctx) {
        var filter = ctx.req.query.filter;

        if(filter) {
          var mappedFilter = {
            tags: {
              with: undefined,
              contains: undefined
            }
          };

          mappedFilter.tags.with     = _.convertToArray(filter['with_tags']);
          mappedFilter.tags.contains = _.convertToArray(filter['contain_tags']);
          mappedFilter.hashtags      = _.convertToArray(filter['hashtags']);
          mappedFilter.mentions      = _.convertToArray(filter['mentions']);
          mappedFilter.users         = _.convertToArray(filter['users']);
          mappedFilter.has           = _.convertToArray(filter['has']);
          mappedFilter.retweeted     = _.convertToBoolean(filter['retweeted']);
          mappedFilter.blocked       = _.convertToBoolean(filter['blocked']);

          filter = mappedFilter;
        } else {
          filter = {};
        }

        return filter;
      } },
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

  Metric.metricsTwitter = function(method, period, granularity, filter, tags, hashtags, has, retriveBlocked, page, perPage, cb) {
    if (!metricsTwitterRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.statusCode = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/metrics/twitter',
      method: method,
      period: period === undefined ? 'P1H' : period,
      granularity: granularity === undefined ? 'P1D' : granularity,
      filter: filter,
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
      err.statusCode = 400;

      return cb(err);
    }

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };

    var resultCache = Metric.cache.get(options.cache.key);
    if (resultCache)
      return cb(null, resultCache);

    params.since = new Date(new Date() - periodEnum[params.period]);
    params.until = new Date();
    
    var model = Metric.app.models.Tweet;
    metricsTwitterRemoteMethods[method](params, model, function (err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Metric.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  }

  var metricsTwitterRemoteMethods = {};
  metricsTwitterRemoteMethods['tags_count'] = dao.mongodb.metricsTwitter.tagsCount;
  metricsTwitterRemoteMethods['interations_rate'] = dao.mongodb.metricsTwitter.interactionsRate;

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