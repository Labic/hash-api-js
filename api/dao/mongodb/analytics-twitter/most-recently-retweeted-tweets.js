var _ = require('../../../lib/underscoreExtended');

module.exports = function mostRecentlyRetweetedTweets(params, model, cb) { 
  var pipeline = [
    { $match: {
      'status.retweeted_status': { $exists: true },
      block: (params.filter.blocked || false) 
    } },
    { $limit: params.last },
    { $group: {
      _id: '$status.retweeted_status.id_str',
      status: { $last: '$status' },
      count: { $sum: 1 }
    } },
    { $sort: { 'status.timestamp_ms': -1 } },
    { $project: {
      _id: 0,
      status: '$status',
      count: '$count'
    } },
    { $limit: params.perPage * params.page },
    { $skip : (params.perPage * params.page) - params.perPage }
  ];

  if(params.filter.tags) {
    if(params.filter.tags.with)
      pipeline[0].$match['categories'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      pipeline[0].$match['categories'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    pipeline[0].$match['status.entities.user_mentions.screen_name'] = { $in: params.filter.mentions };

  if(params.filter.users)
    pipeline[0].$match['status.user.screen_name'] = { $in: params.filter.users };

  if(_.isBoolean(params.filter.blocked))
    pipeline[0].$match['block'] = params.filter.blocked;

  model.dao.mongodb.aggregate(pipeline, cb);
};