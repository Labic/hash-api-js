var _ = require('underscore');

module.exports = function(Tweet) {
  /**
   * Add analytics capabilities of tweets using MongoDB pipelines
   * 
   * @mixin
   * @requires  module:underscore
   * @tutorial  [Loopback - Defining mixins]{@link https://docs.strongloop.com/display/public/LB/Defining+mixins}
   * @enum      {string} type - TOP_RETWEETS, TOP_MENTIONS, TOP_URLS, TOP_IMAGES, TOP_USERS, TOP_HASHTAGS, RETWEET_COUNT, CATEGORIES_COUNT
   * @param     {Object} filter - JSOM filter model
   * @callback  {requestCallback} cb - Callback that handles the response
   */
  Tweet.analytics.mongodb = function(type, filter, cb) {
    console.log('type: %s', type);
    console.log('filter: %j', filter);
    console.log('pipeline: %j', pipelines[type]);
    
    if (pipelines[type])
      var pipeline = pipelines[type];
    else 
      return cb(new Error('Invalid type parameter'));

    var error = validateFilter(filter);
    if (error) return cb(error);

    extendPipeline(pipeline, filter);
    console.log(require('util').inspect(pipeline, false, null));

    Tweet.aggregate(pipeline, cb);
  }
}

function validateFilter(filter) {
  var errors = [];

  if (_.isEmpty(filter.where)) {
    errors.push(new FilterError('Malformed Filter Propretie: Must have "where"'));
  } else if (_.isEmpty(filter.where['status.created_at'])) {
    errors.push(new FilterError('Malformed Filter Propretie: Must have "where.status.created_at"'));
  } else {
    if (!_.isEmpty(filter.where['status.created_at'].gte)) {
      filter.where['status.created_at'].gte = new Date(
        filter.where['status.created_at'].gte
      )

      if (!_.isDate(filter.where['status.created_at'].gte))
        errors.push(new FilterError('Malformed Filter Propretie: "where.status.created_at.gte" not is a valid date'));
    } else {
      errors.push(new FilterError('Malformed Filter Propretie: Must have "where.status.created_at.gte"'));
    }

    if (!_.isEmpty(filter.where['status.created_at'].lte)) {
      filter.where['status.created_at'].lte = new Date(
        filter.where['status.created_at'].lte
      )

      if (!_.isDate(filter.where['status.created_at'].lte))
        errors.push(new FilterError('Malformed Filter Propretie: "where.status.created_at.lte" not is a valid date'));
    } else {
      errors.push(new FilterError('Malformed Filter Propretie: Must have "where.status.created_at.lte"'));
    }

    if (!_.isEmpty(filter.where.theme))
      if (!_.isString(filter.where.theme))
        errors.push(new FilterError('Malformed Filter Propretie: "where.theme" must be a string'));

    if (!_.isEmpty(filter.where.categories))
      if (!_.isArray(filter.where.categories.inq) && !_.isArray(filter.where.categories.all)) {
        errors.push(new FilterError('Malformed Filter Propretie: "where.categories.inq" or "where.categories.all" must be a array'));
      }
  }

  return (errors.length > 0) ? errors[0] : null;
}

function extendPipeline(pipeline, filter) {
  filter.limit = (filter.limit || 25);
  filter.skip = (filter.skip || 0);

  pipeline[0].$match['status.timestamp_ms'] = {
    $gte: filter.where['status.created_at'].gte.getTime(),
    $lte: filter.where['status.created_at'].lte.getTime()
  };

  if (!_.isEmpty(filter.where.theme)) 
    pipeline[0].$match['theme'] = filter.where.theme;

  if (!_.isEmpty(filter.where['status.entities.hashtags.text'])) 
    if (!_.isEmpty(filter.where['status.entities.hashtags.text'].inq))
      pipeline[0].$match['status.entities.hashtags.text'] = {
        $in: filter.where['status.entities.hashtags.text'].inq
      }

  if (!_.isEmpty(filter.where.categories)) {
    if (filter.where.categories.all) {
      pipeline[0].$match['categories'] = {};
      pipeline[0].$match['categories'].$all = [];
      _.each(filter.where.categories.all, function(categorie) {
        pipeline[0].$match['categories'].$all.push(new RegExp(categorie));
      });
    } else if (filter.where.categories.inq) {
      pipeline[0].$match['categories'] = {};
      pipeline[0].$match['categories'].$in = [];
      _.each(filter.where.categories.inq, function(categorie) {
        pipeline[0].$match['categories'].$in.push(new RegExp(categorie));
      });
    }
  }

  pipeline[pipeline.length-2].$limit = filter.limit;
  pipeline[pipeline.length-1].$skip = filter.skip;
}

