import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GuardLayout() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      setChecked(true);
    })();
  }, []);

  if (!checked) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}