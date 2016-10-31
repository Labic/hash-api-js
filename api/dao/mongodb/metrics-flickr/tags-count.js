var _ = require('../../../lib/underscoreExtended');

module.exports = function tagsCount(params, model, cb) {
  var query = {
    'dates.posted': {
      $gte: (params.since.getTime() / 1000).toFixed(),
      $lte: (params.until.getTime() / 1000).toFixed(),
    }
  };

  query['tags.tag.0'] = { $exists: true };

  if(params.filter.tags) {
    if(params.filter.tags.with)
      query['tags.tag._content'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      query['tags.tag._content'] = { $in: params.filter.tags.contains };
  }

  console.log(query);

  model.dao.mongodb.mapReduce(
    function map() {
      if (this.tags)
        for (var i = 0; i < this.tags.tag.length; i++) {
          var tag = this.tags.tag[i]._content.trim();
          // var tag = {
          //   slug: this.tags.tag[i]._content.trim(),
          //   name: this.tags.tag[i].raw.trim()
          // }

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
