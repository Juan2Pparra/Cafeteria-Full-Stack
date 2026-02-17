const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrderFromCart = async (req, res) => {
  try {
    const { customer } = req.body;

    if (!customer?.nombre || !customer?.telefono || !customer?.direccion) {
      return res.status(400).json({ message: 'Nombre, teléfono y dirección son obligatorios' });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Carrito vacío' });
    }

    const items = cart.items.map(it => ({
      product: it.product._id,
      nombre: it.product.nombre,
      precio: it.product.precio,
      cantidad: it.cantidad,
      azucar: it.azucar
    }));

    const total = items.reduce((acc, it) => acc + (Number(it.precio) * Number(it.cantidad)), 0);

    const order = await Order.create({
      user: req.user.id,
      customer,
      items,
      total
    });

    // vaciar carrito
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creando pedido' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Error obteniendo pedidos' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Error obteniendo pedidos' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch {
    res.status(500).json({ message: 'Error actualizando estado' });
  }
};

module.exports = { createOrderFromCart, getMyOrders, getAllOrders, updateOrderStatus };
