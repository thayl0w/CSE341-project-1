const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateProduct = (product) => {
  if (!product.name || typeof product.name !== 'string') return 'Name is required and must be a string.';
  if (!product.price || typeof product.price !== 'number') return 'Price is required and must be a number.';
  if (!product.category || typeof product.category !== 'string') return 'Category is required and must be a string.';
  return null;
};

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('products').find();
    const products = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('products').findOne({ _id: productId });
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const validationError = validateProduct(product);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const response = await mongodb.getDatabase().collection('products').insertOne(product);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the product.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const validationError = validateProduct(product);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const response = await mongodb.getDatabase().collection('products').replaceOne({ _id: productId }, product);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while updating the product.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('products').deleteOne({ _id: productId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Some error occurred while deleting the product.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct
}; 