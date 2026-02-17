const Cart = require('../models/Cart');
const Order = require('../models/Order');

const createOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new Error('El carrito está vacío');

  const items = cart.items.map((i) => {
    if (!i.product) throw new Error('Producto inválido en carrito');
    return {
      product: i.product._id,
      nombre: i.product.nombre,
      precio: i.product.precio,
      cantidad: i.cantidad,
      azucar: i.azucar
    };
  });

  const total = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);

  const order = await Order.create({ user: userId, items, total });

  cart.items = [];
  await cart.save();

  return order;
};

const getMyOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

// ADMIN
const getAllOrders = async () => {
  return await Order.find()
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
};

const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    .populate('user', 'name email role');
};

module.exports = { createOrderFromCart, getMyOrders, getAllOrders, updateOrderStatus };
