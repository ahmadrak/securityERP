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
        Alert.alert('خطأ', 'تعذر تحديد هوية الموظف، سجل الدخول من جديد');
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
        Alert.alert('تم', 'تم تسجيل الانصراف بنجاح');
      } else {
        await api.post(`/attendance/check-in/${employeeId}`);
        Alert.alert('تم', 'تم تسجيل الحضور بنجاح');
      }

      await loadStatus();
    } catch (err) {
      console.log(err);
      Alert.alert('خطأ', isCheckedIn ? 'فشل تسجيل الانصراف' : 'فشل تسجيل الحضور');
    } finally {
      setLoading(false);
    }
  };

  const actionColor = isCheckedIn ? COLORS.danger : COLORS.ok;
  const actionLabel = isCheckedIn ? 'تسجيل انصراف' : 'تسجيل حضور';
  const actionIcon = isCheckedIn ? 'log-out' : 'log-in';

  const timeString = now.toLocaleTimeString('ar-AE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateString = now.toLocaleDateString('ar-AE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Feather name="shield" size={14} color={COLORS.brass} />
          <Text style={styles.badgeText}>نظام حضور الحراس</Text>
        </View>
        <Text style={styles.title}>مرحباً بك</Text>
      </View>

      {/* live clock card */}
      <View style={styles.clockCard}>
        <Text style={styles.clockTime}>{timeString}</Text>
        <Text style={styles.clockDate}>{dateString}</Text>
      </View>

      {/* status card */}
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
                {isCheckedIn ? 'أنت الحين بالدوام' : 'أنت الحين خارج الدوام'}
              </Text>
            </View>

            {lastRecord && (
              <Text style={styles.statusSub}>
                {isCheckedIn
                  ? `حضرت الساعة ${new Date(lastRecord.checkIn).toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })}`
                  : lastRecord.checkOut
                  ? `آخر انصراف: ${new Date(lastRecord.checkOut).toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })}`
                  : 'لا يوجد سجل سابق'}
              </Text>
            )}
          </>
        )}
      </View>

      {/* dynamic action button */}
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