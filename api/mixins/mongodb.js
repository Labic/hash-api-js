module.exports = function(Model) {
  Model.dao = {
    mongodb: {}
  };

  Model.dao.mongodb.find = function(query, options, cb) {
    cb = (typeof options === 'function') ? options : cb;
    options = (typeof options === 'function') ? undefined : options;

    Model.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Model.settings.mongodb.collection);
      collection.find(query, options).toArray(function (err, result) {
        if (err) return cb(err);
        cb(null, result);
      });
    });
  }

  Model.dao.mongodb.count = function(query, cb) {
    Model.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Model.settings.mongodb.collection);
      collection.count(query, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
      });
    });
  }

  Model.dao.mongodb.aggregate = function(pipeline, cb) {
    Model.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection(Model.settings.mongodb.collection);
      collection.aggregate(pipeline, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
      });
    });
  }
}