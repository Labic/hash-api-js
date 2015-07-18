var TopLGBT = require('./top-lgbt');

module.exports = function(LGBT) {
  //var TopLGBT = app.models.TopLGBT;

  LGBT.topMentions = function(cb) {
    cb(null, {name : "NotImplementedError", message : "too lazy to implement"});
  };

  LGBT.remoteMethod(
    'topMentions',
    {
      description: 'Get top 20 mentions for LGBT on Twitter',
      http: { path: '/top/mentions', verb: 'get' },
      returns: { type: 'array', root: true }
    }
  );
};