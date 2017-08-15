const apicache = require('apicache')
apicache.options({ 
  defaultDuration: process.env.CACHE_DURATION | 3600000,
  enabled: process.env.CACHE_ENABLED | false,
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

if (!apicache.enabled)
  apicache.clear()
// TODO: Convert to middleware
module.exports = (app, options) => {
  app.use(cache())
}