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

  Analytic.facebookPagePostsAnalytics = function(method, period, type, page, perPage, cb) {
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
      type: type,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage
    }

    
    facebookPostAnalyticsMethods[method](params, FacebookPagePost, cb);
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
};