const User = require('../models/User');
const { sanitizeText } = require('../utils/sanitize');

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: sanitizeText(name) },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const getAddresses = async (req, res) => {
  res.json(req.user.addresses || []);
};

const addAddress = async (req, res, next) => {
  try {
    const { receiverName, phone, address, isDefault = false } = req.body;

    if (!receiverName || !phone || !address) {
      return res.status(400).json({ message: '收货人、电话和地址均为必填项。' });
    }

    const user = await User.findById(req.user._id);
    if (isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    user.addresses.push({
      receiverName: sanitizeText(receiverName),
      phone: sanitizeText(phone),
      address: sanitizeText(address),
      isDefault
    });
    await user.save();

    return res.status(201).json(user.addresses);
  } catch (error) {
    return next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addressItem = user.addresses.id(req.params.addressId);

    if (!addressItem) {
      return res.status(404).json({ message: '地址未找到。' });
    }

    if (req.body.isDefault !== undefined) {
      if (req.body.isDefault) {
        user.addresses.forEach((item) => {
          item.isDefault = false;
        });
      }
      addressItem.isDefault = req.body.isDefault;
    }

    ['receiverName', 'phone', 'address'].forEach((field) => {
      if (req.body[field] !== undefined) {
        addressItem[field] = sanitizeText(req.body[field]);
      }
    });

    await user.save();
    return res.json(user.addresses);
  } catch (error) {
    return next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addressItem = user.addresses.id(req.params.addressId);
    if (!addressItem) {
      return res.status(404).json({ message: '地址未找到。' });
    }
    addressItem.deleteOne();
    await user.save();
    return res.json(user.addresses);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
