module.exports = function mostActiveProfiles(params, model, cb) { 
  var pipeline = [
    { $match: { 
      'from.id': { $ne: null },
      'from.name': { $ne: null },
      created_time_ms: {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      }
    } },
    { $group: {
      _id: '$from.id',
      from_name: { $last: '$from.name' },
      posts_count: { $sum: 1 }
    } },
    { $project: { 
        _id: 0,
        from: {
          id: '$_id',
          name: '$from_name'
        },
        count: '$posts_count'
    } }, 
    { $sort: { count: -1 } },
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