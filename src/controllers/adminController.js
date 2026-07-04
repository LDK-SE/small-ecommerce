const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueResult, orders, orderStatsResult] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.find({}).sort({ createdAt: -1 }).limit(5).populate('userId', 'name email').lean(),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const allOrdersStats = { pending: 0, completed: 0, canceled: 0 };
    for (const row of orderStatsResult) {
      if (row._id in allOrdersStats) allOrdersStats[row._id] = row.count;
    }

    const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD, 10) || 10;
    const lowStockProducts = await Product.find({ stock: { $lt: lowStockThreshold } }).sort({ stock: 1 }).limit(5).lean();

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
