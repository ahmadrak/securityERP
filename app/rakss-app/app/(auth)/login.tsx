import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/api';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('Login clicked');
    try {
      if (!email || !password) {
        return Alert.alert('Error', 'Enter email & password');
      }

      setLoading(true);

      const res = await api.post('/auth/login', { email, password });
      const data = res.data;

      // 🔐 save token
      await AsyncStorage.setItem('token', data.access_token);
      await AsyncStorage.setItem('role', data.user.role);
      await AsyncStorage.setItem('employeeId', String(data.user.employeeId)); // 👈 this line was missing
      await AsyncStorage.setItem('userId', String(data.user.id));
      await AsyncStorage.setItem('email', data.user.email);

       console.log('ROLE:', data.user.role);
      // 👤 role-based navigation
      if (data.user.role === 'ADMIN') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(guard)/home');
      }

    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>RAK Security</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});