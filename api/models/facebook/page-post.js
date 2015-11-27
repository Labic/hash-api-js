var periodEnum = require('../enums/periodEnum'),
    cacheTTLenum = require('../enums/cacheTTLenum'),
    _ = require('underscore');

module.exports = function(FacebookPagePost) {

  var args = [
    { arg: 'profile_type', type: 'string' },
    { arg: 'period', type: '[object]', http: function mapping(ctx) {
      var period = ctx.req.query.period;

      if(_.isObject(period)) {
        var mappedFilter = {};

        if (!_.isEmpty(period['since']))
          mappedFilter.since = new Date(period['since']);
        if (!_.isEmpty(period['until']))
          mappedFilter.until = new Date(period['until']);

        period = mappedFilter;
      } else {
        period = {};
      }

      return period;
    } }, 
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
    { arg: 'last', type: 'number' }
  ];

  FacebookPagePost.remoteMethod('countByArgs', {
    accepts: args,
    returns: { type: 'object', root: true },
    http: { path: '/count', verb: 'GET' }
  });

  FacebookPagePost.countByArgs = function(profileType, period, filter, last, cb) {
    var params = {
      endpoint: '/facebook/pages/post',
      profileType: profileType,
      period: _.isEmpty(period) ? 'P7D' : period,
      filter: filter,
      last: _.isEmpty(last) ? 1000 : last > 5000 ? 5000 : last
    };

    // TODO: Move this verication na error response to period arg mapping
    var err = new Error('Malformed request syntax. Check the query string arguments!');
    err.statusCode = 400;
    if(_.isObject(params.period)) {
      console.log('_.isDate(params.period.since) %j', _.isDate(params.period.since));
      console.log('_.isEmpty(params.period.since) %j', _.isEmpty(params.period.since));
      console.log('params.period.since %j', params.period.since);
      if(params.period.since === undefined || !_.isDate(params.period.since)) {
        err.fields = ['period[since]'];
        return cb(err);
      }
      if(!_.isEmpty(params.period.since) && !_.isDate(params.period.until)) {
        err.fields = ['period[until]'];
        return cb(err);
      }
    } else if(!periodEnum[params.period]) {
      err.fields = ['period'];
      return cb(err);
    }

    var options = {
      cache: {
        key: JSON.stringify(params),
        ttl: cacheTTLenum[params.period]
      }
    };

    var resultCache = FacebookPagePost.cache.get(options.cache.key);
    if (resultCache)
      return cb(null, resultCache);

    var query = {};

    console.log('%j', params);

    if(params.filter.tags) {
      if(params.filter.tags.with)
        query['categories'] = { $all: params.filter.tags.with };

      if(params.filter.tags.contains)
        query['categories'] = { $in: params.filter.tags.contains };
    }

    if(params.filter.hashtags)
      query['hashtags'] = { $in: params.filter.hashtags };

    if(params.filter.mentions) {
      query['message_tags.id'] = { $in: params.filter.mentions };
      query['with_tags.id'] = { $in: params.filter.mentions };
    }

    if(params.filter.profiles)
      query['from.id'] = { $in: params.filter.profiles };

    if(params.filter.types)
      query['type'] = { $in: params.filter.types };
    
    return FacebookPagePost.dao.mongodb.count(query, function(err, result) {
      if (err) return cb(err, null);
      
      return cb(null, { count: result });
    });
  }
};