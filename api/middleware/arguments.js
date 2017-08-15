const util = require('util'),
      moment = require('moment'),
      debug = require('debug')('hashapi:components:arguments-middleware');

function arguments(options) {
  debug('initialized');
  options = options || {};

  return function(req, res, next) {
    // debug('req: ', util.inspect(req.query));
    // if(req.query.period) {
    //   req.query.period = {
    //     start: '',
    //     end: ''
    //   };
    // }
    next()
  };
}

module.exports = arguments;