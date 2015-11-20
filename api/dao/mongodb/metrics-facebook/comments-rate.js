var _ = require('../../../lib/underscoreExtended');

module.exports = function commentsRate(params, model, cb) { 
  var query = { 
    'created_time_ms': {
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

  if(params.filter.profiles)
    query['from.id'] = { $in: params.filter.profiles };

  var options = {
    query: query,
    out: { inline: 1 }
  };

  if(params.granularity)
    options.scope = { granularity: params.granularity.toUpperCase() };

  model.dao.mongodb.mapReduce(
    function map() {
      var time = this.created_time;
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

      emit(time, 1);
    },
    function reduce(key, values) {
      return Array.sum(values);
    },
    options,
    function callback(err, result) {
      if (err) return cb(err, null);
      
      _.renameProperties(result, {_id: 'time', value: 'count'});
      return cb(null, result);
    });
}
    