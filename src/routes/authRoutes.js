const express = require('express');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { required, isEmail, minLength } = require('../middleware/validators');

const router = express.Router();

router.post(
  '/register',
  validate({
    name: [required('姓名为必填项。'), minLength(2, '姓名至少 2 个字符。')],
    email: [required('邮箱为必填项。'), isEmail()],
    password: [required('密码为必填项。'), minLength(6, '密码至少 6 位字符。')]
  }),
  register
);

router.post(
  '/login',
  validate({
    email: [required('邮箱为必填项。'), isEmail()],
    password: [required('密码为必填项。')]
  }),
  login
);

module.exports = router;
