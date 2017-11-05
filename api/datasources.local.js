module.exports = {
  db: {
    connector: 'memory'
  },
  documentDB: {
    connector: 'mongodb',
    url: process.env.MONGODB_URI || 'mongodb://localhost/hash',
    allowExtendedOperators: true
  },
  // searchEngine: {
  //   name: 'es',
  //   connector: 'es',
  //   hosts: [
  //     {
  //       protocol: process.env.ES_PROTOCOL_0 | 'http',
  //       host: process.env.ES_HOST_0 | '127.0.0.1',
  //       port: process.env.ES_PORT_0 | 9200,
  //       auth: process.env.ES_AUTH_0 | ''
  //     }
  //   ],
  //   apiVersion: 5,
  //   refreshOn: ['save', 'create', 'updateOrCreate'],
  //   log: 'trace',
  //   defaultSize: 25,
  //   requestTimeout: 30000,
  //   mappings: [
  //     {
  //       name: 'UserModel',
  //       properties: {
  //           realm: {'type': 'string', 'index' : 'not_analyzed' },
  //           username: {'type': 'string', 'index' : 'not_analyzed' },
  //           password: {'type': 'string', 'index' : 'not_analyzed' },
  //           email: {'type': 'string', 'analyzer' : 'email' }
  //       }
  //     },
  //     {
  //       name: 'CoolModel',
  //       index: <useSomeOtherIndex>,
  //       type: <overrideTypeName>,
  //       properties: {
  //         realm: {'type': 'string', 'index' : 'not_analyzed' },
  //         username: {'type': 'string', 'index' : 'not_analyzed' },
  //         password: {'type': 'string', 'index' : 'not_analyzed' },
  //         email: {'type': 'string', 'analyzer' : 'email' }
  //       }
  //     }
  //   ],
  // }
};