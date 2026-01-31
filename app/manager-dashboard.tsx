import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPendingForms, approveForm, rejectForm } from '../services/firestore';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Form {
  id: string;
  namaUnitKerja: string;
  picUnitKerja: string;
  tanggalKunjungan: string;
  hasilKunjungan: string;
  kondisiAset: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export default function ManagerDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'manager') {
      Alert.alert('Error', 'Anda tidak memiliki akses ke halaman ini');
      router.replace('/home');
      return;
    }
    loadForms();
  }, [user]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const pendingForms = await getPendingForms();
      setForms(pendingForms as Form[]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadForms();
    setRefreshing(false);
  };

  const handleApprove = async (formId: string) => {
    Alert.alert(
      'Approve Form',
      'Apakah Anda yakin ingin approve form ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await approveForm(formId);
              Alert.alert('Berhasil', 'Form berhasil di-approve');
              loadForms();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Gagal approve form');
            }
          },
        },
      ]
    );
  };

  const handleReject = async (formId: string) => {
    Alert.alert(
      'Reject Form',
      'Apakah Anda yakin ingin reject form ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectForm(formId, 'Ditolak oleh Manager');
              Alert.alert('Berhasil', 'Form berhasil di-reject');
              loadForms();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Gagal reject form');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/splash');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextSubro}>SUBRO</Text>
          <Text style={styles.logoTextGo}>GO</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={SCREEN_HEIGHT * 0.03} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Manager Dashboard</Text>
        <Text style={styles.subtitle}>Pending Forms untuk Approval</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A8A']} />
          }
        >
          {forms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={SCREEN_HEIGHT * 0.08} color="#9CA3AF" />
              <Text style={styles.emptyText}>Tidak ada form yang perlu di-approve</Text>
            </View>
          ) : (
            forms.map((form) => (
              <View key={form.id} style={styles.formCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{form.namaUnitKerja}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>PENDING</Text>
                  </View>
                </View>

                {/* Card Details */}
                <View style={styles.cardDetail}>
                  <Ionicons name="person-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>PIC: {form.picUnitKerja}</Text>
                </View>

                <View style={styles.cardDetail}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Tanggal: {form.tanggalKunjungan}</Text>
                </View>

                <View style={styles.cardDetail}>
                  <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Dibuat oleh: {form.userName}</Text>
                </View>

                <View style={styles.cardDetail}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText} numberOfLines={2}>
                    Hasil: {form.hasilKunjungan}
                  </Text>
                </View>

                {form.kondisiAset && (
                  <View style={styles.cardDetail}>
                    <Ionicons name="cube-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText} numberOfLines={2}>
                      Kondisi Aset: {form.kondisiAset}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(form.id)}
                  >
                    <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApprove(form.id)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Bottom Spacing */}
          <View style={{ height: SCREEN_HEIGHT * 0.05 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: SCREEN_HEIGHT * 0.06,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextSubro: {
    fontSize: SCREEN_HEIGHT * 0.03,
    fontWeight: 'bold',
    color: '#1E3A8A',
    letterSpacing: 1,
  },
  logoTextGo: {
    fontSize: SCREEN_HEIGHT * 0.03,
    fontWeight: 'bold',
    color: '#3B82F6',
    letterSpacing: 1,
  },
  logoutButton: {
    padding: SCREEN_WIDTH * 0.02,
  },
  titleContainer: {
    paddingVertical: SCREEN_HEIGHT * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: SCREEN_HEIGHT * 0.02,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.1,
  },
  emptyText: {
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: SCREEN_HEIGHT * 0.02,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.015,
    paddingBottom: SCREEN_HEIGHT * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: 'bold',
    color: '#1E3A8A',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: 'bold',
    color: '#D97706',
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.01,
    gap: 8,
  },
  detailText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#374151',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.014,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  rejectButton: {
    backgroundColor: '#DC2626',
  },
  approveButton: {
    backgroundColor: '#16A34A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.018,
    fontWeight: '600',
  },
});
