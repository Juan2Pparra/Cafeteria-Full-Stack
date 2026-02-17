const productService = require('../services/productService');

const create = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    let imagenPath = '';
    if (req.file) {
      imagenPath = '/uploads/' + req.file.filename;
    }

    const product = await productService.createProduct({
      nombre,
      descripcion,
      precio,
      imagen: imagenPath
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: 'Error creando producto' });
  }
};

const update = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    let data = { nombre, descripcion, precio };

    if (req.file) {
      data.imagen = '/uploads/' + req.file.filename;
    }

    const product = await productService.updateProduct(req.params.id, data);

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: 'Error actualizando producto' });
  }
};

const getAll = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Error obteniendo productos' });
  }
};

const getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Error obteniendo producto' });
  }
};

const remove = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch {
    res.status(500).json({ message: 'Error eliminando producto' });
  }
};

module.exports = { create, getAll, getById, update, remove };
