import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
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

// NOTE: adjust field names below (startDate/endDate, employee shape, etc.)
// to match your actual backend response if they differ.
type Guard = {
  id: number;
  name: string;
  phoneNumber?: string | null;
  phone?: string | null;
};

type Assignment = {
  id: string;
  employee?: Guard | null;
};

type LocationDetailData = {
  id: string;
  name: string;
  requiredGuards: number;
  assignments: Assignment[];
  contract?: {
    startDate?: string | null;
    endDate?: string | null;
    client?: { name: string } | null;
  } | null;
};

export default function LocationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<LocationDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/locations/${id}`);
      setLocation(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const formatDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—';

  const assigned = location?.assignments?.length ?? 0;
  const required = location?.requiredGuards ?? 0;
  const short = assigned < required;

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator style={{ marginTop: 60 }} color={COLORS.steel} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={20} color={COLORS.steel} />
          <Text style={styles.backText}>Locations</Text>
        </TouchableOpacity>
      </View>

      {/* Location card */}
      <View style={styles.idCard}>
        <View style={styles.iconWrap}>
          <Feather name="map-pin" size={26} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>{location?.name}</Text>
        {location?.contract?.client?.name ? (
          <Text style={styles.clientText}>{location.contract.client.name}</Text>
        ) : null}

        <View
          style={[
            styles.badge,
            { backgroundColor: short ? '#A63A3233' : '#FFFFFF26' },
          ]}
        >
          <Text style={styles.badgeText}>
            {assigned}/{required} guards
          </Text>
        </View>
      </View>

      {/* Contract info */}
      <Text style={styles.sectionTitle}>Contract</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color={COLORS.steel} />
          <Text style={styles.infoText}>
            Starts {formatDate(location?.contract?.startDate)}
          </Text>
        </View>
        <View
          style={[
            styles.infoRow,
            { borderTopWidth: 1, borderColor: COLORS.line, paddingTop: 12 },
          ]}
        >
          <Feather name="calendar" size={16} color={COLORS.steel} />
          <Text style={styles.infoText}>
            Ends {formatDate(location?.contract?.endDate)}
          </Text>
        </View>
      </View>

      {/* Assigned guards */}
      <Text style={styles.sectionTitle}>
        Assigned Guards ({assigned})
      </Text>

      <FlatList
        data={location?.assignments ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No guards assigned yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.guardCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.employee?.name?.charAt(0) ?? '?'}
              </Text>
            </View>
            <Text style={styles.guardName}>
              {item.employee?.name ?? 'Unknown guard'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingTop: 24 },
  header: { marginBottom: 12 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { color: COLORS.steel, fontSize: 15, fontWeight: '600' },
  idCard: {
    backgroundColor: COLORS.steel,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  clientText: { color: '#FFFFFFB3', fontSize: 13, marginTop: 2, marginBottom: 10 },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
    marginBottom: 8,
    marginStart: 4,
  },
  infoCard: {
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 20,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  infoText: { fontSize: 14, color: COLORS.ink, flex: 1 },
  emptyText: { textAlign: 'center', color: COLORS.muted, marginTop: 12 },
  guardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.steel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  guardName: { fontSize: 15, fontWeight: '600', color: COLORS.ink },
});