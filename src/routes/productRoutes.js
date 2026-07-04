const express = require('express');
const {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { required, isDecimal, isInt, minLength } = require('../middleware/validators');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post(
  '/:id/reviews',
  protect,
  validate({
    rating: [required('评分为必填项。'), isInt(1, '评分最低 1 分。')],
    comment: [required('评价内容为必填项。'), minLength(2, '评价内容至少 2 个字符。')]
  }),
  createProductReview
);
router.post(
  '/',
  protect,
  adminOnly,
  validate({
    name: [required('商品名称为必填项。')],
    description: [required('商品描述为必填项。'), minLength(8, '商品描述至少 8 个字符。')],
    price: [required('价格为必填项。'), isDecimal(0, '价格必须是大于等于 0 的数字。')],
    category: [required('分类为必填项。')],
    imageUrl: [required('图片地址为必填项。')],
    stock: [required('库存为必填项。'), isInt(0, '库存必须是大于等于 0 的整数。')]
  }),
  createProduct
);
router.put(
  '/:id',
  protect,
  adminOnly,
  updateProduct
);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
