const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sanitizeText } = require('../utils/sanitize');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: '姓名、邮箱和密码均为必填项。' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: '该邮箱已被注册。' });
    }

    const user = await User.create({
      name: sanitizeText(name),
      email: sanitizeText(email),
      password
    });
    const token = generateToken(user);

    return res.status(201).json({
      user,
      token
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码为必填项。' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: '邮箱或密码错误。' });
    }

    const token = generateToken(user);

    return res.json({
      user,
      token
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login
};
