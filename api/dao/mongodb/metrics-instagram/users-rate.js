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

  var options = {
    query: query,
    finalize: function (key, reducedValue) {
      // TODO: Mongo bug/gambiarra
      // http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
      var ids = reducedValue.split(','),
          o = {}, 
          i, 
          count = 0;
      for (i = 0; i < ids.length; i += 1) o[ids[i]] = ids[i];
      for (i in o) count += 1;

      return count;
    },
    scope: { node: params.node },
    out: { inline: 1 }
  };

  if(params.granularity)
    options.scope.granularity = params.granularity.toUpperCase();

  model.dao.mongodb.mapReduce(
    function map() {
      if(node === 'media')
        var time = new Date(this.data.created_time * 1000);
      if(node === 'comment')
        var time = new Date(this.created_time * 1000);

      var daysInMonth = new Date(time.getDate(), time.getMonth(), 0).getDate();
      
      switch(granularity) {
        case 'PT15M':
          time.setMinutes((Math.round(time.getMinutes()/15) * 15) % 60);
          break;
        case 'PT30M':
          time.setMinutes((Math.round(time.getMinutes()/30) * 30) % 60);
          break;
        case 'P1H':
          time.setMinutes(0);
          break;
        case 'P6H':
          time.setHours((Math.round(time.getHours()/6) * 6) % 24);
          time.setMinutes(0);
          break;
        case 'P12H':
          time.setHours((Math.round(time.getHours()/12) * 12) % 24);
          time.setMinutes(0);
          break;
        case 'P1D':
          time.setHours(0);
          time.setMinutes(0);
          break;
        case 'P7D':
          time.setDate((Math.round(time.getDate()/7) * 7) % daysInMonth);
          time.setHours(0);
          time.setMinutes(0);
          break;
        case 'P15D':
          time.setDate((Math.round(time.getDate()/15) * 15) % daysInMonth);
          time.setHours(0);
          time.setMinutes(0);
          break;
        case 'P1M':
          time.setDate(0);
          time.setHours(0);
          time.setMinutes(0);
          break;
        default: // P1D
          time.setHours(0);
          time.setMinutes(0);
          break;
      }

      time.setSeconds(0);

      if(node === 'media')
        emit(time, this.data.user.id);
      if(node === 'comment')
        emit(time, this.user.id);
    },
    function reduce(key, values) {
      return values.toString();
    },
    options,
    function callback(err, result) {
      if (err) return cb(err, null);
      
      _.renameProperties(result, {_id: 'time', value: 'count'});
      return cb(null, result);
    });
}