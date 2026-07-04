# 悦购商城

Node.js + Express + MongoDB 后端，React + TailwindCSS 前端的小型电商网站。当前包含商品浏览、分类搜索、购物车、收货地址、订单、模拟支付、商品评价和管理员商品/订单管理。

## 本机运行

后端：

```powershell
cd D:\Project\小型电商
npm.cmd install
npm.cmd run seed
npm.cmd run dev
```

前端：

```powershell
cd D:\Project\小型电商\client
npm.cmd install
npm.cmd run dev
```

本机访问：

```text
http://localhost:5173
```

管理员账号：

```text
admin@example.com / 123456
```

## 让同一局域网的其他人访问

1. 确保你的电脑和对方设备连接同一个 Wi-Fi 或局域网。
2. 后端 `.env` 保持：

```env
HOST=0.0.0.0
PORT=5000
```

3. 前端 `client/.env` 建议留空：

```env
VITE_API_BASE_URL=
```

留空后，别人访问 `http://你的电脑IP:5173` 时，前端会自动请求 `http://你的电脑IP:5000/api`，不会错误地请求对方电脑自己的 `localhost`。

4. 启动后把下面地址发给同一局域网用户：

```text
http://你的电脑IP:5173
```

如果对方无法打开，请检查 Windows 防火墙是否允许 Node.js 访问专用网络，并确认 5173 和 5000 端口没有被拦截。

## 商品数据

种子数据位于 `seed/productCatalog.js`，当前包含 25 个商品，覆盖数码家电、服饰鞋包、家居生活、运动户外、美妆个护、母婴宠物、食品饮品、办公学习等品类。

每次重置商品数据：

```powershell
npm.cmd run seed
```

## API 摘要

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/products?page=1&limit=12&category=数码家电&minPrice=100&maxPrice=999&sort=price_asc`
- `GET /api/products/:id`
- `POST /api/products` 管理员
- `PUT /api/products/:id` 管理员
- `DELETE /api/products/:id` 管理员
- `POST /api/orders`
- `GET /api/orders/user/:userId`
- `PUT /api/orders/:id/pay`
- `PUT /api/orders/:id` 管理员