var pipelines = {};
pipelines['top-retweets'] = 
[
  { $match: {
    'status.retweeted_status': { $exists: true}
  } },
  { $group: {
    _id: '$status.retweeted_status.id_str',
    status: { $last: '$status' },
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    status: '$status',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['top-mentions'] = [
  { $match: {
    'status.entities.user_mentions.0': { $exists: true } 
  } },
  { $unwind: '$status.entities.user_mentions' },
  { $group: {
    _id: '$status.entities.user_mentions.screen_name',
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    screen_name: '$_id',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['top-urls'] = [
  { $match: {
    'status.entities.urls.0': { $exists: true }
  } },
  { $unwind: '$status.entities.urls' },
  { $group: {
    _id: '$status.entities.urls.expanded_url',
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    url: '$_id',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['top-images'] = [
  { $match: {
    'status.entities.media.0': { $exists: true }
  } },
  { $unwind: '$status.entities.media' },
  { $group: {
    _id: '$status.entities.media.media_url_https',
    status_text: { $last: '$status.text' },
    user_id_str: { $last: '$status.user.id_str' },
    user_screen_name: { $last: '$status.user.screen_name' },
    user_profile_image_url_https: { $last: '$status.user.profile_image_url_https' },
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    media_url_https: '$_id',
    text: '$status_text',
    user: {
        id_str: '$user_id_str',
        screen_name: '$user_screen_name',
        profile_image_url_https: '$user_profile_image_url_https'
    },
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['top-users'] = [ 
  { $match: {
    'status.user.screen_name': { $exists: true }
  } },
  { $group: {
    _id: '$status.user.screen_name',
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    screen_name: '$_id',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['top-hashtags'] = [
  { $match: {
    'status.entities.hashtags.0': { $exists: true }
  } },
  { $unwind: '$status.entities.hashtags' },
  { $group: {
    _id: '$status.entities.hashtags.text',
    count: { $sum: 1 }
  } },
  { $sort: { count: -1 } },
  { $project: {
    _id: 0,
    hashtag: '$_id',
    count: '$count'
  } },
  { $limit: null },
  { $skip : null }
];

pipelines['retweets-count'] = [ 
  { $match: { 
    'status.retweeted_status': { $exists: true}
  } }, 
  { $group: { 
      _id: '$status.retweeted_status.id_str', 
      retweets_count: { $sum: 1 } 
  } }, 
  { $group : { 
      _id : '$retweets_count',
      count: { $sum: 1 } 
  } }, 
  { $project: { 
      _id: 0, 
      retweets_count:'$_id', 
      count: '$count' 
  } }, 
  { $sort: { retweets_count: -1 } },
  { $limit: null },
  { $skip : null }
];

pipelines['categories-count'] = [
  { $match: { } },
  { $unwind: '$categories' },
  { $match: { } },
  { $group: {
    _id: '$categories',
    categorie_count: { $sum: 1 }
  } },
  { $project: { 
      _id: 0,
      slug: '$_id',
      count: '$categorie_count'
  } }, 
  { $sort: { count: -1 } },
  { $limit: null },
  { $skip : null }
];

function FilterError(message) {
  this.name = 'Bad Request';
  this.status = 400
  this.message = message;
  this.stack = (new Error()).stack;
}
FilterError.prototype = new Error;