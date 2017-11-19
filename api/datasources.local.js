module.exports = {
  memory: {
    connector: 'memory'
  },
  mongo: {
    connector: 'mongodb',
    url: process.env.MONGODB_URI || 'mongodb://localhost/hash',
    allowExtendedOperators: true
  }
};