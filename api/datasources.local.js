const url = require('url');

module.exports = {
  memory: {
    connector: 'memory'
  },
  mongo: {
    connector: 'mongodb',
    url: process.env.MONGODB_URI,
    allowExtendedOperators: true,
  },
  elasticsearch: {
    connector: 'es',
    apiVersion: '5.x',
    hosts: process.env.ES_URI.split(',').map(uri => { 
      return url.parse(uri)
    })
  }
};