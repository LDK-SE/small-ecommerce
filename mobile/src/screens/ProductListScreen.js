import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import ProductCard from '../components/ProductCard';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    api
      .getProducts({ limit: 50, category })
      .then((data) => { if (!cancelled) setProducts(data.products || []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  if (loading) {
    return <LoadingState label="正在加载商品..." />;
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>商品列表</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="搜索商品"
              style={styles.input}
            />
            <View style={styles.categoryRow}>
              <Pressable
                style={[styles.chip, category === '' && styles.chipActive]}
                onPress={() => setCategory('')}
              >
                <Text style={[styles.chipText, category === '' && styles.chipTextActive]}>全部</Text>
              </Pressable>
              {categories.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.chip, category === item && styles.chipActive]}
                  onPress={() => setCategory(item)}
                >
                  <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <ErrorState message={error} />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>没有找到匹配商品。</Text>}
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
  header: {
    gap: 12,
    marginBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800'
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  chipTextActive: {
    color: '#ffffff'
  },
  empty: {
    color: colors.muted,
    padding: 24,
    textAlign: 'center'
  }
});
