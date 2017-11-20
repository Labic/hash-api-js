module.exports = function mostRecurringImages(params, model, cb) {
  var pipeline = [
    { $match: {
      'full_picture': { $ne: 'null' },
      created_time_ms: {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      }
    } },
    { $sort: { 'full_picture': -1 } },
    { $group: {
      _id: '$full_picture',
      id: { $first: '$_id' },
      description: { $first: '$description' },
      message: { $first: '$message' },
      name: { $first: '$name' },
      likes_count: { $sum: '$likes_count' },
      count: { $sum: 1 }
    } },
    { $project: {
        _id: 0,
        id: '$id',
        full_picture: '$_id',
        description: '$description',
        message: '$message',
        likes_count: '$likes_count',
        name: '$name',
        count: '$count'
    } },
    { $sort: { count: -1 } },
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
    pipeline[0].$match['hashtags'] = { $in: params.filter.hashtags };

  if(params.filter.mentions) {
    query['message_tags.id'] = { $in: params.filter.mentions };
    query['with_tags.id'] = { $in: params.filter.mentions };
  }

  if(params.filter.profiles)
    pipeline[0].$match['from.id'] = { $in: params.filter.profiles };

  if (params.filter.types)
    pipeline[0].$match['type'] = { $in: params.filter.types };

  model.dao.mongodb.aggregate(pipeline, options, cb);
};
