var _ = require('../../../lib/underscoreExtended');

module.exports = function mostMentionedUsers(params, model, cb) {
  var pipeline = [
    { $match: {
      'status.entities.user_mentions.0': { $exists: true },
      'status.timestamp_ms': {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      },
      // block: (params.filter.blocked || false)
    } },
    { $unwind: '$status.entities.user_mentions' },
    { $group: {
      _id: '$status.entities.user_mentions.id_str',
      screen_name: { $last: '$status.entities.user_mentions.screen_name' },
      profile_image_url_https: { $last: '$status.entities.user_mentions.profile_image_url_https' },
      count: { $sum: 1 }
    } },
    { $sort: { count: -1 } },
    { $project: {
      _id: 0,
      id_str: '$_id',
      screen_name: '$screen_name',
      profile_image_url_https: '$profile_image_url_https',
      count: '$count'
    } },
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
    pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    pipeline[0].$match['status.entities.user_mentions.screen_name'] = { $in: params.filter.mentions };

  if(params.filter.users)
    pipeline[0].$match['status.user.screen_name'] = { $in: params.filter.users };

  if(params.filter.retweeted)
    pipeline[0].$match['status.retweeted_status'] = { $exists: params.filter.retweeted };

  if(_.isBoolean(params.filter.blocked))
    pipeline[0].$match['block'] = params.filter.blocked;

  model.dao.mongodb.aggregate(pipeline, cb);
};
