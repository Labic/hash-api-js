var _ = require('../../../lib/underscoreExtended');

module.exports = function mostActiveUsers(params, model, cb) { 
  var pipeline = [ 
    { $match: {
      'data.created_time': {
        $gte: params.since.getTime() / 1000,
        $lte: params.until.getTime() / 1000
      }
    } },
    { $group: {
      _id: '$data.user.id',
      username: { $last: '$data.user.username' },
      count: { $sum: 1 }
    } },
    { $sort: { count: -1 } },
    { $project: {
      _id: 0,
      data: {
        user: { 
          username: '$username' 
        }
      },
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
    pipeline[0].$match['data.tags'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    pipeline[0].$match['data.users_in_photo.user.username'] = { $in: params.filter.mentions };

  if(params.filter.users)
    pipeline[0].$match['data.user.username'] = { $in: params.filter.users };

  if(params.filter.mediaType)
    query['data.type'] = { $in: params.filter.mediaType };

  model.dao.mongodb.aggregate(pipeline, cb);
};