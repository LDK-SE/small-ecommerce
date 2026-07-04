import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { getFallbackImage } from '../utils/fallbackImage';

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();
  const subtotal = item.price * item.quantity;
  const id = item.productId || item._id;

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl || getFallbackImage(item.name, 500) }} style={styles.image} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>
        <Text style={styles.meta}>{formatPrice(item.price)} / 件</Text>
        <Text style={styles.meta}>小计 {formatPrice(subtotal)}</Text>
        <View style={styles.actions}>
          <Pressable
            style={styles.stepper}
            onPress={() => updateQuantity(id, item.quantity - 1)}
          >
            <Text style={styles.stepperText}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable
            style={styles.stepper}
            onPress={() => updateQuantity(id, item.quantity + 1)}
          >
            <Text style={styles.stepperText}>+</Text>
          </Pressable>
          <Pressable style={styles.removeButton} onPress={() => removeItem(id)}>
            <Text style={styles.removeText}>删除</Text>
          </Pressable>
        </View>
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
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 12
  },
  image: {
    backgroundColor: colors.border,
    borderRadius: 8,
    height: 86,
    width: 86
  },
  body: {
    flex: 1,
    gap: 4
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700'
  },
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  stepper: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  stepperText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700'
  },
  quantity: {
    color: colors.text,
    minWidth: 24,
    textAlign: 'center'
  },
  removeButton: {
    marginLeft: 'auto'
  },
  removeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700'
  }
});
