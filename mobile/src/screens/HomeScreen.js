import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import ProductCard from '../components/ProductCard';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getProducts({ limit: 4 })
      .then((data) => { if (!cancelled) setProducts(data.products || []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <LoadingState label="正在加载推荐商品..." />;
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={products}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.eyebrow}>精选好物</Text>
                <Text style={styles.title}>移动端小型电商</Text>
                <Text style={styles.subtitle}>浏览商品、加入购物车、登录后创建订单。</Text>
                <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Products')}>
                  <Text style={styles.primaryButtonText}>浏览全部商品</Text>
                </Pressable>
              </View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80'
                }}
                style={styles.heroImage}
              />
            </View>
            <ErrorState message={error} />
            <Text style={styles.sectionTitle}>推荐商品</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16
  },
  hero: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden'
  },
  heroText: {
    padding: 18
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700'
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8
  },
  heroImage: {
    height: 150,
    width: '100%'
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 8
  }
});
