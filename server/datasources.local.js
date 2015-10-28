module.exports = {
  db: {
    connector: 'memory'
  },
  documentDB: {
    connector: 'mongodb',
    url: process.env.MONGODB_URI || 'mongodb://localhost/hash',
    allowExtendedOperators: true
  }
};