import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/api';

/* ---------- design tokens (matches web dashboard) -----------------
   surface  #F6F6F3   ink     #16212E
   steel    #24405E   brass   #B8912E
   ok       #2F6F52   danger  #A63A32
   line     #E4E2DC   muted   #5B6572
--------------------------------------------------------------------*/
const COLORS = {
  surface: '#F6F6F3',
  panel: '#FFFFFF',
  ink: '#16212E',
  steel: '#24405E',
  brass: '#B8912E',
  ok: '#2F6F52',
  danger: '#A63A32',
  line: '#E4E2DC',
  muted: '#5B6572',
};

type AttendanceRecord = {
  id: number;
  checkIn: string;
  checkOut: string | null;
  date: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastRecord, setLastRecord] = useState<AttendanceRecord | null>(null);
  const [now, setNow] = useState(new Date());

  // live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      setFetching(true);
      const id = await AsyncStorage.getItem('employeeId');
      if (!id) {
        Alert.alert('Error', 'Could not identify employee, please log in again');
        return;
      }
      setEmployeeId(Number(id));

      const res = await api.get(`/attendance/${id}`);
      const records: AttendanceRecord[] = res.data ?? [];
      const latest = records[records.length - 1] ?? null;

      setLastRecord(latest);
      setIsCheckedIn(!!latest && latest.checkOut === null);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handlePress = async () => {
    if (!employeeId) return;
    try {
      setLoading(true);

      if (isCheckedIn) {
        await api.post(`/attendance/check-out/${employeeId}`);
        Alert.alert('Done', 'Check-out recorded successfully');
      } else {
        await api.post(`/attendance/check-in/${employeeId}`);
        Alert.alert('Done', 'Check-in recorded successfully');
      }

      await loadStatus();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', isCheckedIn ? 'Failed to check out' : 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const actionColor = isCheckedIn ? COLORS.danger : COLORS.ok;
  const actionLabel = isCheckedIn ? 'Check Out' : 'Check In';
  const actionIcon = isCheckedIn ? 'log-out' : 'log-in';

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Feather name="shield" size={14} color={COLORS.brass} />
          <Text style={styles.badgeText}>Guard Attendance System</Text>
        </View>
        <Text style={styles.title}>Welcome</Text>
      </View>

     
      <View style={styles.clockCard}>
        <Text style={styles.clockTime}>{timeString}</Text>
        <Text style={styles.clockDate}>{dateString}</Text>
      </View>

     
      <View style={styles.statusCard}>
        {fetching ? (
          <ActivityIndicator color={COLORS.steel} />
        ) : (
          <>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isCheckedIn ? COLORS.ok : COLORS.muted },
                ]}
              />
              <Text style={styles.statusLabel}>
                {isCheckedIn ? 'You are currently on duty' : 'You are currently off duty'}
              </Text>
            </View>

            {lastRecord && (
              <Text style={styles.statusSub}>
                {isCheckedIn
                  ? `Checked in at ${new Date(lastRecord.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                  : lastRecord.checkOut
                  ? `Last check-out: ${new Date(lastRecord.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                  : 'No previous record'}
              </Text>
            )}
          </>
        )}
      </View>

      
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading || fetching}
        activeOpacity={0.85}
        style={[styles.actionButton, { backgroundColor: actionColor, opacity: loading ? 0.7 : 1 }]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Feather name={actionIcon as any} size={20} color="#FFFFFF" />
            <Text style={styles.actionText}>{actionLabel}</Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: COLORS.brass,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.ink,
  },
  clockCard: {
    backgroundColor: COLORS.steel,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  clockTime: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  clockDate: {
    fontSize: 13,
    color: '#FFFFFFB3',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 20,
    marginBottom: 24,
    minHeight: 80,
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ink,
  },
  statusSub: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 6,
    marginStart: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 18,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});