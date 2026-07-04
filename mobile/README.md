# Small Ecommerce Mobile

React Native mobile app for the small ecommerce backend.

## Run

Start the backend first at `http://localhost:5000`, then run:

```bash
npm install
copy .env.example .env
npm run start
```

Use Expo Go, an Android emulator, or an iOS simulator.

## API URL

The app reads the backend URL from:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

On Android emulator, you may need:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000/api
```

On a physical phone, use your computer LAN IP:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:5000/api
```

## Structure

```text
mobile/
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── src/
    ├── components/
    │   ├── CartItem.js
    │   ├── ErrorState.js
    │   ├── LoadingState.js
    │   ├── ProductCard.js
    │   └── Screen.js
    ├── context/
    │   ├── AuthContext.js
    │   ├── CartContext.js
    │   └── cartReducer.js
    ├── navigation/
    │   └── RootNavigator.js
    ├── screens/
    │   ├── CartScreen.js
    │   ├── HomeScreen.js
    │   ├── LoginScreen.js
    │   ├── OrdersScreen.js
    │   ├── ProductDetailsScreen.js
    │   ├── ProductListScreen.js
    │   └── RegisterScreen.js
    ├── services/
    │   ├── api.js
    │   └── storage.js
    └── theme/
        └── colors.js
```

## Main Flows

- Home and product list call `GET /api/products`.
- Product details calls `GET /api/products/:id`.
- Login and register call the backend auth routes and store JWT in AsyncStorage.
- Cart is persisted in AsyncStorage and creates orders through `POST /api/orders`.
- Orders page calls `GET /api/orders/user/:userId`.
