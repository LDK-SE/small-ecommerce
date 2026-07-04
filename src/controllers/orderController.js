const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    if (!shippingAddress?.receiverName || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Shipping name, phone, and address are required' });
    }

    const normalizedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Item quantity must be greater than 0' });
      }

      // Atomic stock decrement works with a normal local MongoDB instance.
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: quantity }
        },
        {
          $inc: { stock: -quantity }
        },
        {
          new: true
        }
      );

      if (!product) {
        return res.status(400).json({ message: `Product not found or insufficient stock: ${item.productId}` });
      }

      const orderItem = {
        productId: product._id,
        quantity,
        price: product.price
      };

      normalizedItems.push(orderItem);
      totalPrice += orderItem.price * orderItem.quantity;
    }

    const createdOrder = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
      totalPrice,
      shippingAddress,
      status: 'pending'
    });

    return res.status(201).json(createdOrder);
  } catch (error) {
    return next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId;

    if (!req.user.isAdmin && req.user._id.toString() !== requestedUserId) {
      return res.status(403).json({ message: 'You can only view your own orders' });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const filter = { userId: requestedUserId };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.productId', 'name imageUrl category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    return next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({})
        .populate('userId', 'name email')
        .populate('items.productId', 'name imageUrl category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({})
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name imageUrl category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!req.user.isAdmin && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view your own order' });
    }

    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    if (status && !['pending', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    if (paymentStatus && !['unpaid', 'paid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const wasConsumed = existingOrder.status !== 'canceled' && existingOrder.paymentStatus !== 'refunded';
    const willBeCanceled =
      (status && status !== existingOrder.status && status === 'canceled') ||
      (paymentStatus && paymentStatus !== existingOrder.paymentStatus && paymentStatus === 'refunded');
    const shouldRestoreStock = wasConsumed && willBeCanceled;

    if (shouldRestoreStock) {
      await Promise.all(
        existingOrder.items.map((item) =>
          Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } })
        )
      );
    }

    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') update.paidAt = new Date();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
        runValidators: true
      }
    );

    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

const payOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!req.user.isAdmin && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only pay your own order' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    order.paymentStatus = 'paid';
    order.paymentMethod = req.body.paymentMethod || 'mock';
    order.status = 'completed';
    order.paidAt = new Date();
    await order.save();

    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  payOrder
};
