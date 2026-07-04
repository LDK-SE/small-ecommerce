import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CartItem from '../components/CartItem';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { formatPrice } from '../utils/formatPrice';

export default function CartScreen({ navigation }) {
  const { user } = useAuth();
  const { items, total, clearCart, hydrated } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    receiverName: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const clearFieldError = (field) => {
    if (error) setError('');
  };

  const handleCheckout = async () => {
    if (!user) {
      navigation.navigate('AccountTab');
      return;
    }

    if (!shippingAddress.receiverName || !shippingAddress.phone || !shippingAddress.address) {
      setError('请填写收货人、手机号和详细地址。');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(shippingAddress.phone.trim())) {
      setError('请输入有效的 11 位手机号。');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId || item._id,
        quantity: item.quantity
      }));

      await api.createOrder(orderItems, shippingAddress);
      clearCart();
      setShippingAddress({ receiverName: '', phone: '', address: '' });
      setMessage('订单创建成功，请到”我的”查看历史订单。');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return <LoadingState label="正在加载购物车..." />;
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={items}
        keyExtractor={(item) => item.productId || item._id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>购物车</Text>
            <Text style={styles.subtitle}>可调整数量、删除商品并提交订单。</Text>
            <View style={styles.shippingBox}>
              <Text style={styles.shippingTitle}>收货信息</Text>
              <TextInput
                value={shippingAddress.receiverName}
                onChangeText={(receiverName) => {
                  clearFieldError('receiverName');
                  setShippingAddress((current) => ({ ...current, receiverName }));
                }}
                placeholder="收货人"
                style={styles.input}
              />
              <TextInput
                value={shippingAddress.phone}
                onChangeText={(phone) => {
                  clearFieldError('phone');
                  setShippingAddress((current) => ({ ...current, phone }));
                }}
                placeholder="手机号"
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                value={shippingAddress.address}
                onChangeText={(address) => {
                  clearFieldError('address');
                  setShippingAddress((current) => ({ ...current, address }));
                }}
                placeholder="详细收货地址"
                multiline
                style={[styles.input, styles.addressInput]}
              />
            </View>
            <ErrorState message={error} />
            {message ? <Text style={styles.success}>{message}</Text> : null}
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>购物车为空。</Text>}
        renderItem={({ item }) => <CartItem item={item} />}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>总价</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            <Pressable
              disabled={items.length === 0 || submitting}
              onPress={handleCheckout}
              style={[styles.button, (items.length === 0 || submitting) && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {submitting ? '提交中...' : user ? '提交订单' : '登录后提交订单'}
              </Text>
            </Pressable>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16
  },
  header: {
    gap: 8,
    marginBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14
  },
  success: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: 8,
    borderWidth: 1,
    color: colors.success,
    padding: 12
  },
  shippingBox: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
    padding: 12
  },
  shippingTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  input: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  addressInput: {
    minHeight: 72,
    textAlignVertical: 'top'
  },
  empty: {
    color: colors.muted,
    padding: 24,
    textAlign: 'center'
  },
  summary: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 14,
    marginTop: 8,
    padding: 16
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  totalValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900'
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14
  },
  buttonDisabled: {
    backgroundColor: colors.border
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  }
});
