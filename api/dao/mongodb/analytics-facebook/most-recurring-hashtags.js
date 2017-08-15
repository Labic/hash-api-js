module.exports = function mostRecurringHashtags(params, model, cb) {
  var pipeline = [
    { $match: {
      'hashtags.0': { $exists: true },
      created_time_ms: {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      }
    } },
    { $unwind: '$hashtags' },
    { $group: {
      _id: '$hashtags',
      // _id: {  $toLower: '$hashtags'},
      count: { $sum: 1 }
    } },
    { $project: {
      _id: 0,
      hashtag: '$_id',
      count: '$count'
    } },
    { $sort: { count: -1 } },
    { $limit: params.perPage * params.page },
    { $skip : (params.perPage * params.page) - params.perPage }
  ];

  if(params.filter.tags) {
    if(params.filter.tags.with)
      pipeline[0].$match['keywords'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      pipeline[0].$match['keywords'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    pipeline[0].$match['hashtags'] = { $in: params.filter.hashtags };

  if(params.filter.mentions) {
    query['message_tags.id'] = { $in: params.filter.mentions };
    query['with_tags.id'] = { $in: params.filter.mentions };
  }

  if(params.filter.profiles)
    pipeline[0].$match['from.id'] = { $in: params.filter.profiles };

  if (params.filter.types)
    pipeline[0].$match['type'] = { $in: params.filter.types };

  model.dao.mongodb.aggregate(pipeline, cb);
};
