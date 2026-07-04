const express = require('express');
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  payOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { required, isArray } = require('../middleware/validators');

const router = express.Router();

router.post(
  '/',
  protect,
  validate({
    items: [required('订单商品为必填项。'), isArray('订单至少包含一件商品。')],
    'shippingAddress.receiverName': [required('收货人姓名为必填项。')],
    'shippingAddress.phone': [required('收货手机号为必填项。')],
    'shippingAddress.address': [required('收货地址为必填项。')]
  }),
  createOrder
);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/user/:userId', protect, getUserOrders);
router.put('/:id/pay', protect, payOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
