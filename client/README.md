# 悦购商城 Web 前端

React + TailwindCSS 前端，连接 Express 后端 API。

## 运行

先启动后端 `http://localhost:5000`，再运行：

```powershell
cd D:\Project\小型电商\client
npm.cmd install
npm.cmd run dev
```

本机打开：

```text
http://localhost:5173
```

## API 地址

`client/.env` 中：

```env
VITE_API_BASE_URL=
```

留空时会自动根据当前访问主机生成 API 地址：

- 本机访问 `http://localhost:5173` -> `http://localhost:5000/api`
- 局域网访问 `http://192.168.1.20:5173` -> `http://192.168.1.20:5000/api`

部署到线上时，可以改成固定 API：

```env
VITE_API_BASE_URL=https://api.example.com/api
```

## 主要页面

- `/` 首页
- `/products` 商品列表、搜索、分类和价格筛选
- `/products/:id` 商品详情、规格、评价
- `/cart` 购物车和三步结算
- `/orders` 用户订单
- `/profile` 用户个人中心和地址簿
- `/admin/products` 管理员商品管理
- `/admin/orders` 管理员订单管理

