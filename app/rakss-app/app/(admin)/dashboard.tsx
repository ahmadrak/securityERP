import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
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

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalGuards, setTotalGuards] = useState(0);
  const [onDuty, setOnDuty] = useState(0);
  const [shortLocations, setShortLocations] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);

  const load = useCallback(async () => {
    try {
      const [employeesRes, activeRes, locationsRes] = await Promise.all([
        api.get('/employees', { params: { type: 'GUARD' } }),
        api.get('/attendance', { params: { active: 'true' } }),
        api.get('/locations'),
      ]);

      const employees = employeesRes.data ?? [];
      const active = activeRes.data ?? [];
      const locations = locationsRes.data ?? [];

      setTotalGuards(employees.length);
      setOnDuty(active.length);
      setTotalLocations(locations.length);
      setShortLocations(
        locations.filter(
          (l: any) => (l.assignments?.length ?? 0) < (l.requiredGuards ?? 0)
        ).length
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Feather name="grid" size={14} color={COLORS.brass} />
          <Text style={styles.badgeText}>Admin Panel</Text>
        </View>
        <Text style={styles.title}>Overview</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.steel} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* On duty now — hero card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>On Duty Now</Text>
            <Text style={styles.heroNumber}>{onDuty}</Text>
            <Text style={styles.heroSub}>out of {totalGuards} guards</Text>
          </View>

          {/* Stats grid */}
          <View style={styles.grid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#24405E1A' }]}>
                <Feather name="users" size={16} color={COLORS.steel} />
              </View>
              <Text style={styles.statNumber}>{totalGuards}</Text>
              <Text style={styles.statLabel}>Total Guards</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#B8912E1A' }]}>
                <Feather name="map-pin" size={16} color={COLORS.brass} />
              </View>
              <Text style={styles.statNumber}>{totalLocations}</Text>
              <Text style={styles.statLabel}>Total Locations</Text>
            </View>

            <View style={[styles.statCard, { width: '100%' }]}>
              <View
                style={[
                  styles.statIcon,
                  {
                    backgroundColor: shortLocations > 0 ? '#A63A321A' : '#2F6F521A',
                  },
                ]}
              >
                <Feather
                  name="alert-triangle"
                  size={16}
                  color={shortLocations > 0 ? COLORS.danger : COLORS.ok}
                />
              </View>
              <Text
                style={[
                  styles.statNumber,
                  { color: shortLocations > 0 ? COLORS.danger : COLORS.ok },
                ]}
              >
                {shortLocations}
              </Text>
              <Text style={styles.statLabel}>
                {shortLocations > 0
                  ? 'Locations understaffed — needs attention'
                  : 'All locations fully staffed'}
              </Text>
            </View>
          </View>
        </ScrollView>
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
  heroCard: {
    backgroundColor: COLORS.steel,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    color: '#FFFFFFB3',
    fontSize: 13,
    marginBottom: 6,
  },
  heroNumber: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '700',
  },
  heroSub: {
    color: '#FFFFFFB3',
    fontSize: 13,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  statCard: {
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    width: '47%',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
});