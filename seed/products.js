const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const { products } = require('./productCatalog');

dotenv.config();

const legacyProductNames = [
  'Wireless Bluetooth Headphones',
  'Cotton Casual T-Shirt',
  'Stainless Steel Water Bottle',
  'Smart Fitness Watch',
  'Canvas Tote Bag',
  'Ceramic Coffee Mug'
];

const seedProducts = async () => {
  try {
    await connectDB();

    const legacyProducts = await Product.find({ name: { $in: legacyProductNames } }).sort({ createdAt: 1 });
    await Promise.all(
      legacyProducts.map((product, index) => {
        Object.assign(product, products[index]);
        return product.save();
      })
    );

    const productsToUpsert = products.slice(legacyProducts.length);
    if (productsToUpsert.length > 0) {
      await Product.bulkWrite(
        productsToUpsert.map((product) => ({
          updateOne: {
            filter: { name: product.name },
            update: { $set: product },
            upsert: true
          }
        }))
      );
    }

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        isAdmin: true
      });
    } else if (!existingAdmin.isAdmin) {
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
    }

    const demoUser = await User.findOne({ email: 'demo@yuegou.com' });
    if (!demoUser) {
      await User.create({
        name: '演示用户',
        email: 'demo@yuegou.com',
        password: '123456',
        isAdmin: false
      });
    } else if (demoUser.isAdmin) {
      demoUser.isAdmin = false;
      await demoUser.save();
    }

    const count = await Product.countDocuments();
    const categories = await Product.distinct('category');
    console.log(`Catalog ready with ${count} products across ${categories.length} categories`);
    console.log('Admin account: admin@example.com / 123456');
    console.log('Demo account: demo@yuegou.com / 123456');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed products:', error.message);
    process.exit(1);
  }
};

seedProducts();
