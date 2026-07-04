const Product = require('../models/Product');
const Review = require('../models/Review');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      const keyword = new RegExp(escapeRegExp(req.query.search.trim()), 'i');
      filter.$or = [{ name: keyword }, { description: keyword }, { category: keyword }];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};

      const minPrice = Number(req.query.minPrice);
      const maxPrice = Number(req.query.maxPrice);

      if (req.query.minPrice && !Number.isNaN(minPrice)) {
        filter.price.$gte = minPrice;
      }

      if (req.query.maxPrice && !Number.isNaN(maxPrice)) {
        filter.price.$lte = maxPrice;
      }

      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      stock_desc: { stock: -1 },
      newest: { createdAt: -1 }
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    const [products, total, categories] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
      Product.distinct('category')
    ]);

    // Aggregate ratings for the current page of products
    const productIds = products.map((p) => p._id);
    const ratingRows = await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      { $group: { _id: '$productId', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);

    const ratingMap = {};
    for (const row of ratingRows) {
      ratingMap[row._id.toString()] = {
        averageRating: Math.round(row.averageRating * 10) / 10,
        reviewCount: row.reviewCount
      };
    }

    const productsWithRatings = products.map((p) => ({
      ...p.toObject(),
      averageRating: ratingMap[p._id.toString()]?.averageRating ?? 0,
      reviewCount: ratingMap[p._id.toString()]?.reviewCount ?? 0
    }));

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      categories: categories.sort(),
      products: productsWithRatings
    });
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const [product, reviews] = await Promise.all([
      Product.findById(req.params.id),
      Review.find({ productId: req.params.id }).populate('userId', 'name').sort({ createdAt: -1 })
    ]);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return res.json({
      ...product.toObject(),
      reviews,
      reviewCount: reviews.length,
      averageRating: Number(averageRating.toFixed(1))
    });
  } catch (error) {
    return next(error);
  }
};

const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = await Review.findOneAndUpdate(
      {
        productId: req.params.id,
        userId: req.user._id
      },
      {
        rating,
        comment
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).populate('userId', 'name');

    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
};

const productFields = ['name', 'description', 'price', 'category', 'imageUrl', 'stock', 'discount', 'tags'];

const pickProductFields = (body) => {
  const data = {};
  for (const field of productFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(pickProductFields(req.body));
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, pickProductFields(req.body), {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Review.deleteMany({ productId: req.params.id });

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct
};
