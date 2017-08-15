let periodEnum = require('../enums/periodEnum'),
    _ = require('underscore'),
    debug = require('debug')('hashapi:twitter:tweet');

module.exports = function(TwitterTweet) {
  
  TwitterTweet.remoteMethod('findByArgs', {
    accepts: [
      { arg: 'period', type: 'string', default: 'P1D' },
      { arg: 'filter', type: '[string]', http: { source: 'query' } },
      { arg: 'page', type: 'number', default: 1 },
      { arg: 'per_page', type: 'number', default: 25 },
    ],
    returns: { type: 'array', root: true },
    http: { path: '/', verb: 'GET' }
  });

  TwitterTweet.remoteMethod('countByArgs', {
    accepts: [
      { arg: 'period', type: 'string', default: 'P1D' },
      { arg: 'filter', type: '[string]', http: { source: 'query' } },
    ],
    returns: { type: 'object', root: true },
    http: { path: '/count', verb: 'GET' }
  });

  function dealWith(type, property, object) {
    switch (type) {
      case 'array':
        return _.isEmpty(object[property])
          ? null 
          : _.isArray(object[property])
            ? object[property]
            : [object[property]];
      default:
        throw new Error('type not supported!');
        break;
    }
  }

  TwitterTweet.findByArgs = function(period, filter, page, perPage, cb) {
    debug(`findByArgs.args.period: ${period}`);
    debug(`findByArgs.args.page: ${_.isEmpty(page)}`);
    debug(`findByArgs.args.perPage: ${perPage}`);
    debug(`findByArgs.args.filter: ${JSON.stringify(filter)}`);

    filter = _.isEmpty(filter) ? {} : filter;
    // TODO: implement httpArgsMapping
    ['with_tags', 'contain_tags', 'hashtags', 'mentions', 'users']
      .forEach(function (property) {
        filter[property] = dealWith('array', property, filter);
      });

    var query = {
      where: {},
      order: 'status.timestamp_ms DESC',
      limit: perPage * page,
      skip: (perPage * page) - perPage
    };

    if(!_.isEmpty(filter['blocked']))
      query.block = filter['blocked'];

    if(!_.isEmpty(period))
      query.where['status.timestamp_ms'] = {
        between: [
          new Date(new Date() - periodEnum[period]).getTime(),
          new Date().getTime()
        ]
      }

    if(!_.isEmpty(filter['has'])) {
      if(filter['has'].indexOf('media') > -1)
        query.where['status.entities.media.0'] = { exists: true };
      if(filter['has'].indexOf('url') > -1)
        query.where['status.entities.urls.0'] = { exists: true };
      if(filter['has'].indexOf('mention') > -1)
        query.where['status.entities.user_mentions.0'] = { exists: true };
      if(filter['has'].indexOf('geolocation') > -1)
        query.where['status.geo'] = { neq: null };
    }

    if(!_.isEmpty(filter['retweeted']))
      query.where['status.retweeted_status'] = { exists: (filter['retweeted'] === 'true') };

    if(!_.isEmpty(filter['with_tags'])) {
      query.where.and = _.isEmpty(query.where.and) ? [] : query.where.and;
      filter['with_tags'].forEach(function (tag) {
        query.where.and.push({ categories: tag });
      });
    }

    if(!_.isEmpty(filter['contain_tags'])) {
      query.where.or = [];
      filter['contain_tags'].forEach(function (tag) {
        query.where.or.push({ categories: tag });
      });
    }
    
    if(!_.isEmpty(filter['hashtags']))
      query.where['status.entities.hashtags.text'] = { in: filter['hashtags'] };

    if(!_.isEmpty(filter['mentions'])) {
      query.where['status.entities.user_mentions.screen_name'] = { in: [] };
      filter['mentions'].forEach(function (screenName) {
        query.where['status.entities.user_mentions.screen_name'].in.push(screenName);
      });
    }

    if(!_.isEmpty(filter['users']))
      query.where['status.user.screen_name'] = { in: filter['users'] };

    debug(`findByArgs.query: ${JSON.stringify(query)}`);

    TwitterTweet.find(query, function(err, result) {
      if (err) { 
        debug(`findByArgs.err: ${JSON.stringify(err)}`);
        return cb(err, null);
      }
      
      debug(`findByArgs.data: [object]`);
      return cb(null, result);
    });
  }

  TwitterTweet.countByArgs = function(period, filter, cb) {
    debug(`countByArgs.args.period: ${period}`);
    debug(`countByArgs.args.filter: ${JSON.stringify(filter)}`);
    
    filter = _.isEmpty(filter) ? {} : filter;
    ['with_tags', 'contain_tags', 'hashtags', 'mentions', 'users']
      .forEach(function (property) {
        filter[property] = dealWith('array', property, filter);
      });

    var query = {};

    if(!_.isEmpty(filter['blocked']))
      query.block = filter['blocked'];

    if(!_.isEmpty(period))
      query['status.timestamp_ms'] = {
        $gte: new Date(new Date() - periodEnum[period]).getTime(),
        $lte: new Date().getTime()
      }

    if(!_.isEmpty(filter['has'])) {
      if(filter['has'].indexOf('media') > -1)
        query['status.entities.media.0'] = { $exists: true };
      if(filter['has'].indexOf('url') > -1)
        query['status.entities.urls.0'] = { $exists: true };
      if(filter['has'].indexOf('mention') > -1)
        query['status.entities.user_mentions.0'] = { $exists: true };
      if(filter['has'].indexOf('geolocation') > -1)
        query['status.geo'] = { ne: null };
    }

    if(!_.isEmpty(filter['retweeted']))
      query['status.retweeted_status'] = { $exists: (filter['retweeted'] === 'true') };

    if(!_.isEmpty(filter['with_tags']))
      query['categories'] = { $all: filter['with_tags'] };

    if(!_.isEmpty(filter['contain_tags']))
      query['categories'] = { $in: filter['contain_tags'] };
    
    if(!_.isEmpty(filter['hashtags']))
      query['status.entities.hashtags.text'] = { $in: filter['hashtags'] };

    if(!_.isEmpty(filter['mentions']))
      query['status.entities.hashtags.text'] = { $in: filter['mentions'] };

    debug(`countByArgs.args.query: ${JSON.stringify(query)}`);
    
    return TwitterTweet.dao.mongodb.count(query, function(err, result) {
      if (err) { 
        debug(`countByArgs.err: ${JSON.stringify(err)}`); 
        return cb(err, null);
      }
      
      debug(`findByArgs.data: object`);
      return cb(null, { count: result });
    });
  }
};