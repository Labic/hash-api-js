module.exports = {
  mongodb: {
    connector: 'mongodb',
    url: process.env.MONGODB_URI || 'mongodb://localhost/hash'
  }
};