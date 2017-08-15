var _ = require('../../../lib/underscoreExtended');

module.exports = function mostLikedComments(params, model, cb) { 
  var query = {
    'created_time_ms': {
      $gte: params.since.getTime(),
      $lte: params.until.getTime()
    }
  }

  var options = {
    sort: [['like_count', -1]],
    limit: params.perPage * params.page,
    skip: (params.perPage * params.page) - params.perPage
  }

  if(params.filter.tags) {
    if(params.filter.tags.with)
      query['keywords'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      query['keywords'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.profiles)
    query['from.id'] = { $in: params.filter.profiles };

  if(params.filter.posts)
    query['post_id'] = { $in: params.filter.posts };

  model.dao.mongodb.find(query, options, function (err, result) {
    if(err) return cb(err, null);

    _.renameProperties(result, {'_id': 'id'});
    cb(null, result);
  });
};