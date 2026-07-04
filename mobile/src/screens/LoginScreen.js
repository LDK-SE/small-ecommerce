import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

function validate(form) {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = '请输入邮箱地址。';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = '请输入有效的邮箱地址。';
  }
  if (!form.password) {
    errors.password = '请输入密码。';
  } else if (form.password.length < 6) {
    errors.password = '密码至少 6 位字符。';
  }
  return errors;
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setError('');

    try {
      await login(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>登录</Text>
        <View>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="邮箱"
            value={form.email}
            onChangeText={(email) => {
              setForm((c) => ({ ...c, email }));
              if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: '' }));
            }}
            style={[styles.input, fieldErrors.email && styles.inputError]}
          />
          {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}
        </View>
        <View>
          <TextInput
            placeholder="密码"
            secureTextEntry
            value={form.password}
            onChangeText={(password) => {
              setForm((c) => ({ ...c, password }));
              if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: '' }));
            }}
            style={[styles.input, fieldErrors.password && styles.inputError]}
          />
          {fieldErrors.password ? <Text style={styles.fieldError}>{fieldErrors.password}</Text> : null}
        </View>
        <ErrorState message={error} />
        <Pressable
          disabled={submitting}
          onPress={handleSubmit}
          style={[styles.button, submitting && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{submitting ? '登录中...' : '登录'}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>没有账号？去注册</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    padding: 16
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    gap: 12,
    padding: 18
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8
  },
  input: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  inputError: {
    borderColor: colors.danger
  },
  fieldError: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4
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
    fontWeight: '800'
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center'
  }
});
