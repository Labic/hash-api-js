const format = require('util').format
const debug = require('debug')('hashapi:twitter:analytics:mongo:mostCommonTerms')

const _ = require('../../../lib/underscoreExtended');

module.exports = function mostCommonTerms(params, model, cb) { 
  let text_terms_field = '$status.text_terms'

  let pipeline = [
    { $match: {
        'status.timestamp_ms': {
          $gte: params.since.getTime(),
          $lte: params.until.getTime()
        },
      } },
    { $unwind: text_terms_field },
    { $group: {
        _id: text_terms_field ,
        count: { $sum: 1 },
      } },
    { $sort: { count: -1 } },
    { $project: {
        _id: 0,
        key: '$_id',
        doc_count: '$count',
      } },  
    { $limit: params.perPage * params.page }, 
    { $skip : (params.perPage * params.page) - params.perPage } 
  ];

  const options = {
    allowDiskUse: true
  }

  if (params.filter.tags) {
    if (params.filter.tags.with)
      pipeline[0].$match['keywords'] = { $all: params.filter.tags.with };
    
    if (params.filter.tags.contains)
      pipeline[0].$match['keywords'] = { $in: params.filter.tags.contains };
  }

  if (params.filter.hashtags)
    pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if (params.filter.mentions)
    pipeline[0].$match['status.entities.user_mentions.screen_name'] = { $in: params.filter.mentions };

  if (params.filter.users)
    pipeline[0].$match['status.user.screen_name'] = { $in: params.filter.users };

  if (_.isBoolean(params.filter.retweeted)) {
    pipeline[0].$match['status.retweeted_status'] = { $exists: params.filter.retweeted };
    
    if (params.filter.retweeted === true)
      text_terms_field = '$status.retweeted_status.text_terms';
  }

  if(_.isBoolean(params.filter.quoted_status)) {
    pipeline[0].$match['status.quoted_status'] = { $exists: params.filter.quoted_status };
    
    if (params.filter.quoted_status === true)
      text_terms_field = '$status.quoted_status.text_terms';
  }

  if (_.isBoolean(params.filter.blocked))
    pipeline[0].$match['block'] = params.filter.blocked;
  
  debug(format('pipeline=%j', pipeline))

  model.dao.mongodb.aggregate(pipeline, options, cb);
}
