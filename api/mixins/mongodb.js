module.exports = function(Model) {

  Model.aggregate = function(pipeline, cb) {
    Model.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Model.settings.mongodb.collection);
      collection.aggregate(pipeline, function(err, result) {
        if (err) return cb(err);
        cb(null, result);
      });
    });
  }

  Model.mongodb = {};
  Model.mongodb.count = function(query, cb) {
    Model.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Model.settings.mongodb.collection);
      collection.count(query, function(err, result) {
        if (err) return cb(err);
        cb(null, result);
      });
    });
  }

}