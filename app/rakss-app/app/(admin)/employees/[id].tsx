import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
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

type Assignment = {
  location?: { id: string; name: string } | null;
};

type EmployeeProfile = {
  id: number;
  name: string;
  fileNumber: string;
  phone: string | null;
  phoneNumber: string | null;
  whatsapp: string | null;
  type: string;
  status: string;
  emaratesId: string | null;
  passport: string | null;
  nsiCert: string | null;
  psbdId: string | null;
  contract: string | null;
  assignments?: Assignment[];
};

const DOCUMENTS = [
  { key: 'emaratesId', label: 'Emirates ID', icon: 'credit-card' },
  { key: 'passport', label: 'Passport', icon: 'book' },
  { key: 'nsiCert', label: 'NSI Certificate', icon: 'award' },
  { key: 'psbdId', label: 'PSBD Card', icon: 'shield' },
  { key: 'contract', label: 'Contract', icon: 'file-text' },
] as const;

export default function EmployeeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/employees/${id}`);
      setProfile(res.data);
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

  const call = (number: string | null) => {
    if (!number) return;
    Linking.openURL(`tel:${number}`);
  };

  const openDocument = (url: string | null) => {
    if (!url) return;
    Linking.openURL(url);
  };

  const phone = profile?.phoneNumber || profile?.phone || profile?.whatsapp || null;
  const location = profile?.assignments?.[0]?.location?.name;

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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={20} color={COLORS.steel} />
            <Text style={styles.backText}>Employees</Text>
          </TouchableOpacity>
        </View>

        {/* ID card */}
        <View style={styles.idCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name?.charAt(0) ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.fileNumber}>File #{profile?.fileNumber}</Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{profile?.status}</Text>
          </View>
        </View>

        {/* Contact info */}
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <View style={styles.infoCard}>
          <TouchableOpacity
            onPress={() => call(phone)}
            disabled={!phone}
            style={styles.infoRow}
          >
            <Feather name="phone" size={16} color={COLORS.steel} />
            <Text style={styles.infoText}>{phone || 'Not on file'}</Text>
            {phone ? (
              <Feather name="phone-call" size={14} color={COLORS.ok} />
            ) : null}
          </TouchableOpacity>
          <View
            style={[
              styles.infoRow,
              { borderTopWidth: 1, borderColor: COLORS.line, paddingTop: 12 },
            ]}
          >
            <Feather name="briefcase" size={16} color={COLORS.steel} />
            <Text style={styles.infoText}>{profile?.type}</Text>
          </View>
          <View
            style={[
              styles.infoRow,
              { borderTopWidth: 1, borderColor: COLORS.line, paddingTop: 12 },
            ]}
          >
            <Feather
              name="map-pin"
              size={16}
              color={location ? COLORS.steel : COLORS.muted}
            />
            <Text
              style={[styles.infoText, !location && { color: COLORS.muted }]}
            >
              {location ?? 'No current location'}
            </Text>
          </View>
        </View>

        {/* Documents */}
        <Text style={styles.sectionTitle}>Documents</Text>
        <View style={styles.infoCard}>
          {DOCUMENTS.map((doc, i) => {
            const url = profile?.[doc.key as keyof EmployeeProfile] as
              | string
              | null;
            return (
              <TouchableOpacity
                key={doc.key}
                onPress={() => openDocument(url)}
                disabled={!url}
                style={[
                  styles.docRow,
                  i !== 0 && { borderTopWidth: 1, borderColor: COLORS.line },
                ]}
              >
                <Feather
                  name={doc.icon as any}
                  size={16}
                  color={url ? COLORS.steel : COLORS.muted}
                />
                <Text style={[styles.infoText, !url && { color: COLORS.muted }]}>
                  {doc.label}
                </Text>
                {url ? (
                  <Feather name="external-link" size={14} color={COLORS.muted} />
                ) : (
                  <Text style={styles.missingText}>Not uploaded</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 26 },
  name: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  fileNumber: { color: '#FFFFFFB3', fontSize: 13, marginTop: 2, marginBottom: 10 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.ok },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
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
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  missingText: { fontSize: 11, color: COLORS.muted },
});