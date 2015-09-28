module.exports = function(FacebookPost) {
  FacebookPost.analytics = function(type, cb) {

    return cb(null, type);

    var filter = {
      where: {
        created_time: {
          gte: filter.since.getTime(),
          lte: filter.until.getTime()
        },
      }
    };

    switch (type) {
      case 'top_posts':
        FacebookPost.find(filter, cb);
        break;
      case 'top_profiles':
        FacebookPost.aggregate(pipelines[type], cb);
        break;
      case 'top_links':
        FacebookPost.aggregate(pipelines[type], cb);
        break;
    }
  }

  FacebookPost.remoteMethod('analytics', {
    accepts: [
      { arg: 'type', type: 'string', required: true },
      // {arg: 'since', type: 'date', required: true },
      // {arg: 'until', type: 'date', required: true },
      // {arg: 'hashtags', type: 'string' },
      // {arg: 'tags', type: 'string' }
    ],
    returns: {type: 'object', root: true},
    http: {path: '/analytics/:type', verb: 'get'}
  });
};

var pipelines = {};
pipelines['top_profiles'] = [
  { $match: { } },
  { $group: {
    _id: { id_str: '$from' },
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    profile: '$_id',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['top_likes'] = [];

pipelines['top_shares'] = [];

pipelines['top_comments'] = [];

pipelines['top_hashtags'] = [];

pipelines['top_mentions'] = [];

pipelines['top_links'] = [
  { $match: { } },
  { $group: {
    _id: { id_str: '$link' },
    name: { $last: '$name' },
    caption: { $last: '$caption' },
    description: { $last: '$description' },
    picture: { $last: '$picture' },
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    name: '$name',
    caption: '$caption',
    description: '$description',
    picture: '$picture',
    url: '$_id',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];