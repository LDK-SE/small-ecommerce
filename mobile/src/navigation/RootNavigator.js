import React from 'react';
import { Pressable, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Stack.Screen name="Products" component={ProductListScreen} options={{ title: '商品列表' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: '商品详情' }} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  const { user, logout } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            title: '历史订单',
            headerRight: () => (
              <Pressable onPress={logout}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>退出登录</Text>
              </Pressable>
            )
          }}
        />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: '登录' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '注册' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { count } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted
      }}
    >
      <Tab.Screen name="ShopTab" component={ProductsStack} options={{ title: '商城' }} />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ title: count > 0 ? `购物车(${count})` : '购物车' }}
      />
      <Tab.Screen name="AccountTab" component={AccountStack} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}
