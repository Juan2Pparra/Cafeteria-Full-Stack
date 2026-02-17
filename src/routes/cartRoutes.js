const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/add', verifyToken, cartController.add);
router.get('/', verifyToken, cartController.get);

// actualizar cantidad por itemId
router.put('/:itemId', verifyToken, cartController.update);

// eliminar item por itemId
router.delete('/:itemId', verifyToken, cartController.remove);

module.exports = router;
