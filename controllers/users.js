const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  // #swagger.tags=['users']
  const result = await mongodb.getDatabase().collection('users').find();
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  });
};

const getSingle = async (req, res) => {
   // #swagger.tags=['users']
  const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().collection('users').findOne({ _id: userId });

  if (result) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const createUser = async (req, res) => {
   // #swagger.tags=['users']
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDatabase().collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json({ error: 'Some error occurred while creating the user.' });
  }
};


const updateUser = async (req, res) => {
   // #swagger.tags=['users']
  const userId = new ObjectId(req.params.id);
  const user = {
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    ipaddress: req.body.ipaddress
  };
  const response = await mongodb.getDatabase().collection('users').replaceOne({ _id: userId }, user);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json({ error: 'Some error occurred while updating the user.' });
  }
};


const deleteUser = async (req, res) => {
   // #swagger.tags=['users']
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDatabase()          // already the Db instance
    .collection('users')
    .deleteOne({ _id: userId });

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json({ error: 'Some error occurred while deleting the user.' });
  }
};


module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
