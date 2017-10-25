const apicache = require('apicache')


// TODO: Convert to middleware
module.exports = (app, options) => {
  options = options || {}

  apicache.options({ 
    enabled: options.enabled | false,
    defaultDuration: options.duration | 3600000,
    statusCodes: { 
      include: [ 
        200, 203, 204, 206, 
        300, 301, 
        404, 405, 410, 414, 
        501, 
     ] 
    } 
  })

  let cache = apicache.middleware

  if (!apicache.enabled) {
    apicache.clear()
  } else {
    app.use(cache())
  }
}