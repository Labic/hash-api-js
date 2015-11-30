var _ = require('../../../lib/underscoreExtended');

module.exports = function interactionsRate(params, model, cb) { 
  var query = {};

  switch(params.node) {
    case 'media':
      query['data.created_time'] = {
        $gte: params.since.getTime() / 1000,
        $lte: params.until.getTime() / 1000
      };

      if(params.filter.hashtags)
        query['data.tags'] = { $in: params.filter.hashtags };

      if(params.filter.mentions)
        query['data.users_in_photo.user.id'] = { $in: params.filter.mentions };

      if(params.filter.users)
        query['data.user.id'] = { $in: params.filter.users };

      if(params.filter.types)
        query['data.type'] = { $in: params.filter.types };
      break;
    case 'comment':
      query['created_time'] = {
        $gte: params.since.getTime() / 1000,
        $lte: params.until.getTime() / 1000
      };

      if(params.filter.users)
        query['from.id'] = { $in: params.filter.users };

      if(params.filter.medias)
        query['media_id'] = { $in: params.filter.medias };
      break;
  }

  if(params.filter.tags) {
    if(params.filter.tags.with)
      query['categories'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      query['categories'] = { $in: params.filter.tags.contains };
  }

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
      
      _.renameProperties(result, {_id: 'time', value: 'count'});
      return cb(null, result);
    });
}