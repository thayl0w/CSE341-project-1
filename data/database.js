const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database; // <-- You were missing this

const initDb = (callback) => {
  if (database) {
    console.log('Database is already initialized');
    return callback(null, database);
  }

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client.db();
      console.log('Database is initialized');
      callback(null, database);
    })
    .catch((err) => {
      console.error('Failed to initialize DB', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};
