import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Screen from '../components/Screen';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { formatPrice } from '../utils/formatPrice';
import { getFallbackImage } from '../utils/fallbackImage';

export default function ProductDetailsScreen({ route }) {
  const { productId } = route.params;
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getProduct(productId)
      .then((data) => { if (!cancelled) setProduct(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [productId]);

  const handleRetry = () => {
    setLoading(true);
    setError('');
    api
      .getProduct(productId)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <LoadingState label="正在加载商品详情..." />;
  }

  if (error) {
    return (
      <Screen style={styles.content}>
        <ErrorState message={error} />
        <Pressable onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>重新加载</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.imageUrl || getFallbackImage(product.name) }} style={styles.image} />
        <View style={styles.card}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>价格</Text>
              {product.discount > 0 ? (
                <View style={styles.discountRow}>
                  <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
                  <Text style={styles.infoValue}>{formatPrice(Math.round(product.price * (1 - product.discount / 100)))}</Text>
                  <Text style={styles.discountBadge}>-{product.discount}%</Text>
                </View>
              ) : (
                <Text style={styles.infoValue}>{formatPrice(product.price)}</Text>
              )}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>库存</Text>
              <Text style={styles.infoValue}>{product.stock}</Text>
            </View>
          </View>

          <Pressable
            disabled={product.stock <= 0}
            onPress={() => addItem(product)}
            style={[styles.button, product.stock <= 0 && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>{product.stock <= 0 ? '暂时缺货' : '加入购物车'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16
  },
  image: {
    backgroundColor: colors.border,
    borderRadius: 12,
    height: 280,
    width: '100%'
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    gap: 12,
    marginTop: 16,
    padding: 18
  },
  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800'
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800'
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    flex: 1,
    padding: 14
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13
  },
  infoValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4
  },
  discountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4
  },
  originalPrice: {
    color: colors.muted,
    fontSize: 14,
    textDecorationLine: 'line-through'
  },
  discountBadge: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2
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
  },
  retryButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 12
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  }
});
