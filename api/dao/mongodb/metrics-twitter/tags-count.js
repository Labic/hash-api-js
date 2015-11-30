var _ = require('../../../lib/underscoreExtended');

module.exports = function tagsCount(params, model, cb) { 
  var query = { 
    'status.timestamp_ms': {
      $gte: params.since.getTime(),
      $lte: params.until.getTime()
    }
  };

  if(params.filter.tags) {
    if(params.filter.tags.with)
      query['categories'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      query['categories'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    query['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    query['status.entities.user_mentions.screen_name'] = { $in: params.filter.mentions };

  if(params.filter.users)
    query['status.user.screen_name'] = { $in: params.filter.users };

  if(params.filter.retweeted)
    query['status.retweeted_status'] = { $exists: params.filter.retweeted };
  
  model.dao.mongodb.mapReduce(
    function map() {
      if (this.categories)
        for (var i = 0; i < this.categories.length; i++) {
          var tag = this.categories[i].trim();
          
          if (tag.indexOf('territorio-') > -1)
            tag = ''.concat('BR.', tag.substring(11, 14).toUpperCase());
          // TODO: Eleminar isso no futuro
          if (tag.indexOf('terrritorio-') > -1)
            tag = ''.concat('BR.', tag.substring(12, 14).toUpperCase());
          
          emit(tag, 1);
        }
    },
    function reduce(key, values) {
      return Array.sum(values);
    },{
      query: query,
      out: { inline: 1 }
    },
    function callback(err, result) {
      if (err) return cb(err, null);

      _.renameProperties(result, {_id: 'tag', value: 'count'});
      return cb(null, _.sortBy(result, 'count').reverse());
    });
}