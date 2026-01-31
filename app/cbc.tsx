import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Company {
  id: string;
  nama: string;
  produk: string;
  piutang: number;
  angsuran: number;
  sisaHakSubrogasi: number;
}

export default function CBCScreen() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'companies'), where('type', '==', 'cbc'));
      const querySnapshot = await getDocs(q);

      const companiesData: Company[] = [];
      querySnapshot.forEach((doc) => {
        companiesData.push({
          id: doc.id,
          ...doc.data()
        } as Company);
      });

      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCompanies();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logo and Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={SCREEN_HEIGHT * 0.03} color="#1E3A8A" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextSubro}>SUBRO</Text>
          <Text style={styles.logoTextGo}>GO</Text>
        </View>
      </View>

      {/* CBC Title Box */}
      <View style={styles.titleContainer}>
        <View style={styles.cbcBox}>
          <Text style={styles.cbcText}>CBC</Text>
        </View>
        <Text style={styles.subtitle}>Corporate Banking Credit</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Memuat data perusahaan...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A8A']} />
          }
        >
          {companies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={SCREEN_HEIGHT * 0.08} color="#9CA3AF" />
              <Text style={styles.emptyText}>Belum ada data perusahaan</Text>
            </View>
          ) : (
            companies.map((company) => (
              <TouchableOpacity
                key={company.id}
                style={styles.companyCard}
                onPress={() => router.push({
                  pathname: '/detail',
                  params: {
                    companyId: company.id,
                    type: 'cbc',
                    name: company.nama,
                    produk: company.produk
                  }
                })}
                activeOpacity={0.7}
              >
                {/* Company Name Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Ionicons name="business" size={20} color="#1E3A8A" />
                    <Text style={styles.companyName} numberOfLines={2}>
                      {company.nama}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </View>

                {/* Product Badge */}
                <View style={styles.productBadge}>
                  <Text style={styles.productText}>{company.produk}</Text>
                </View>

                {/* Financial Info Grid */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Piutang</Text>
                    <Text style={styles.infoValue}>{formatNumber(company.piutang)}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Angsuran</Text>
                    <Text style={[styles.infoValue, styles.angsuranValue]}>
                      {formatNumber(company.angsuran)}
                    </Text>
                  </View>

                  <View style={[styles.infoItem, styles.infoItemFull]}>
                    <Text style={styles.infoLabel}>Sisa Hak Subrogasi</Text>
                    <Text style={[styles.infoValue, styles.sisaValue]}>
                      {formatNumber(company.sisaHakSubrogasi)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
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
  backButton: {
    padding: SCREEN_WIDTH * 0.02,
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
  titleContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    backgroundColor: '#FFFFFF',
  },
  cbcBox: {
    backgroundColor: '#2563EB',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  cbcText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 8,
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#6B7280',
    fontWeight: '500',
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
  companyCard: {
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
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
    paddingBottom: SCREEN_HEIGHT * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  companyName: {
    flex: 1,
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  productBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  productText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: '600',
    color: '#1E40AF',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: SCREEN_WIDTH * 0.03,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  infoItemFull: {
    minWidth: '100%',
    borderLeftColor: '#10B981',
  },
  infoLabel: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  angsuranValue: {
    color: '#F59E0B',
  },
  sisaValue: {
    color: '#10B981',
  },
});
