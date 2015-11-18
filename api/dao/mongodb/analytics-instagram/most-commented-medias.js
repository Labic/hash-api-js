module.exports = function mostCommentedMedia(params, model, cb) { 
  var query = {
    'data.created_time': {
      $gte: params.since.getTime() / 1000,
      $lte: params.until.getTime() / 1000
    }
  }

  var options = {
    sort: [ [ 'data.comments.count', -1 ] ],
    limit: params.perPage * params.page,
    skip: (params.perPage * params.page) - params.perPage
  }

  if(params.filter.tags) {
    if(params.filter.tags.with)
      query['categories'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      query['categories'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    query['data.tags'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    query['data.users_in_photo.user.username'] = { $in: params.filter.mentions };

  if(params.filter.users)
    query['data.user.username'] = { $in: params.filter.users };

  if(params.filter.type)
    query['data.type'] = { $in: params.filter.type };

  model.dao.mongodb.find(query, options, cb);
};