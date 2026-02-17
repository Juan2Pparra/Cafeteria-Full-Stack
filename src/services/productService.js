const Product = require('../models/Product');

const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const getProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
