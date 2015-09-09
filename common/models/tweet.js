var _ = require('underscore');
// ISSUE: Implement async
// ISSUE: Implement mommentjs?
/* 
ISSUE: Implement [cacheman-mongo](https://github.com/cayasso/cacheman-mongo)
TIPS:
- Loopback memory datasource (What mode name?)
*/

module.exports = function(Tweet) {

  Tweet.analytics = function(type, filter, responseCallback) {
    filter.limit = (filter.limit || 25);
    filter.skip = (filter.skip || 0);
    
    console.log('type: %s', type);
    console.log('filter: %j', filter);
    
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

    switch (type) {
      case 'top-retweets':
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

      case 'top-mentions': 
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

      case 'top-urls':
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

      case 'top-images':
        aggregate = [
          { $match: {
            'status.entities.media.0': { $exists: true }
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
            media_url_https: '$_id',
            text: '$status_text',
            user: {
                id_str: '$user_id_str',
                screen_name: '$user_screen_name',
                profile_image_url_https: '$user_profile_image_url_https'
            },
            count: '$count'
          } }
        ];
      
        break;

      case 'top-users':
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

      case 'top-hashtags':
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

      case 'retweet-count':
        var aggregate = [ 
          { $match: { 
            'status.retweeted_status': { $exists: true}
          } }, 
          { $group: { 
              _id: '$status.retweeted_status.id_str', 
              retweets_count: { $sum: 1 } 
          } }, 
          { $group : { 
              _id : '$retweets_count',
              count: { $sum: 1 } 
          } }, 
          { $project: { 
              _id: 0, 
              retweets_count:'$_id', 
              count: '$count' 
          } }, 
          { $sort: { retweets_count: -1 } } 
        ];
        
        break;

      case 'categories-count':
        var aggregate = [
          { $match: { } },
          { $unwind: '$categories' },
          { $match: { } },
          { $group: {
            _id: '$categories',
            categorie_count: { $sum: 1 }
          } },
          { $project: { 
              _id: 0,
              categorie: '$_id',
              count: '$categorie_count'
          } }, 
          { $sort: { count: -1 } } 
        ];

        if (!_.isEmpty(filter.where.categories)) {
          aggregate[2].$match['categories'] = 
            new RegExp(filter.where.categories.inq.join('|'), 'i');
        }

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

    if (!_.isEmpty(filter.where.categories)) {
      aggregate[0].$match['categories'] = {};
      aggregate[0].$match['categories'].$in = [];
      _.each(filter.where.categories.inq, function(categorie) {
        aggregate[0].$match['categories'].$in.push(new RegExp(categorie));
      });
    }

    aggregate.push(
      { $limit: filter.limit },
      { $skip : filter.skip }
    );
    
    console.log(require('util').inspect(aggregate, false, null));

    _aggregate(aggregate, responseCallback);
  }

  Tweet.remoteMethod('analytics', {
    accepts: [
      {arg: 'type', type: 'string', required: true },
      {arg: 'filter', type: 'object', http: { source: 'query' }, required: true}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/analytics', verb: 'get'}
  });  

  function _aggregate(aggregate, callback) {
    Tweet.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Tweet.settings.mongodb.collection);
      // TODO: Review [MongoDB security tips](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)
      collection.aggregate(aggregate, function(err, result) {
        // ISSUE: Implement next page
        // ISSUE: Implement mongodb "verbose" output
        if (err) return callback(err);
        callback(null, result);
      });
    });

  }
};