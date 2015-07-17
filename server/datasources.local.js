module.exports = {
  db: {
    connector: 'mongodb',
    hostname: process.env.MONGODB_HOST || 'localhost',
    port: process.env.MONGODB_PORT || 27017,
    user: process.env.MONGODB_USER || 'mongodb',
    password: process.env.MONGODB_PASSWORD || '',
    database: process.env.MONGODB_DATABASE || 'hash',
  }
};