var _ = require('../../../lib/underscoreExtended');

module.exports = function geolocation(params, model, cb) { 
  var pipeline = [
    { $match: {
      'data.location': { $ne: null },
      'data.created_time': {
        $gte: params.since.getTime() / 1000,
        $lte: params.until.getTime() / 1000
      }
    } },
    format['geojson'][0],
    format['geojson'][1]
  ];

  if(params.filter.tags) {
    if(params.filter.tags.with)
      pipeline[0].$match['categories'] = { $all: params.filter.tags.with };

    if(params.filter.tags.contains)
      pipeline[0].$match['categories'] = { $in: params.filter.tags.contains };
  }

  if(params.filter.hashtags)
    pipeline[0].$match['data.tags'] = { $in: params.filter.hashtags };

  if(params.filter.mentions)
    pipeline[0].$match['data.users_in_photo.user.username'] = { $in: params.filter.mentions };

  if(params.filter.users)
    pipeline[0].$match['data.user.username'] = { $in: params.filter.users };

  if(params.filter.type)
    pipeline[0].$match['data.type'] = { $in: params.filter.type };

  // TODO: Implement geojson-flatten for GeoJSON format result
  model.dao.mongodb.aggregate(pipeline, function (err, result) {
    if(err) return cb(err, null);

    if(result) {
      result[0].bbox = [7, 7, -31, -31];
      result[0].type = 'Feature';
      result[0].geometry.type = 'MultiPoint';
      for (var i = 0; i < result[0].geometry.coordinates.length; i++) {
        var coordinate = result[0].geometry.coordinates[i];
        result[0].geometry.coordinates[i] = [coordinate.long, coordinate.lat];
      };
    }
    cb(null, result[0]);
  });
}

var format = {
  'geojson': [
    { $group: {
      _id: 0,
      ids_str: { $push: '$data.id' },
      coordinates: {
        $push: { lat: '$data.location.latitude', long: '$data.location.longitude' }
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