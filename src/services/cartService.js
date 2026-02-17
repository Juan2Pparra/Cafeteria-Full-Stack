const Cart = require('../models/Cart');

const addToCart = async (userId, productId, cantidad, azucar) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // mismo producto + mismo azucar = mismo item
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.azucar === azucar
  );

  if (existingItem) {
    existingItem.cantidad += cantidad;
    if (existingItem.cantidad < 1) existingItem.cantidad = 1;
  } else {
    cart.items.push({ product: productId, cantidad, azucar });
  }

  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('items.product');
};

const updateQuantity = async (userId, itemId, cantidad) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  const item = cart.items.id(itemId);
  if (!item) return null;

  item.cantidad = cantidad < 1 ? 1 : cantidad;
  await cart.save();
  return cart;
};

const removeItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  await cart.save();
  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeItem
};
