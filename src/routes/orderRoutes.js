const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const { createOrderFromCart, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const requireAdmin = require('../middleware/adminMiddleware');

router.post('/', verifyToken, createOrderFromCart);
router.get('/my', verifyToken, getMyOrders);

// admin
router.get('/', verifyToken, requireAdmin, getAllOrders);
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);

module.exports = router;
