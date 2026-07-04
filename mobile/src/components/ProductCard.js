import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { getFallbackImage } from '../utils/fallbackImage';

export default function ProductCard({ product, onPress }) {
  const { addItem } = useCart();
  const disabled = product.stock <= 0;

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.pressableArea}>
        <Image
          source={{ uri: product.imageUrl || getFallbackImage(product.name) }}
          style={styles.image}
        />
        <View style={styles.body}>
          <Text style={styles.category}>{product.category}</Text>
          <Text numberOfLines={1} style={styles.name}>
            {product.name}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {product.description}
          </Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.stock}>库存 {product.stock}</Text>
        </View>
        <Pressable
          disabled={disabled}
          onPress={() => addItem(product)}
          style={[styles.button, disabled && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>加入</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden'
  },
  pressableArea: {
    // Separates navigation touch area from the add-to-cart button
  },
  image: {
    backgroundColor: colors.border,
    height: 170,
    width: '100%'
  },
  body: {
    gap: 6,
    padding: 14
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700'
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    paddingBottom: 14,
    paddingHorizontal: 14
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  stock: {
    color: colors.muted,
    fontSize: 12
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  buttonDisabled: {
    backgroundColor: colors.border
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  }
});
