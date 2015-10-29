var cache = require('memory-cache');

module.exports = function(Model) {
  Model.cache = {};
  
  Model.cache.put = cache.put;
  Model.cache.get = cache.get;
  Model.cache.del = cache.del;
  Model.cache.clear = cache.clear;
}