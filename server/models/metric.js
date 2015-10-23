module.exports = function(Metric) {

  Metric.remoteMethod('twitterMetrics', {
    accepts: [
      { arg: 'method', type: 'string', required: true },
      { arg: 'period', type: 'string', required: true },
      { arg: 'tags', type: '[string]' },
      { arg: 'hashtags', type: '[string]' },
      { arg: 'has', type: '[string]' }, // Used for count method
      { arg: 'retrive_blocked', type: 'boolean' },
      { arg: 'page', type: 'number' },
      { arg: 'per_page', type: 'mumber' }
    ],
    returns: { type: 'object', root: true },
    http: { path: '/twitter/:method', verb: 'GET' }
  });

  Metric.twitterMetrics = function(method, period, tags, hashtags, has, retriveBlocked, page, perPage, cb) {
    if (!periodEnum[period]) {
      var err = new Error('Malformed request syntax. Check the query string arguments!');
      err.fields = ['period'];
      err.status = 400;

      return cb(err);
    }

    if (!twitterMetricsMethods[method]) {
      var err = new Error('Endpoint not found!');
      err.status = 404;

      return cb(err);
    }

    var params = {
      since: new Date(new Date() - periodEnum[period]),
      until: new Date(),
      tags: tags,
      hashtags: hashtags,
      has: has, 
      retriveBlocked: retriveBlocked === undefined ? 'false' : retriveBlocked,
      page: page === undefined ? 1 : page,
      perPage: perPage === undefined ? 25 : perPage
    }
    
    var model = Metric.app.models.Tweet;
    twitterMetricsMethods[method](params, model, cb);
  }

  var periodEnum = {};
  periodEnum['15m']  = 15 * 60 * 1000;
  periodEnum['30m']  = 30 * 60 * 1000;
  periodEnum['1h']   = 60 * 60 * 1000;
  periodEnum['1d']   = 24 * 60 * 60 * 1000;
  periodEnum['7d']   = 7 * 24 * 60 * 60 * 1000;
  periodEnum['15d']  = 15 * 24 * 60 * 60 * 1000;

  var twitterMetricsMethods = {};
  twitterMetricsMethods['count'] = function (params, model, cb) { 
    var query = {
      'status.timestamp_ms': {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      },
      block: params.retriveBlocked
    };

    if(params.has)
      if(params.has.indexOf('media') > -1)
        query['status.entities.media.0'] = { $exists: true };

    if(params.tags)
      query.categories = { $all: params.tags };
    if(params.hashtags)
      pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.hashtags };
    console.log(JSON.stringify(query));
    return model.mongodb.count(query, function(err, result) {
      if (err) 
        return cb(err, null);
      else 
        return cb(err, { count: result } );
    });
  };

};