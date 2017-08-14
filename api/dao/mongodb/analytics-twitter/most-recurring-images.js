var _ = require('../../../lib/underscoreExtended');

module.exports = function mostSharedImages(params, model, cb) { 
  var pipeline = [
    { $match: {
      'status.entities.media.0': { $exists: true },
      'status.timestamp_ms': {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      },
      // block: (params.filter.blocked || false) 
    } },
    { $sort: { 'status.timestamp_ms': -1 } },
    { $unwind: '$status.entities.media' },
    { $group: {
      _id: '$status.entities.media.media_url_https',
      status_id_str: { $first: '$status.id_str' },
      status_text: { $first: '$status.text' },
      user_id_str: { $first: '$status.user.id_str' },
      user_screen_name: { $first: '$status.user.screen_name' },
      user_profile_image_url_https: { $last: '$status.user.profile_image_url_https' },
      count: { $sum: 1 }
    } },
    { $sort: { count: -1 } },
    { $project: {
      _id: 0,
      id_str: '$status_id_str',
      text: '$status_text',
      user: {
        id_str: '$user_id_str',
        screen_name: '$user_screen_name',
        profile_image_url_https: '$user_profile_image_url_https'
      },
      media_url_https: '$_id', 
      // TODO: Back to this schema in the future
      // status: {
      //   id_str: '$status_id_str',
      //   text: '$status_text',
      //   entities: {
      //     media: { 
      //       media_url_https: '$_id' 
      //     }
      //   },
      //   user: {
      //     id_str: '$user_id_str',
      //     screen_name: '$user_screen_name',
      //     profile_image_url_https: '$user_profile_image_url_https'
      //   }
      // },
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

  if(params.filter.retweeted)
    query.where['status.retweeted_status'] = { $exists: params.filter.retweeted };

  if(_.isBoolean(params.filter.blocked))
    pipeline[0].$match['block'] = params.filter.blocked;

  model.dao.mongodb.aggregate(pipeline, cb);
};