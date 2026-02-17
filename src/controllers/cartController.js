const cartService = require('../services/cartService');

const add = async (req, res) => {
  try {
    const { productoId, cantidad, azucar } = req.body;

    const cart = await cartService.addToCart(
      req.user.id,
      productoId,
      Number(cantidad) || 1,
      typeof azucar === 'boolean' ? azucar : true
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error agregando al carrito' });
  }
};

const get = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo carrito' });
  }
};

const update = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const cart = await cartService.updateQuantity(
      req.user.id,
      req.params.itemId,
      Number(cantidad)
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando cantidad' });
  }
};

const remove = async (req, res) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando item' });
  }
};

module.exports = { add, get, update, remove };
