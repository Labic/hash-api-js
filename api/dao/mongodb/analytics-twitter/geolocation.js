var _ = require('../../../lib/underscoreExtended');

module.exports = function geolocation(params, model, cb) { 
  var pipeline = [
    { $match: {
      $or: [ { 'status.geo': { $ne: null } }, 
             { 'city_geo': { $exists: true } } ],
      'status.timestamp_ms': {
        $gte: params.since.getTime(),
        $lte: params.until.getTime()
      },
      block: (params.filter.blocked || false) 
    } },
    format['geojson'][0],
    format['geojson'][1]
  ];

  if(params.filter.tags) {
    if(params.filter.tags.with)
      pipeline[0].$match.categories = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      pipeline[0].$match.categories = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    pipeline[0].$match['status.entities.hashtags.text'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    pipeline[0].$match['status.entities.screen_name'] = { $in: params.filter.mentions };

  if(params.filter.users)
    pipeline[0].$match['status.user.screen_name'] = { $in: params.filter.users };

  if(params.filter.retweeted)
    pipeline[0].$match['status.retweeted_status'] = { $exists: params.filter.retweeted };

  if(_.isBoolean(params.filter.blocked))
    pipeline[0].$match.block = params.filter.blocked;

  // TODO: Implement geojson-flatten for GeoJSON format result
  model.dao.mongodb.aggregate(pipeline, function (err, result) {
    if(err) return cb(err, null);

    if(result) {
      result[0].bbox = [7, 7, -31, -31];
      result[0].type = 'Feature';
      result[0].geometry.type = 'MultiPoint';
      for (var i = 0; i < result[0].geometry.coordinates.length; i++) {
        var coordinate = result[0].geometry.coordinates[i];
        result[0].geometry.coordinates[i] = [parseFloat(coordinate[1]), parseFloat(coordinate[0])];
      };
    }
    cb(null, result[0]);
  });
}

var format = {
  'geojson': [
    { $group: {
      _id: 0,
      ids_str: { $push: '$status.id_str' },
      coordinates: {
        $push: { 
          $cond: [ { $ne: [ '$status.geo', null ] }, 
            '$status.geo.coordinates', 
            '$city_geo' 
          ] 
        }
      }
    } },
    { $project: {
      _id: 0,
      // type: {  $literal: 'Feature' },
      geometry: {
        // type: {  $literal: 'MultiPoint' },
        coordinates: '$coordinates'
      },
      properties: {
        coordinates: {
          id: "$ids_str"
        }
      }
    } }
  ]
  // TODO: WebGL Globe data format https://github.com/dataarts/webgl-globe#data-format
}