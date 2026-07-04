const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueResult, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.find({}).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email').lean()
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const allOrdersStats = {
      pending: await Order.countDocuments({ status: 'pending' }),
      completed: await Order.countDocuments({ status: 'completed' }),
      canceled: await Order.countDocuments({ status: 'canceled' })
    };

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).sort({ stock: 1 }).limit(5).lean();

    return res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders: orders.slice(0, 5),
      orderStats: allOrdersStats,
      lowStockProducts
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStats };
