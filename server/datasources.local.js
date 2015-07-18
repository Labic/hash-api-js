module.exports = {
  mongodb: {
    connector: 'mongodb',
    uri: process.env.MONGODB_URI || 'mongodb://localhost/hash'
  }
};