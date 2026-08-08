import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/api';

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
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
};

export default function HistoryScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const employeeId = await AsyncStorage.getItem('employeeId');
      if (!employeeId) return;

      const res = await api.get(`/attendance/${employeeId}`);
      const data: AttendanceRecord[] = res.data ?? [];
      // Most recent first
      setRecords([...data].reverse());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const formatTime = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Feather name="clock" size={14} color={COLORS.brass} />
          <Text style={styles.badgeText}>Attendance Log</Text>
        </View>
        <Text style={styles.title}>History</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.steel} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No attendance records yet</Text>
          }
          renderItem={({ item }) => {
            const isOngoing = item.checkIn && !item.checkOut;
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                  {isOngoing && (
                    <View style={styles.ongoingBadge}>
                      <Text style={styles.ongoingText}>On duty now</Text>
                    </View>
                  )}
                </View>

                <View style={styles.timesRow}>
                  <View style={styles.timeBlock}>
                    <Feather name="log-in" size={13} color={COLORS.ok} />
                    <Text style={styles.timeLabel}>Check-in</Text>
                    <Text style={styles.timeValue}>{formatTime(item.checkIn)}</Text>
                  </View>

                  <View style={styles.timeBlock}>
                    <Feather name="log-out" size={13} color={COLORS.danger} />
                    <Text style={styles.timeLabel}>Check-out</Text>
                    <Text style={styles.timeValue}>{formatTime(item.checkOut)}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingTop: 24 },
  header: { marginBottom: 16 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  badgeText: { color: COLORS.brass, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.ink },
  emptyText: { textAlign: 'center', color: COLORS.muted, marginTop: 40 },
  card: {
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: { fontSize: 14, fontWeight: '600', color: COLORS.ink },
  ongoingBadge: {
    backgroundColor: '#2F6F521A',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ongoingText: { fontSize: 11, fontWeight: '600', color: COLORS.ok },
  timesRow: { flexDirection: 'row', gap: 24 },
  timeBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeLabel: { fontSize: 12, color: COLORS.muted },
  timeValue: { fontSize: 13, fontWeight: '600', color: COLORS.ink },
});