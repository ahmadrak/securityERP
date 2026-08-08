import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
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

type UserProfile = {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  employee?: { name: string } | null;
};

export default function AdminProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const res = await api.get(`/users/${userId}`);
      setProfile(res.data);
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

  const handleLogout =async () => {
          await AsyncStorage.multiRemove([
            'token',
            'role',
            'employeeId',
            'userId',
            'email',
          ]);
          router.replace('/login');
        }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator style={{ marginTop: 60 }} color={COLORS.steel} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Feather name="shield" size={14} color={COLORS.brass} />
            <Text style={styles.badgeText}>Admin Account</Text>
          </View>
        </View>

        {/* ID card */}
        <View style={styles.idCard}>
          <View style={styles.avatar}>
            <Feather name="user" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.name}>
            {profile?.employee?.name || 'System Admin'}
          </Text>
          <Text style={styles.email}>{profile?.email}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile?.role}</Text>
          </View>
        </View>

        {/* Account info */}
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="mail" size={16} color={COLORS.steel} />
            <Text style={styles.infoText}>{profile?.email}</Text>
          </View>
          <View
            style={[
              styles.infoRow,
              { borderTopWidth: 1, borderColor: COLORS.line, paddingTop: 12 },
            ]}
          >
            <Feather name="calendar" size={16} color={COLORS.steel} />
            <Text style={styles.infoText}>
              Member since{' '}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })
                : '—'}
            </Text>
          </View>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingTop: 24 },
  header: { marginBottom: 12 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeText: { color: COLORS.brass, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  idCard: {
    backgroundColor: COLORS.steel,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  email: { color: '#FFFFFFB3', fontSize: 13, marginTop: 2, marginBottom: 10 },
  roleBadge: {
    backgroundColor: '#FFFFFF1A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  roleText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 30,
  },
  logoutText: { color: COLORS.danger, fontSize: 15, fontWeight: '700' },
});