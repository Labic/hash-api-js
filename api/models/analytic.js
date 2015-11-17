var periodEnum = require('./enums/periodEnum'),
    cacheTTLenum = require('./enums/cacheTTLenum'),
    _ = require('../lib/underscoreExtended')
    dao = { 
      mongodb: {
        analyticsTwitter: require('../dao/mongodb/analytics-twitter'),
        analyticsFacebook: require('../dao/mongodb/analytics-facebook')
      }
    };

module.exports = function(Analytic) {

  Analytic.remoteMethod('facebookPostsAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'profile_type', type: 'string', required: true },
      { arg: 'period', type: 'string' },
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
          mappedFilter.profiles      = _.convertToArray(filter['profiles']);
          mappedFilter.postType      = _.convertToArray(filter['post_type']);

          filter = mappedFilter;
        } else {
          filter = {};
        }

        return filter;
      } },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Analytic.remoteMethod('twitterAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
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

  Analytic.facebookPostsAnalytics = function(method, profileType, period, filter, page, perPage, cb) {
    if (!facebookPostAnalyticsRemtoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.statusCode = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/facebook',
      method: method,
      profileType: profileType,
      period: period === undefined ? 'P1H' : period,
      filter: filter,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage > 100 ? 100 : perPage
    }

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };

    var resultCache = Analytic.cache.get(options.cache.key);
    if (resultCache) {
      return cb(null, resultCache);
    } else {
      params.since = new Date(new Date() - periodEnum[params.period]);
      params.until = new Date();
    }

    switch (params.profileType) {
      case 'user':
        var model = Analytic.app.models.FacebookPost;
        break;
      case 'page':
        var model = Analytic.app.models.FacebookPagePost;
        break;
      default:
        var err = new Error('Malformed request syntax. profile_type query param is required!');
        err.statusCode = 400;

        return cb(err, null);
    }
    
    facebookPostAnalyticsRemtoteMethods[method](params, model, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  }

  Analytic.twitterAnalytics = function(method, period, filter, last, page, perPage, cb) {
    if (!twitterAnalyticsRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/twitter',
      method: method,
      period: period === undefined ? 'P1H' : period,
      filter: filter,
      last: last === undefined ? 1000 : last > 5000 ? 5000 : last,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage > 100 ? 100 : perPage
    };

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };

    var resultCache = Analytic.cache.get(options.cache.key);
    if (resultCache) {
      return cb(null, resultCache);
    } else {
      params.since = new Date(new Date() - periodEnum[params.period]);
      params.until = new Date();
    }
    
    var model = Analytic.app.models.Tweet;
    twitterAnalyticsRemoteMethods[method](params, model, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  }

  var facebookPostAnalyticsRemtoteMethods = {
    'most_active_profiles': dao.mongodb.analyticsFacebook.mostActiveProfiles,
    'most_commented_posts': dao.mongodb.analyticsFacebook.mostCommentedPosts,
    'most_liked_posts': dao.mongodb.analyticsFacebook.mostLikedPosts,
    'most_shared_posts': dao.mongodb.analyticsFacebook.mostSharedPosts,
  };

  var twitterAnalyticsRemoteMethods = {
    'geolocation': dao.mongodb.analyticsTwitter.geolocation,
    'most_active_users': dao.mongodb.analyticsTwitter.mostActiveUsers,
    'most_mentioned_users': dao.mongodb.analyticsTwitter.mostMentionedUsers,
    'most_popular_hashtags': dao.mongodb.analyticsTwitter.mostPopularHashtags,
    'most_recently_retweeted_tweets': dao.mongodb.analyticsTwitter.mostRecentlyRetweetedTweets,
    'most_retweeted_tweets': dao.mongodb.analyticsTwitter.mostRetweetedTweets,
    'most_shared_images': dao.mongodb.analyticsTwitter.mostSharedImages,
    'most_shared_urls': dao.mongodb.analyticsTwitter.mostSharedUrls
  };
};