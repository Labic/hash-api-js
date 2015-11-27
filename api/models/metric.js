var periodEnum = require('./enums/periodEnum'),
    granularityEnum = require('./enums/granularityEnum'),
    cacheTTLenum = require('./enums/cacheTTLenum'),
    _ = require('../lib/underscoreExtended'),
    dao = { 
      mongodb: {
        metricsFacebook: require('../dao/mongodb/metrics-facebook'),
        metricsInstagram: require('../dao/mongodb/metrics-instagram'),
        metricsTwitter: require('../dao/mongodb/metrics-twitter')
      }
    };

module.exports = function(Metric) {

  Metric.remoteMethod('metricsFacebook', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      // TODO: Remove profile_type arg because of use node insted.
      { arg: 'profile_type', type: 'string' },
      { arg: 'node', type: 'string' },
      { arg: 'period', type: 'string' },
      // TODO: Implement this in near future
      // { arg: 'period', type: 'string', http: function mapping(ctx) {
      //   var period = ctx.req.query.period;

      //   console.log('period:\n%j', period);

      //   if(period) {
      //     var mappedFilter = {};

      //     if (!_.isEmpty(period['since']))
      //       mappedFilter.since = new Date(period['since']);
      //     if (!_.isEmpty(period['until']))
      //       mappedFilter.until = new Date(period['until']);

      //     period = mappedFilter;
      //   } else {
      //     period = null;
      //   }

      //   return period;
      // }, 
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
          mappedFilter.profiles      = _.convertToArray(filter['profiles']);
          mappedFilter.mentions      = _.convertToArray(filter['mentions']);
          mappedFilter.types         = _.convertToArray(filter['types']);

          filter = mappedFilter;
        } else {
          filter = {};
        }

        return filter;
      } },
      { arg: 'last', type: 'number' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Metric.metricsFacebook = function(method, profileType, node, period, granularity, filter, last, page, perPage, cb) {
    if (!metricsFacebookPostsRemoteMethods[method]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['method'];
      err.statusCode = 400;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/facebook',
      method: method,
      profileType: profileType,
      node: node,
      period: _.isEmpty(period) ? 'P7D' : period,
      granularity: _.isEmpty(granularity)? 'P1D' : granularity,
      filter: filter,
      last: _.isEmpty(last) ? 1000 : last > 5000 ? 5000 : last,
      page: _.isEmpty(page) ? 1 : page,
      perPage: _.isEmpty(perPage) ? 25 : perPage > 100 ? 100 : perPage
    };

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

    params.node = _.isEmpty(params.node) 
      ? _.isEmpty(params.profileType) 
        ? null
        : params.profileType
      : params.node;
    switch (params.node) {
      case 'user':
        var model = Metric.app.models.FacebookPost;
        break;
      case 'page':
        var model = Metric.app.models.FacebookPagePost;
        break;
      case 'comment':
        var model = Metric.app.models.FacebookComment;
        break;
      default:
        var err = new Error('Malformed request syntax. node query param is required!');
        err.statusCode = 400;

        return cb(err);
    }

    metricsFacebookPostsRemoteMethods[method](params, model, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Metric.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  }

  var metricsFacebookPostsRemoteMethods = {
    'interations_rate': dao.mongodb.metricsFacebook.interactionsRate,
    'profiles_rate': dao.mongodb.metricsFacebook.profilesRate,
    'tags_count': dao.mongodb.metricsFacebook.tagsCount
  };


  Metric.remoteMethod('metricsInstagram', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'node', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      // TODO: Implement this in near future
      // { arg: 'period', type: 'string', http: function mapping(ctx) {
      //   var period = ctx.req.query.period;

      //   console.log('period:\n%j', period);

      //   if(period) {
      //     var mappedFilter = {};

      //     if (!_.isEmpty(period['since']))
      //       mappedFilter.since = new Date(period['since']);
      //     if (!_.isEmpty(period['until']))
      //       mappedFilter.until = new Date(period['until']);

      //     period = mappedFilter;
      //   } else {
      //     period = null;
      //   }

      //   return period;
      // }, 
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
          mappedFilter.types         = _.convertToBoolean(filter['types']);

          filter = mappedFilter;
        } else {
          filter = {};
        }

        return filter;
      } },
      { arg: 'last', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/instagram/:method', verb: 'GET' }
  });

  Metric.metricsInstagram = function(method, node, period, granularity, filter, last, cb) {
    if (!metricsInstagramRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.statusCode = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/metrics/instagram',
      method: method,
      node: node,
      period: period === undefined ? 'P7D' : period,
      granularity: granularity === undefined ? 'P1D' : granularity,
      filter: filter,
      last: last === undefined ? 1000 : last > 5000 ? 5000 : last
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

    switch (params.node) {
      case 'media':
        var model = Metric.app.models.InstagramMedia;
        break;
      case 'comment':
        var model = Metric.app.models.InstagramComment;
        break;
      default:
        var err = new Error('Malformed request syntax. node query param value is not valid!. Please chose between media and comment.');
        err.statusCode = 400;

        return cb(err);
    }
    
    metricsInstagramRemoteMethods[method](params, model, function (err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Metric.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  }

  var metricsInstagramRemoteMethods = {
    // 'tags_count': dao.mongodb.metricsTwitter.tagsCount,
    'interations_rate': dao.mongodb.metricsInstagram.interactionsRate
  };


  Metric.remoteMethod('metricsTwitter', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      // TODO: Implement this in near future
      // { arg: 'period', type: 'string', http: function mapping(ctx) {
      //   var period = ctx.req.query.period;

      //   console.log('period:\n%j', period);

      //   if(period) {
      //     var mappedFilter = {};

      //     if (!_.isEmpty(period['since']))
      //       mappedFilter.since = new Date(period['since']);
      //     if (!_.isEmpty(period['until']))
      //       mappedFilter.until = new Date(period['until']);

      //     period = mappedFilter;
      //   } else {
      //     period = null;
      //   }

      //   return period;
      // }, 
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
      { arg: 'last', type: 'number' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/twitter/:method', verb: 'GET' }
  });

  Metric.metricsTwitter = function(method, period, granularity, filter, last, page, perPage, cb) {
    if (!metricsTwitterRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.statusCode = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/metrics/twitter',
      method: method,
      period: period === undefined ? 'P7D' : period,
      granularity: granularity === undefined ? 'P1D' : granularity,
      filter: filter,
      last: last === undefined ? 1000 : last > 5000 ? 5000 : last,
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

  var metricsTwitterRemoteMethods = {
    'interations_rate': dao.mongodb.metricsTwitter.interactionsRate,
    'tags_count': dao.mongodb.metricsTwitter.tagsCount,
    'users_rate': dao.mongodb.metricsTwitter.usersRate
  };

};

// https://blog.bufferapp.com/social-media-metrics
// https://hdf5-json.readthedocs.org/en/latest/index.html