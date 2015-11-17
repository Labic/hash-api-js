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

module.exports = _;