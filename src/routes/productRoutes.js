const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');
const upload = require('../config/multer');

// público
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// admin con subida de imagen
router.post(
  '/',
  verifyToken,
  requireAdmin,
  upload.single('imagen'),
  productController.create
);

router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  upload.single('imagen'),
  productController.update
);

router.delete('/:id', verifyToken, requireAdmin, productController.remove);

module.exports = router;
