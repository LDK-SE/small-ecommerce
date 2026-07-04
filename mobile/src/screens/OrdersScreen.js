import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { formatPrice } from '../utils/formatPrice';

const statusText = {
  pending: '待处理',
  completed: '已完成',
  canceled: '已取消'
};

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .getUserOrders(user._id)
      .then((data) => { if (!cancelled) setOrders(data.orders || data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return <LoadingState label="正在加载订单..." />;
  }

  if (!user) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>请登录后查看订单。</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={orders}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>历史订单</Text>
            <Text style={styles.subtitle}>查看当前账号提交过的订单。</Text>
            <ErrorState message={error} />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>暂无订单。</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.orderHeader}>
              <View style={styles.orderIdBox}>
                <Text numberOfLines={1} style={styles.orderId}>
                  订单号 {item._id}
                </Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.status}>{statusText[item.status] || item.status}</Text>
            </View>

            <View style={styles.items}>
              {item.items.map((orderItem) => (
                <View
                  key={`${item._id}-${orderItem.productId?._id || orderItem.productId}`}
                  style={styles.itemRow}
                >
                  <Text numberOfLines={1} style={styles.itemName}>
                    {orderItem.productId?.name || '商品'} x {orderItem.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>{formatPrice(orderItem.price * orderItem.quantity)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.total}>总价 {formatPrice(item.totalPrice)}</Text>
          </View>
        )}
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
    marginBottom: 12
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
  empty: {
    color: colors.muted,
    padding: 24,
    textAlign: 'center'
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
    padding: 14
  },
  orderHeader: {
    alignItems: 'flex-start',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 12
  },
  orderIdBox: {
    flex: 1
  },
  orderId: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  date: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3
  },
  status: {
    backgroundColor: '#e0f2fe',
    borderRadius: 999,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  items: {
    gap: 8
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  itemName: {
    color: colors.muted,
    flex: 1,
    fontSize: 13
  },
  itemPrice: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700'
  },
  total: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    paddingTop: 12,
    textAlign: 'right'
  }
});
