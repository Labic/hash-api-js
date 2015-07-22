module.exports = {
  db: {
    connector: 'mongodb',
    url: process.env.MONGODB_URI || 'mongodb://localhost/hash'
  }
};