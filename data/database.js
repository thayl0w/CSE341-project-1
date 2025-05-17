const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized');
    return callback(null, database); // Fixed `_db` reference
  }

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client.db(); // Store the actual database instance
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized'); // Proper error handling
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};
