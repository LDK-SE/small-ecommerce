const express = require('express');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { required, isEmail, minLength } = require('../middleware/validators');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

router.post(
  '/register',
  authLimiter,
  validate({
    name: [required('姓名为必填项。'), minLength(2, '姓名至少 2 个字符。')],
    email: [required('邮箱为必填项。'), isEmail()],
    password: [required('密码为必填项。'), minLength(8, '密码至少 8 位字符。')]
  }),
  register
);

router.post(
  '/login',
  authLimiter,
  validate({
    email: [required('邮箱为必填项。'), isEmail()],
    password: [required('密码为必填项。')]
  }),
  login
);

module.exports = router;
