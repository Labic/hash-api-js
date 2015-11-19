var _ = require('underscore');

_.mixin({
  convertToArray: function(value) {
    if(!_.isEmpty(value))
      return _.isArray(value)
                ? value
                : [value];

    return null;
  }
});

_.mixin({
  convertToBoolean: function(value) {
    if(!_.isEmpty(value))
      return _.isBoolean(value)
                ? value
                : value === 'true'
                    ? true
                    : value === 'false'
                      ? false
                      : null;

    return null;
  }
});

_.mixin({
  hash: function(value) {
    var type, serializedCode = "";

    type = typeof object;

    if (type === 'object') {
      var element;

      for (element in object) {
        serializedCode += "[" + type + ":" + element + serialize(object[element]) + "]";
      }

    } else if (type === 'function') {
      serializedCode += "[" + type + ":" + object.toString() + "]";
    } else {
      serializedCode += "[" + type + ":" + object+"]";
    }

    return MD5(serializedCode.replace(/\s/g, ""));
  }
});

_.mixin({
  renameProperties: function(object, map) {
    if(_.isArray(object)) {
      _.each(object, function(element) {
        _.each(element, function(value, key) {
          var newKey = map[key] || key;
          element[newKey] = value;
        });
        _.each(map, function(value, key) {
          delete element[key];
        });
      })
    } else {
      _.each(object, function(value, key) {
        var newKey = map[key] || key;
        object[newKey] = value;
        delete object[map[key]];
      });
      _.each(object, function(value, key) {
        delete object[key];
      });
    }

    return this;
  }
});

module.exports = _;