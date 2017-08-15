var util = require('util'),
    periodEnum = require('./enums/periodEnum'),
    moment = require('moment'),
    _ = require('../lib/underscoreExtended'),
    dao = { 
      mongodb: {
        analyticsFacebook: require('../dao/mongodb/analytics-facebook'),
        analyticsInstagram: require('../dao/mongodb/analytics-instagram'),
        analyticsTwitter: require('../dao/mongodb/analytics-twitter')
      }
    },
    debug = require('debug')('hashapi:analytics:facebook');

module.exports = function(Analytic) {

  Analytic.remoteMethod('facebookPosts', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'profile_type', type: 'string' },
      { arg: 'period', type: 'string', default: 'P7D' },
      { arg: 'filter', type: 'object', http: function mapping(ctx) {
        debug('filter: ', util.inspect(ctx, {depth: null}));
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
          mappedFilter.posts         = _.convertToArray(filter['posts']);

          filter = mappedFilter;
        } else {
          filter = {};
        }

        return filter;
      } },
      { arg: 'last', type: 'number', default: 1000 },
      { arg: 'page', type: 'number', default: 1 },
      { arg: 'per_page', type: 'number', default: 25 }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Analytic.facebookPosts = function(method, profileType, period, filter, last, page, perPage, cb) {
    if (!analyticsFacebookPostRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.statusCode = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/facebook',
      method: method,
      profileType: profileType,
      filter: filter,
      period: period,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage > 100 ? 100 : perPage
    }

    params.since = new Date(new Date() - periodEnum[params.period]);
    params.until = new Date();
    
    if(params.method === 'most_liked_comments') {
      var model = Analytic.app.models.FacebookComment;
    } else {
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
    }
    
    analyticsFacebookPostRemoteMethods[method](params, model, function(err, result) {
      if (err) return cb(err, null);
      
      return cb(null, result);
    });
  }

  var analyticsFacebookPostRemoteMethods = {
    'most_active_profiles': dao.mongodb.analyticsFacebook.mostActiveProfiles,
    'most_commented_posts': dao.mongodb.analyticsFacebook.mostCommentedPosts,
    'most_liked_comments': dao.mongodb.analyticsFacebook.mostLikedComments,
    'most_liked_posts': dao.mongodb.analyticsFacebook.mostLikedPosts,
    'most_recurring_hashtags': dao.mongodb.analyticsFacebook.mostRecurringHashtags,
    'most_recurring_images': dao.mongodb.analyticsFacebook.mostRecurringImages,
    'most_shared_posts': dao.mongodb.analyticsFacebook.mostSharedPosts
  };


  Analytic.remoteMethod('instagram', {
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
          mappedFilter.users         = _.convertToArray(filter['users']);
          mappedFilter.mentions      = _.convertToArray(filter['mentions']);
          mappedFilter.type          = _.convertToArray(filter['type']);
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
    http: { path: '/instagram/:method', verb: 'GET' }
  });

  Analytic.instagram = function(method, period, filter, last, page, perPage, cb) {
    if (!analyticsInstagramRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/twitter',
      method: method,
      period: period === undefined ? 'P7D' : period,
      filter: filter,
      last: last === undefined ? 1000 : last > 5000 ? 5000 : last,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage > 100 ? 100 : perPage
    };
    
    params.since = new Date(new Date() - periodEnum[params.period]);
    params.until = new Date();
    
    var model = Analytic.app.models.InstagramMedia;
    analyticsInstagramRemoteMethods[method](params, model, function(err, result) {
      if (err) return cb(err, null);
      
      return cb(null, result);
    });
  }

  var analyticsInstagramRemoteMethods = {
    'geolocation': dao.mongodb.analyticsInstagram.geolocation,
    'most_active_users': dao.mongodb.analyticsInstagram.mostActiveUsers,
    'most_commented_medias': dao.mongodb.analyticsInstagram.mostCommentedMedias,
    'most_liked_medias': dao.mongodb.analyticsInstagram.mostLikedMedias,
    'most_popular_users': dao.mongodb.analyticsInstagram.mostPopularUsers
  };


  Analytic.remoteMethod('twitter', {
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
          mappedFilter.users         = _.convertToArray(filter['users']);
          mappedFilter.mentions      = _.convertToArray(filter['mentions']);
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

  Analytic.twitter = function(method, period, filter, last, page, perPage, cb) {
    if (!analyticsTwitterRemoteMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/twitter',
      method: method,
      period: period === undefined ? 'P7D' : period,
      filter: filter,
      last: last === undefined ? 1000 : last > 5000 ? 5000 : last,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage > 100 ? 100 : perPage
    };
    
    params.since = new Date(new Date() - periodEnum[params.period]);
    params.until = new Date();
    
    var model = Analytic.app.models.TwitterTweet;

    analyticsTwitterRemoteMethods[method](params, model, function(err, result) {
      if (err) return cb(err, null);
      
      return cb(null, result);
    });
  }

  var analyticsTwitterRemoteMethods = {
    'geolocation': dao.mongodb.analyticsTwitter.geolocation,
    'most_active_users': dao.mongodb.analyticsTwitter.mostActiveUsers,
    'most_mentioned_users': dao.mongodb.analyticsTwitter.mostMentionedUsers,
    'most_recently_retweeted_tweets': dao.mongodb.analyticsTwitter.mostRecentlyRetweetedTweets,
    'most_recurring_hashtags': dao.mongodb.analyticsTwitter.mostRecurringHashtags,
    'most_recurring_images': dao.mongodb.analyticsTwitter.mostRecurringImages,
    'most_recurring_urls': dao.mongodb.analyticsTwitter.mostRecurringUrls,
    'most_retweeted_tweets': dao.mongodb.analyticsTwitter.mostRetweetedTweets
  };

};