var _ = require('../../../lib/underscoreExtended');

module.exports = function topWordsTweets(params, model, cb) { 
  var query = { 
    'status.timestamp_ms': {
      $gte: params.since.getTime(),
      $lte: params.until.getTime()
    }
  };

  if(params.filter.tags) {
    if(params.filter.tags.with)
      query['keywords'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      query['keywords'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    query['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    query['status.entities.user_mentions.screen_name'] = { $in: params.filter.mentions };

  if(params.filter.users)
    query['status.user.screen_name'] = { $in: params.filter.users };

  if(params.filter.retweeted)
    query['status.retweeted_status'] = { $exists: params.filter.retweeted };

  if(_.isBoolean(params.filter.blocked))
    query['block'] = params.filter.blocked;

  var options = {
    query: query,
    // finalize: function (key, reducedValue) {
    //   // TODO: Mongo bug/gambiarra
    //   // http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
    //   var ids = reducedValue.split(','),
    //       o = {}, 
    //       i, 
    //       count = 0;
    //   for (i = 0; i < ids.length; i += 1) o[ids[i]] = ids[i];
    //   for (i in o) count += 1;

    //   return count;
    // },
    out: { inline: 1 }
  };

  if(params.granularity)
    options.scope = { granularity: params.granularity.toUpperCase() };

  model.dao.mongodb.mapReduce(
    function map() {
      var time = this.status.created_at;
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

      var words = this.status.text
        .replace(/\r|\n|\/|\\n/, ' ')
        .toLowerCase().split(' '); 
      for (var i = words.length - 1; i >= 0; i--) {
        var word = words[i]
          // .replace(/\".|\"..|,|:|\?|\(|\)|...|..|!/, '')
          .replace(/[?!:)("'*+]|/, '')
          .trim();

        if(word)
          emit(word, 1);
      }
    },
    function reduce(key, values) {
      var count = 0;    
      
      values.forEach(function(value) {            
        count += value;    
      });

      return count;
    },
    options,
    function callback(err, result) {
      if (err) return cb(err, null);
      
      _.renameProperties(result, {_id: 'name', value: 'count'});
      result = result.sort((a, b) => { return a.value - b.value })
      return cb(null, result);
    });
}
