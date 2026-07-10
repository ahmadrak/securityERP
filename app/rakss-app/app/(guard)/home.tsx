import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const checkIn = async () => {
    try {
      setLoading(true);

      await api.post('/attendance/check-in/35'); // replace with real userId

      Alert.alert('Success', 'Checked In');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);

      await api.post('/attendance/check-out/35');

      Alert.alert('Success', 'Checked Out');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Guard Attendance
      </Text>

      <TouchableOpacity
        onPress={checkIn}
        style={{ backgroundColor: 'green', padding: 15, borderRadius: 10, width: 200 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Check In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={checkOut}
        style={{ backgroundColor: 'red', padding: 15, borderRadius: 10, width: 200 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Check Out
        </Text>
      </TouchableOpacity>

    </View>
  );
}