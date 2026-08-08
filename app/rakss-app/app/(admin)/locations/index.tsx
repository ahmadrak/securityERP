import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
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

type LocationItem = {
  id: string;
  name: string;
  requiredGuards: number;
  assignments: any[];
  contract?: { client?: { name: string } | null } | null;
};

export default function LocationsScreen() {
  const router = useRouter();
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/locations');
      setLocations(res.data ?? []);
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

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Feather name="map-pin" size={14} color={COLORS.brass} />
          <Text style={styles.badgeText}>Admin Panel</Text>
        </View>
        <Text style={styles.title}>Locations</Text>
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={16} color={COLORS.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for a location"
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.steel} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No locations</Text>}
          renderItem={({ item }) => {
            const assigned = item.assignments?.length ?? 0;
            const required = item.requiredGuards ?? 0;
            const short = assigned < required;

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: '/(admin)/locations/[id]',
                    params: { id: String(item.id) },
                  })
                }
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: short ? '#A63A321A' : '#2F6F521A' },
                    ]}
                  >
                    <Feather
                      name="map-pin"
                      size={18}
                      color={short ? COLORS.danger : COLORS.ok}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.contract?.client?.name && (
                      <Text style={styles.clientText}>
                        {item.contract.client.name}
                      </Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: short ? '#A63A321A' : '#2F6F521A' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeCount,
                        { color: short ? COLORS.danger : COLORS.ok },
                      ]}
                    >
                      {assigned}/{required}
                    </Text>
                  </View>

                  <Feather name="chevron-right" size={18} color={COLORS.muted} />
                </View>

                {short && (
                  <Text style={styles.shortText}>
                    Short {required - assigned} guard(s)
                  </Text>
                )}
              </TouchableOpacity>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, color: COLORS.ink, fontSize: 14 },
  emptyText: { textAlign: 'center', color: COLORS.muted, marginTop: 40 },
  card: {
    backgroundColor: COLORS.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.ink },
  clientText: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeCount: { fontSize: 12, fontWeight: '700' },
  shortText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 8,
    marginStart: 50,
  },
});