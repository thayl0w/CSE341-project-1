const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateUser = (user) => {
  if (!user.firstName || typeof user.firstName !== 'string') return 'First name is required and must be a string.';
  if (!user.lastName || typeof user.lastName !== 'string') return 'Last name is required and must be a string.';
  if (!user.email || typeof user.email !== 'string') return 'Email is required and must be a string.';
  if (!user.favoriteColor || typeof user.favoriteColor !== 'string') return 'Favorite color is required and must be a string.';
  if (!user.birthday || typeof user.birthday !== 'string') return 'Birthday is required and must be a string.';
  return null;
};

const getAll = async (req, res) => {
  // #swagger.tags=['users']
  try {
    const result = await mongodb.getDatabase().collection('users').find();
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
   // #swagger.tags=['users']
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('users').findOne({ _id: userId });
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
   // #swagger.tags=['users']
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const validationError = validateUser(user);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const response = await mongodb.getDatabase().collection('users').insertOne(user);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the user.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateUser = async (req, res) => {
   // #swagger.tags=['users']
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const validationError = validateUser(user);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const response = await mongodb.getDatabase().collection('users').replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while updating the user.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteUser = async (req, res) => {
   // #swagger.tags=['users']
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
