const User = require('../models/User');

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
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
      return res.status(400).json({ message: 'Receiver name, phone, and address are required' });
    }

    const user = await User.findById(req.user._id);
    if (isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    user.addresses.push({ receiverName, phone, address, isDefault });
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
      return res.status(404).json({ message: 'Address not found' });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    ['receiverName', 'phone', 'address', 'isDefault'].forEach((field) => {
      if (req.body[field] !== undefined) {
        addressItem[field] = req.body[field];
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
    user.addresses = user.addresses.filter((item) => item._id.toString() !== req.params.addressId);
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
