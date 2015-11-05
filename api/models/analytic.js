module.exports = function(Analytic) {

  Analytic.remoteMethod('facebookPostsAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      { arg: 'profile_type', type: 'string', required: true },
      { arg: 'post_type', type: '[string]' },
      { arg: 'tags', type: '[string]' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Analytic.remoteMethod('customCount', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      { arg: 'profile_type', type: 'string', required: true },
      { arg: 'post_type', type: '[string]' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/count', verb: 'GET' }
  });

  Analytic.customCount = function(){};

  Analytic.remoteMethod('twitterAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string' },
      { arg: 'tags', type: '[string]' },
      { arg: 'hashtags', type: '[string]' },
      { arg: 'last', type: 'number' },
      { arg: 'retrive_blocked', type: 'boolean' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/twitter/:method', verb: 'GET' }
  });

  Analytic.facebookPostsAnalytics = function(method, period, profileType, postType, tags, page, perPage, cb) {
    if (!facebookPostAnalyticsMethods[method]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['method'];
      err.status = 400;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/facebook',
      method: method,
      period: period === undefined ? '1h' : period,
      profileType: profileType,
      postType: postType === undefined ? null : postType.sort(),
      tags: tags === undefined ? null : tags.sort(),
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage > 100 ? 100 : perPage
    }

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };

    switch (params.profileType) {
      case 'user':
        var model = Analytic.app.models.FacebookPost;
        break;
      case 'page':
        var model = Analytic.app.models.FacebookPagePost;
        break;
      default:
        var err = new Error('Malformed request syntax. Check the query string arguments!');
        err.fields = ['profile_type'];
        err.status = 400;

        return cb(err);
        break; 
    }
    
    facebookPostAnalyticsMethods[method](params, model, options, cb);
  }

  Analytic.twitterAnalytics = function(method, period, tags, hashtags, last, retriveBlocked, page, perPage, cb) {
    if (!twitterAnalyticsMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      endpoint: '/analytics/twitter',
      method: method,
      period: period === undefined ? '1h' : period,
      tags: tags === undefined ? null : tags.sort(),
      hashtags: hashtags === undefined ? null : hashtags.sort(),
      last: last === undefined ? 1000 : last > 5000 ? 5000 : last,
      retriveBlocked: retriveBlocked === undefined ? false : retriveBlocked,
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
    if (resultCache) return cb(null, resultCache);
    
    var model = Analytic.app.models.Tweet;
    twitterAnalyticsMethods[method](params, model, options, cb);
  }

  var periodEnum = {};
  periodEnum['15m'] = 15 * 60 * 1000;
  periodEnum['30m'] = 30 * 60 * 1000;
  periodEnum['1h']  = 60 * 60 * 1000;
  periodEnum['12h'] = 12 * 60 * 60 * 1000;
  periodEnum['1d']  = 24 * 60 * 60 * 1000;
  periodEnum['7d']  = 7 * 24 * 60 * 60 * 1000;
  periodEnum['15d'] = 15 * 24 * 60 * 60 * 1000;

  var cacheTTLenum = {};
  cacheTTLenum['15m']  = 15 * 60 * 1000;
  cacheTTLenum['30m']  = 30 * 60 * 1000;
  cacheTTLenum['1h']   = 60 * 60 * 1000;
  cacheTTLenum['6h']   = 6 * 60 * 60 * 1000;
  cacheTTLenum['12h'] = 6 * 60 * 60 * 1000;
  cacheTTLenum['1d']  = 6 * 60 * 60 * 1000;
  cacheTTLenum['7d']  = 6 * 60 * 60 * 1000;
  cacheTTLenum['15d'] = 6 * 60 * 60 * 1000;


  var facebookPostAnalyticsMethods = {};
  facebookPostAnalyticsMethods['most_liked_posts'] = function(params, model, options, cb) { 

    var query = {
      where: {
        created_time_ms: {
          between: [
            new Date(new Date() - periodEnum[params.period]).getTime(),
            new Date().getTime()
          ]
        }
      },
      order: 'likes_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.postType)
      query.type = { $all: params.postType };

    if (params.tags)
      query.categories = { $all: params.tags };

    model.find(query, function(err, facebookPosts) {
      if (err) return cb(err, null);
      
      Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      return cb(null, facebookPosts);
    });
  };

  facebookPostAnalyticsMethods['most_shared_posts'] = function(params, model, options, cb) { 
    var resultCache = Analytic.cache.get(options.cache.key);

    if (resultCache) return cb(null, resultCache);

    var query = {
      where: {
        created_time_ms: {
          between: [
            new Date(new Date() - periodEnum[params.period]).getTime(),
            new Date().getTime()
          ]
        }
      },
      order: 'shares_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      query.type = { $all: params.postType };

    if (params.tags)
      query.categories = { $all: params.tags };

    model.find(query, function(err, facebookPosts) {
      if (err) return cb(err, null);
      
      if (facebookPosts.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, facebookPosts);
    });
  };

  facebookPostAnalyticsMethods['most_commented_posts'] = function(params, model, options, cb) { 
    var resultCache = Analytic.cache.get(options.cache.key);

    if (resultCache) return cb(null, resultCache);

    var query = {
      where: {
        created_time_ms: {
          between: [
            new Date(new Date() - periodEnum[params.period]).getTime(),
            new Date().getTime()
          ]
        }
      },
      order: 'comments_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      query.type = { $all: params.postType };

    if (params.tags)
      query.categories = { $all: params.tags };

    model.find(query, function(err, facebookPosts) {
      if (err) return cb(err, null);
      
      if (facebookPosts.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, facebookPosts);
    });
  };

  facebookPostAnalyticsMethods['most_active_profiles'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: { 
        created_time_ms: {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        }
      } },
      { $group: {
        _id: '$from',
        posts_count: { $sum: 1 }
      } },
      { $project: { 
          _id: 0,
          id: '$_id.id',
          name: '$_id.name',
          posts_count: '$posts_count'
      } }, 
      { $sort: { posts_count: -1 } },
      { $limit: params.perPage * params.page },
      { $skip : (params.perPage * params.page) - params.perPage }
    ];

    if (params.type)
      pipeline[0].$match.type = { $all: params.postType };

    if (params.tags)
      pipeline[0].$match.categories = { $all: params.tags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (facebookPosts.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(err, result);
    });
  };

  var twitterAnalyticsMethods = {};
  twitterAnalyticsMethods['most_retweeted_tweets'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        'status.retweeted_status': { $exists: true},
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.retriveBlocked
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
      { $limit: params.perPage * params.page },
      { $skip : (params.perPage * params.page) - params.perPage }
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags) 
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };
    console.log('%j', pipeline);

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['most_recent_retweeted_tweets'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        'status.retweeted_status': { $exists: true},
        block: params.retriveBlocked
      } },
      { $limit: params.last },
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
      { $limit: params.perPage * params.page },
      { $skip : (params.perPage * params.page) - params.perPage }
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags) 
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['most_mentioned_users'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        'status.entities.user_mentions.0': { $exists: true }, 
        block: params.retriveBlocked 
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
      { $limit: params.perPage * params.page },
      { $skip : (params.perPage * params.page) - params.perPage }
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['most_retweeted_urls'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        'status.entities.urls.0': { $exists: true },
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.retriveBlocked 
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
      { $limit: params.perPage * params.page }, 
      { $skip : (params.perPage * params.page) - params.perPage } 
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['most_retweeted_images'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        'status.entities.media.0': { $exists: true },
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.retriveBlocked 
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
        // TODO: Refactor data structure
        // status: {
        //   id: '$status_id_str',
        //   text: '$status_text',
        //   created_at: '$status_created_at',
        //   media_url_https: '$_id',
        // },
        media_url_https: '$_id',
        text: '$status_text',
        user: {
          id_str: '$user_id_str',
          screen_name: '$user_screen_name',
          profile_image_url_https: '$user_profile_image_url_https'
        },
        count: '$count'
      } }, 
      { $limit: params.perPage * params.page }, 
      { $skip : (params.perPage * params.page) - params.perPage } 
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['most_active_users'] = function(params, model, options, cb) { 
    var pipeline = [ 
      { $match: {
        'status.user.screen_name': { $exists: true },
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.retriveBlocked 
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
      { $limit: params.perPage * params.page }, 
      { $skip : (params.perPage * params.page) - params.perPage } 
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['most_popular_hashtags'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        'status.entities.hashtags.0': { $exists: true },
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.retriveBlocked 
      } },
      { $unwind: '$status.entities.hashtags' },
      { $group: {
        _id: '$status.entities.hashtags.text',
        count: { $sum: 1 }
      } },
      { $sort: { count: -1 } },
      { $project: {
        _id: 0,
        hashtag: '$_id',
        count: '$count'
      } }, 
      { $limit: params.perPage * params.page }, 
      { $skip : (params.perPage * params.page) - params.perPage } 
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };

  twitterAnalyticsMethods['geolocation'] = function(params, model, options, cb) { 
    var pipeline = [
      { $match: {
        $or: [ { 'status.geo': { $ne: null } }, 
               { 'city_geo': { $exists: true } } ],
        'status.timestamp_ms': {
          $gte: new Date(new Date() - periodEnum[params.period]).getTime(),
          $lte: new Date().getTime()
        },
        block: params.retriveBlocked 
      } }, 
      { $group: {
        _id: 0,
        features: { $push: { 
          // type: {  $literal: 'Feature' },
          properties: {
            id_str: '$status.id_str',
          },
          geometry: {
            // type: {  $literal: 'Point' }, 
            coordinates: { $cond: [ { $ne: [ '$status.geo', null ] }, '$status.geo.coordinates', '$city_geo' ] }
          }
        } }
      } },
      { $project: {
        _id: 0,
        // type: {  $literal: 'FeatureCollection' },
        features: '$features'
      } }
    ];

    if(params.tags)
      pipeline[0].$match.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };

    model.aggregate(pipeline, function(err, result) {
      if (err) return cb(err, null);

      if (result.length > 0)
        Analytic.cache.put(options.cache.key, result, options.cache.ttl);
      
      return cb(null, result);
    });
  };
};