import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async getJSON(key, fallback = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  async setJSON(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  getItem(key) {
    return AsyncStorage.getItem(key);
  },
  setItem(key, value) {
    return AsyncStorage.setItem(key, value);
  },
  removeItem(key) {
    return AsyncStorage.removeItem(key);
  }
};
