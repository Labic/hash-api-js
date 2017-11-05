const format = require('util').format
const debug = require('debug')('hashapi:mongo:analytics:twitter:mostRetweetedTweets')

const _ = require('../../../lib/underscoreExtended');


module.exports = function mostRetweetedTweets(params, model, cb) { 
  debug(format('params=%j', params))

  let pipeline = [
    { $match: {
        'status.retweeted_status': { $exists: true },
        'status.timestamp_ms': {
          $gte: params.since.getTime(),
          $lte: params.until.getTime()
        },
      } },
    { $group: {
        _id: '$status.retweeted_status.id_str',
        status: { $first: '$status' },
        count: { $sum: 1 },
      } },
    { $sort: { count: -1 } },
    { $project: {
        _id: 0,
        status: '$status',
        count: '$count',
      } },
    { $limit: params.perPage * params.page },
    { $skip : (params.perPage * params.page) - params.perPage }
  ];

  let options = {
    allowDiskUse: true
  }

  if(params.filter.tags) {
    if(params.filter.tags.with)
      pipeline[0].$match['keywords'] = { $all: params.filter.tags.with };
    
    if(params.filter.tags.contains)
      pipeline[0].$match['keywords'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    pipeline[0].$match['status.entities.user_mentions.screen_name'] = { $in: params.filter.mentions };

  if(params.filter.users)
    pipeline[0].$match['status.user.screen_name'] = { $in: params.filter.users };

  if(_.isBoolean(params.filter.blocked))
    pipeline[0].$match['block'] = params.filter.blocked;

  if(!_.isBoolean(params.filter.quoted_status))
    pipeline[0].$match['status.quoted_status'] = { exists: (params.filter.quoted_status === 'true') };

  debug('schema="twitter-statuses:v1"')
  debug(format('pipeline=%j', pipeline))

  model.dao.mongodb.aggregate(pipeline, options, (err, data) => {
    cb(err, data)
  });
};