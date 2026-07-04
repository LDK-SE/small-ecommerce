# 悦购商城 · Small Ecommerce

一个全栈电商网站，覆盖商品浏览、购物车、下单支付、订单管理、商品评价、后台管理等完整购物流程。

## 功能一览

**前台（顾客）**
- 商品列表：分页、分类筛选、价格区间、多字段排序
- 商品详情：SKU 轮播图、规格选择、加入购物车
- 搜索：商品名称 / 描述全文搜索、搜索结果页
- 购物车：数量增减、批量管理、持久化（localStorage）
- 下单结算：收货地址管理、订单提交、模拟支付
- 订单中心：查看历史订单、确认收货
- 商品评价：评分 + 文字评论
- 用户系统：注册 / 登录（JWT 认证）、个人信息编辑
- 响应式布局 + 深色模式

**后台（管理员）**
- 商品管理：创建 / 编辑 / 删除商品
- 订单管理：查看所有订单、修改订单状态
- 仪表盘：关键数据概览

**其他**
- SEO：页面 meta、结构化数据（JSON-LD）、sitemap
- PWA：Service Worker、离线提示、可安装
- 移动端：React Native (Expo) 应用（`mobile/`）

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Node.js + Express |
| 数据库 | MongoDB + Mongoose ODM |
| 认证 | JWT（bcryptjs 密码哈希） |
| 前端框架 | React 18 + React Router 6 |
| 样式 | TailwindCSS 3 |
| 构建工具 | Vite |
| 移动端 | React Native + Expo |
| 部署 | Render（后端） + GitHub Pages（前端） |

## 项目结构

```
小型电商/
├── server.js                   # 后端入口
├── src/                        # 后端源码
│   ├── app.js                  # Express 应用配置
│   ├── config/db.js            # MongoDB 连接
│   ├── controllers/            # 路由处理
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/              # 中间件
│   │   ├── authMiddleware.js    # JWT 验证 + 角色鉴权
│   │   ├── errorHandler.js      # 统一错误处理
│   │   ├── rateLimiter.js       # 请求频率限制
│   │   ├── requestLogger.js     # 请求日志
│   │   ├── securityHeaders.js   # 安全响应头
│   │   ├── validate.js          # 请求校验
│   │   └── validators.js        # 校验规则
│   ├── models/                  # Mongoose 模型
│   │   ├── AnalyticsEvent.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/                  # 路由定义
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sanitize.js
├── client/                     # 前端（React + Vite）
│   ├── src/
│   │   ├── components/         # 通用组件
│   │   ├── context/            # Auth / Cart 状态管理
│   │   ├── hooks/              # 自定义 Hooks（主题、SEO、结构化数据）
│   │   ├── pages/              # 页面组件
│   │   └── services/           # API 请求封装
│   └── public/
├── mobile/                     # React Native (Expo) 移动端
├── seed/                       # 种子数据（25 个商品 + 评价）
│   ├── productCatalog.js
│   ├── products.js
│   └── reviews.js
├── render.yaml                 # Render 部署配置
└── package.json
```

## 环境变量

### 后端（`.env`）

| 变量 | 说明 | 示例 |
|------|------|------|
| `PORT` | 服务端口 | `5000` |
| `HOST` | 监听地址 | `0.0.0.0` |
| `MONGO_URI` | MongoDB 连接串 | `mongodb://127.0.0.1:27017/small_ecommerce` |
| `JWT_SECRET` | JWT 签名密钥 | `replace_with_a_long_random_secret` |
| `JWT_EXPIRES_IN` | Token 有效期 | `7d` |
| `CORS_ORIGINS` | 允许的跨域来源（逗号分隔） | `http://localhost:5173` |
| `LOW_STOCK_THRESHOLD` | 低库存阈值 | `10` |
| `NODE_ENV` | 运行环境 | `development` / `production` |

### 前端（`client/.env`）

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_API_BASE_URL` | 后端 API 地址 | 留空自动适配局域网，或设为固定地址 |

## 快速开始

**前置要求：** Node.js >= 18，MongoDB（本地或 Atlas）

```bash
# 1. 克隆仓库
git clone https://github.com/LDK-SE/small-ecommerce.git
cd small-ecommerce

# 2. 配置环境变量
cp .env.example .env          # 编辑填入 MONGO_URI 和 JWT_SECRET
cp client/.env.example client/.env

# 3. 安装依赖并初始化数据
npm install
cd client && npm install && cd ..
npm run seed                   # 导入 25 个示例商品
npm run seed:reviews           # 导入示例评价

# 4. 启动后端（http://localhost:5000）
npm run dev

# 5. 另开终端，启动前端（http://localhost:5173）
npm run client:dev
```

### 管理员账号

```
admin@example.com / 123456
```

种子数据运行后自动创建。登录后顶部导航栏出现"后台管理"入口。

## API 概要

### 认证
| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |

### 商品
| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/products` | 商品列表（分页、筛选、排序） |
| GET | `/api/products/:id` | 商品详情 |
| POST | `/api/products` | 新增商品（管理员） |
| PUT | `/api/products/:id` | 更新商品（管理员） |
| DELETE | `/api/products/:id` | 删除商品（管理员） |

### 订单
| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/orders` | 创建订单 |
| GET | `/api/orders/user/:userId` | 用户订单列表 |
| PUT | `/api/orders/:id/pay` | 模拟支付 |
| PUT | `/api/orders/:id` | 更新订单状态（管理员） |

### 商品查询参数

`GET /api/products?page=1&limit=12&category=数码家电&minPrice=100&maxPrice=999&sort=price_asc&keyword=手机`

| 参数 | 说明 |
|------|------|
| `page` | 页码，默认 1 |
| `limit` | 每页数量，默认 12 |
| `category` | 分类筛选 |
| `minPrice` / `maxPrice` | 价格区间 |
| `sort` | `price_asc` / `price_desc` / `sales` / `rating` / `newest` |
| `keyword` | 名称 / 描述全文搜索 |

## 部署

### 后端 — Render

`render.yaml` 已配置好 Web Service，直接连接 Render 仓库即可部署。

### 前端 — GitHub Pages

```bash
cd client
npm run build
npx gh-pages -d build
```

生产环境前端会通过 `VITE_API_BASE_URL` 连接到 Render 后端。

## 移动端

项目包含 React Native (Expo) 移动端应用，位于 `mobile/` 目录。

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

详见 [`mobile/README.md`](mobile/README.md)。

## License

MIT
