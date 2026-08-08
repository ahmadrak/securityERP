import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  ScrollView,
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

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'GUARD', label: 'Guards' },
  { key: 'SUPERVISOR', label: 'Supervisors' },
  { key: 'MANAGER', label: 'Managers' },
  { key: 'HR', label: 'HR' },
];

type Assignment = {
  location?: { id: string; name: string } | null;
};

type Employee = {
  id: number;
  name: string;
  fileNumber: string;
  type: string;
  phone: string | null;
  phoneNumber: string | null;
  whatsapp: string | null;
  status: string;
  assignments: Assignment[];
};

export default function EmployeesScreen() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const load = useCallback(async (type: string) => {
    try {
      setLoading(true);
      const res = await api.get('/employees', {
        params: type === 'ALL' ? {} : { type },
      });
      setEmployees(res.data ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(activeTab);
    }, [load, activeTab])
  );

  const call = (number: string | null) => {
    if (!number) return;
    Linking.openURL(`tel:${number}`);
  };

  const filtered = employees.filter((e) => {
    const q = query.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.fileNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Feather name="users" size={14} color={COLORS.brass} />
          <Text style={styles.badgeText}>Admin Panel</Text>
        </View>
        <Text style={styles.title}>Employees</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
        contentContainerStyle={{ gap: 8, alignItems: 'center', paddingVertical: 2 }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                { backgroundColor: active ? COLORS.steel : COLORS.panel },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? '#FFFFFF' : COLORS.muted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.searchBox}>
        <Feather name="search" size={16} color={COLORS.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or file number"
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.steel} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No results</Text>
          }
          renderItem={({ item }) => {
            const location = item.assignments?.[0]?.location?.name;
            const phone = item.phoneNumber || item.phone || item.whatsapp;

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: '/(admin)/employees/[id]',
                  params: { id: String(item.id) },
                })}
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name?.charAt(0) ?? '?'}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.fileNumber ? (
                      <Text style={styles.fileNumberText}>
                        File #{item.fileNumber}
                      </Text>
                    ) : null}
                    <View style={styles.locationRow}>
                      <Feather
                        name="map-pin"
                        size={12}
                        color={location ? COLORS.steel : COLORS.muted}
                      />
                      <Text
                        style={[
                          styles.locationText,
                          !location && { color: COLORS.muted },
                        ]}
                      >
                        {location ?? 'No current location'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => call(phone)}
                    disabled={!phone}
                    style={[
                      styles.callButton,
                      { backgroundColor: phone ? COLORS.ok : COLORS.line },
                    ]}
                  >
                    <Feather
                      name="phone"
                      size={16}
                      color={phone ? '#FFFFFF' : COLORS.muted}
                    />
                  </TouchableOpacity>

                  <Feather name="chevron-right" size={18} color={COLORS.muted} />
                </View>
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
  tabsRow: { height: 44, marginBottom: 12, flexGrow: 0 },
  tab: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 20,
    paddingHorizontal: 18,
    flexShrink: 0,
  },
  tabText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    flexShrink: 0,
  },
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.steel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.ink },
  fileNumberText: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  locationText: { fontSize: 12, color: COLORS.steel },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});