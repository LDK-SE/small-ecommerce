const express = require('express');
const {
  getMe,
  updateMe,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { required, minLength, isPhone } = require('../middleware/validators');

const router = express.Router();

router.get('/me', protect, getMe);
router.put(
  '/me',
  protect,
  validate({
    name: [required('姓名为必填项。'), minLength(2, '姓名至少 2 个字符。')]
  }),
  updateMe
);
router.get('/addresses', protect, getAddresses);
router.post(
  '/addresses',
  protect,
  validate({
    receiverName: [required('收货人姓名为必填项。')],
    phone: [required('收货手机号为必填项。'), isPhone('请输入有效的中国大陆手机号。')],
    address: [required('收货地址为必填项。')]
  }),
  addAddress
);
router.put(
  '/addresses/:addressId',
  protect,
  validate({
    receiverName: [minLength(1, '收货人姓名至少 1 个字符。')],
    phone: [isPhone('请输入有效的中国大陆手机号。')],
    address: [minLength(2, '收货地址至少 2 个字符。')]
  }),
  updateAddress
);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;
