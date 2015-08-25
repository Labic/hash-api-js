var _ = require('underscore');
// ISSUE: Implement async
// ISSUE: Implement mommentjs?
/* 
ISSUE: Implement [cacheman-mongo](https://github.com/cayasso/cacheman-mongo)
TIPS:
- Loopback memory datasource (What mode name?)
*/

module.exports = function(Tweet) {

  Tweet.top = function(topType, filter, responseCallback) {
    filter.limit = (filter.limit || 25);
    filter.skip = (filter.skip || 0);
    
    var errors = [];

    if (_.isEmpty(filter.where['status.created_at'])) {
      errors.push(new Error('Must have status.created_at'));
    } else {
      if (!_.isEmpty(filter.where['status.created_at'].gte)) {
        filter.where['status.created_at'].gte = new Date(
          filter.where['status.created_at'].gte
        )

        if (!_.isDate(filter.where['status.created_at'].gte))
          errors.push(new Error('status.created_at.gte not is a valid date'));
      } else {
        errors.push(new Error('Must have status.created_at.gte'));
      }

      if (!_.isEmpty(filter.where['status.created_at'].lte)) {
        filter.where['status.created_at'].lte = new Date(
          filter.where['status.created_at'].lte
        )

        if (!_.isDate(filter.where['status.created_at'].lte))
          errors.push(new Error('status.created_at.lte not is a valid date'));
      } else {
        errors.push(new Error('Must have status.created_at.lte'));
      }
    }

    if (!_.isEmpty(filter.where.theme))
      if (!_.isString(filter.where.theme))
        errors.push(new Error('filter.where.theme must be a string'));

    if (!_.isEmpty(filter.where.categories))
      if (!_.isArray(filter.where.categories.inq))
        errors.push(new Error('filter.where.categories must be a array'));

    if (errors.length > 0) return responseCallback(errors[0]);

    var aggregate = null;

    switch (topType) {
      case 'retweet':
        aggregate = [
          { $match: {
            'status.retweeted_status': { $exists: true}
          } },
          { $group: {
            _id: { id_str: '$status.retweeted_status.id_str' },
            status: { $last: '$status' },
            count: { $sum: 1 }
          } },
          { $sort: { count: -1 } },
          { $project: {
            _id: '$status.id_str',
            status: '$status',
            count: '$count'
          } }
        ];
        
        break;

      case 'mention': 
        aggregate = [
          { $match: {
            'status.entities.user_mentions.0': { $exists: true } 
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
          } }
        ];

        break;

      case 'url':
        aggregate = [
          { $match: {
            'status.entities.urls.0': { $exists: true }
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
          } }
        ];
      
        break;

      case 'image':
        aggregate = [
          { $match: {
            'status.entities.media.0': { $exists: true }
          } },
          { $unwind: '$status.entities.media' },
          { $group: {
            _id: '$status.entities.media',
            count: { $sum: 1 }
          } },
          { $sort: { count: -1 } },
          { $project: {
            _id: 0,
            media_url_https: '$_id.media_url_https',
            count: '$count'
          } }
        ];
      
        break;

      case 'user':
        aggregate = [ 
          { $match: {
            'status.user.screen_name': { $exists: true }
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
          } }
        ];

        break;

      case 'hashtag':
        aggregate = [
          { $match: {
            'status.entities.hashtags.0': { $exists: true }
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
          } }
        ];
      
        break;

      default:
        return responseCallback(new Error(
          'Invalid type, select one of this: retweet, mention, url, image, user or hashtag'
        ));
    }

    aggregate[0].$match['status.timestamp_ms'] = {
      $gte: filter.where['status.created_at'].gte.getTime(),
      $lte: filter.where['status.created_at'].lte.getTime()
    };

    if (!_.isEmpty(filter.where.theme)) 
      aggregate[0].$match['theme'] = filter.where.theme;

    if (!_.isEmpty(filter.where.categories))
      aggregate[0].$match['categories'] = { 
        $in: filter.where.categories.inq
      };

    aggregate.push(
      { $limit: filter.limit },
      { $skip : filter.skip }
    );

    console.log(topType);
    console.log(filter);
    console.log('%j', aggregate);
    
    Tweet.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Tweet.settings.mongodb.collection);
      // TODO: Review [MongoDB security tips](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)
      collection.aggregate(aggregate, function(e0rr, result) {
        // ISSUE: Implement next page
        // ISSUE: Implement mongodb "verbose" output
        if (err) return responseCallback(err);
        responseCallback(null, result);
      });
    });
  }

  Tweet.remoteMethod('top', {
    accepts: [
      {arg: 'type', type: 'string', required: true },
      {arg: 'filter', type: 'object', http: { source: 'query' }, required: true}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/top', verb: 'get'}
  });
};