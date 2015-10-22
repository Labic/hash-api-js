module.exports = function(Analytic) {

  Analytic.remoteMethod('facebookPostsAnalytics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string', required: true },
      { arg: 'type', type: 'string' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'number' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/facebook/:method', verb: 'GET' }
  });

  Analytic.facebookPostsAnalytics = function(method, period, type, page, perPage, cb) {
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

    var FacebookPost = Analytic.app.models.FacebookPost;
    facebookPostAnalyticsMethods[method](params, FacebookPost, cb);
  }

  var periodEnum = {};
  periodEnum['1h']  = 60 * 60 * 1000;
  periodEnum['1d']  = 24 * 60 * 60 * 1000;
  periodEnum['7d']  = 7 * 24 * 60 * 60 * 1000;
  periodEnum['15d'] = 15 * 24 * 60 * 60 * 1000;

  var facebookPostAnalyticsMethods = {};
  facebookPostAnalyticsMethods['most_liked_posts'] = function (params, model, cb) {
    var filter = {
      where: {
        'api_collector.created_time_ms': {
          between: [
            params.since.getTime(),
            params.until.getTime()
          ]
        }
      },
      fields: {
        api_collector: true
      },
      order: 'api_collector.likes_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      filter.where['api_collector.type'] = params.type;

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
        'api_collector.created_time_ms': {
          between: [
            params.since.getTime(),
            params.until.getTime()
          ]
        }
      },
      fields: {
        api_collector: true
      },
      order: 'api_collector.shares_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      filter.where['api_collector.type'] = params.type;

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
        'api_collector.created_time_ms': {
          between: [
            params.since.getTime(),
            params.until.getTime()
          ]
        }
      },
      fields: {
        api_collector: true
      },
      order: 'api_collector.comments_count DESC',
      limit: params.perPage * params.page,
      skip: (params.perPage * params.page) - params.perPage
    };

    if (params.type)
      filter.where['api_collector.type'] = params.type;

    model.find(filter, function(err, facebookPosts) {
      if (err)
        return cb(err, null);
      else
        return cb(null, facebookPosts);
    });
  };
};