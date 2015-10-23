module.exports = function(Analytic) {

  Analytic.remoteMethod('facebookPostsAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string', required: true },
      { arg: 'profile_type', type: 'string' },
      { arg: 'post_type', type: 'string' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Analytic.remoteMethod('twitterAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string', required: true },
      { arg: 'tags', type: 'string' },
      { arg: 'hashtags', type: 'string' },
      { arg: 'retrive_blocked', type: 'boolean' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/twitter/:method', verb: 'GET' }
  });

  Analytic.facebookPostsAnalytics = function(method, period, profileType, postType, page, perPage, cb) {
    if (!periodEnum[period]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['period'];
      err.status = 400;

      return cb(err);
    }

    if (!facebookPostAnalyticsMethods[method]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['method'];
      err.status = 400;

      return cb(err);
    }

    var params = {
      since: new Date(),
      until: new Date(new Date() - periodEnum[period]),
      postType: postType,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage
    }

    switch (profileType) {
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
    
    facebookPostAnalyticsMethods[method](params, model, cb);
  }

  Analytic.twitterAnalytics = function(method, period, tags, hashtags, retriveBlocked, page, perPage, cb) {
    if (!periodEnum[period]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['period'];
      err.status = 400;

      return cb(err);
    }

    if (!twitterAnalyticsMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      since: new Date(),
      until: new Date(new Date() - periodEnum[period]),
      tags: tags === undefined ? null : tags.trim().split(','),
      hashtags: hashtags === undefined ? null : hashtags.trim().split(','),
      retriveBlocked: retriveBlocked === undefined ? false : retriveBlocked,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage
    }
    
    var model = Analytic.app.models.Tweet;
    twitterAnalyticsMethods[method](params, model, cb);
  }

  var periodEnum = {};
  periodEnum['15m']  = 15 * 60 * 1000;
  periodEnum['30m']  = 30 * 60 * 1000;
  periodEnum['1h']   = 60 * 60 * 1000;
  periodEnum['1d']   = 24 * 60 * 60 * 1000;
  periodEnum['7d']   = 7 * 24 * 60 * 60 * 1000;
  periodEnum['15d']  = 15 * 24 * 60 * 60 * 1000;

  var facebookPostAnalyticsMethods = {};
  facebookPostAnalyticsMethods['most_liked_posts'] = function (params, model, cb) {
    var filter = {
      where: {
        created_time_ms: {
          between: [
            params.since.getTime(),
            params.until.getTime()
          ]
        }
      },
      order: 'likes_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      filter.type = params.postType;

    model.find(filter, function(err, facebookPosts) {
      if (err)
        return cb(err, null);
      else
        return cb(null, facebookPosts);
    });
  };

  facebookPostAnalyticsMethods['most_shared_posts'] = function (params, model, cb) {
    var filter = {
      where: {
        created_time_ms: {
          between: [
            params.since.getTime(),
            params.until.getTime()
          ]
        }
      },
      order: 'shares_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      filter.type = params.postType;

    model.find(filter, function(err, facebookPosts) {
      if (err)
        return cb(err, null);
      else
        return cb(null, facebookPosts);
    });
  };

  facebookPostAnalyticsMethods['most_commented_posts'] = function (params, model, cb) {
    var filter = {
      where: {
        created_time_ms: {
          between: [
            params.since.getTime(),
            params.until.getTime()
          ]
        }
      },
      order: 'comments_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      filter.type = params.postType;

    model.find(filter, function(err, facebookPosts) {
      if (err)
        return cb(err, null);
      else
        return cb(null, facebookPosts);
    });
  };

  facebookPostAnalyticsMethods['most_active_profiles'] = function (params, model, cb) {
    var pipeline = [
      { $match: { 
        created_time_ms: {
          $lte: params.since.getTime(),
          $gte: params.until.getTime()
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
      pipeline[0].$match.type = params.postType;

    console.log('%j', pipeline);
    model.aggregate(pipeline, cb);
  };

  var twitterAnalyticsMethods = {};
  twitterAnalyticsMethods['most_retweeted_tweets'] = function(params, model, cb) {
    var pipeline = [
      { $match: {
        'status.retweeted_status': { $exists: true},
        'status.timestamp_ms': {
          $gte: params.until.getTime(),
          $lte: params.since.getTime()
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
      pipeline[0].$match[''] = { $in: params.hashtags };
    console.log(JSON.stringify(pipeline));
    model.aggregate(pipeline, cb);
  };

  twitterAnalyticsMethods['most_mentioned_users'] = function(params, model, cb) {
    var pipeline = [
      { $match: {
        'status.timestamp_ms': {
          $gte: params.until.getTime(),
          $lte: params.since.getTime()
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
      pipeline[0].$match[''] = { $in: params.hashtags };
    console.log(JSON.stringify(pipeline));
    model.aggregate(pipeline, cb);
  };
};