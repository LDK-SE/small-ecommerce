const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const Review = require('../src/models/Review');

dotenv.config();

const reviewTemplates = {
  positive: [
    '做工精细，物流很快，值得购买。',
    '性价比很高，质量超出预期！',
    '已经用了几天了，非常好用，推荐！',
    '产品很满意，和描述一致，包装也很用心。',
    '回购很多次了，品质一直很稳定。',
    '给家人也买了一份，大家都说好。',
    '这个价格很良心了，使用体验不错。',
    '颜值高功能全，超出预期。',
    '发货速度快，包装完好，满意。',
    '质量很好，日常使用完全够了。',
    '细节处理到位，物超所值。',
    '对比了一圈，最后还是这款最合适。'
  ],
  neutral: [
    '还可以，日常使用没什么问题。',
    '一般般吧，对得起这个价格。',
    '功能OK，外观中规中矩。',
    '还行吧，没什么亮点也没什么槽点。',
    '整体满意，有一点点小瑕疵但不影响使用。',
    '给个中评，符合基本预期。',
    '中规中矩，如果有升级版会更期待。',
    '无功无过，日常够用了。'
  ],
  critical: [
    '还可以更好，包装可以再精致一点。',
    '不错但还有改进空间，继续加油。',
    '没有想象中好，但也不差。',
    '细节还能优化，给个四星吧。'
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const seedReviews = async () => {
  try {
    await connectDB();

    // Get or create reviewer accounts
    const reviewerDefs = [
      { name: '数码爱好者', email: 'reviewer1@yuegou.com', password: '12345678' },
      { name: '购物达人小王', email: 'reviewer2@yuegou.com', password: '12345678' },
      { name: '品质生活家', email: 'reviewer3@yuegou.com', password: '12345678' },
      { name: '实用主义买家', email: 'reviewer4@yuegou.com', password: '12345678' }
    ];

    const reviewers = [];
    for (const def of reviewerDefs) {
      let user = await User.findOne({ email: def.email });
      if (!user) {
        user = await User.create(def);
      }
      reviewers.push(user);
    }
    console.log(`${reviewers.length} reviewer accounts ready.`);

    const products = await Product.find({});
    if (products.length === 0) {
      console.log('No products found. Run product seed first.');
      process.exit(1);
    }

    // Clear existing reviews by all our reviewers
    const reviewerIds = reviewers.map((r) => r._id);
    await Review.deleteMany({ userId: { $in: reviewerIds } });
    console.log('Cleared existing reviewer reviews.');

    let totalReviews = 0;
    const usedComments = new Set(); // Track used comments per product to avoid duplicates within a product

    for (const product of products) {
      usedComments.clear();

      const isPopular = product.tags.includes('热销') || product.tags.includes('推荐');
      const reviewCount = isPopular
        ? Math.min(Math.floor(Math.random() * 2) + 3, reviewers.length) // 3-4 reviews, capped by reviewer count
        : Math.min(Math.floor(Math.random() * 2) + 1, reviewers.length); // 1-2 reviews

      const baseQuality = Math.random() > 0.3 ? 'good' : 'average';

      // Assign different reviewers to each product
      const shuffledReviewers = [...reviewers].sort(() => Math.random() - 0.5);

      let reviewsForThisProduct = 0;
      for (const reviewer of shuffledReviewers) {
        if (reviewsForThisProduct >= reviewCount) break;

        let rating;
        let templatePool;

        if (baseQuality === 'good') {
          rating = Math.random() > 0.4 ? 5 : 4;
          templatePool = rating === 5 ? reviewTemplates.positive : [...reviewTemplates.positive, ...reviewTemplates.neutral];
        } else {
          const roll = Math.random();
          rating = roll > 0.7 ? 5 : roll > 0.3 ? 4 : 3;
          templatePool =
            rating === 5
              ? reviewTemplates.positive
              : rating === 4
                ? reviewTemplates.neutral
                : [...reviewTemplates.neutral, ...reviewTemplates.critical];
        }

        // Pick a unique comment for this product
        let comment;
        let attempts = 0;
        do {
          comment = pick(templatePool);
          attempts++;
        } while (usedComments.has(comment) && attempts < 20);
        usedComments.add(comment);

        await Review.findOneAndUpdate(
          { productId: product._id, userId: reviewer._id },
          { $set: { rating, comment } },
          { upsert: true, new: true }
        );

        reviewsForThisProduct++;
        totalReviews++;
      }
    }

    console.log(`Seeded ${totalReviews} reviews across ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed reviews:', error.message);
    process.exit(1);
  }
};

seedReviews();
