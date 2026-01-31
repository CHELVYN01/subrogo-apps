import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Product {
  id: string;
  nomorKontrak: string;
  jenisProduct: string;
  piutang: number;
  angsuran: number;
  sisaHakSubrogasi: number;
}

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name, type, companyId, produk } = params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === 'cbc' && companyId) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [type, companyId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'companies', companyId as string, 'products');
      const querySnapshot = await getDocs(productsRef);

      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  // Data dummy untuk CAC (kalau type = 'cac')
  const cacData = [
    { nama: 'UNIT A', alamat: 'X', product: 'X', angsuran: 'X', shs: 'X' },
    { nama: 'UNIT B', alamat: 'X', product: 'X', angsuran: 'X', shs: 'X' },
    { nama: 'UNIT C', alamat: 'X', product: 'X', angsuran: 'X', shs: 'X' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logo and Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          // Kembali ke screen sebelumnya (cac atau cbc)
          if (type === 'cac') {
            router.push('/cac');
          } else {
            router.push('/cbc');
          }
        }}>
          <Ionicons name="arrow-back" size={SCREEN_HEIGHT * 0.03} color="#1E3A8A" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextSubro}>SUBRO</Text>
          <Text style={styles.logoTextGo}>GO</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Memuat data produk...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Box (cac/cbc) */}
          <View style={styles.typeBox}>
            <Text style={styles.typeText}>{type || 'cac'}</Text>
          </View>

          {/* Company Name */}
          <Text style={styles.nameTitle}>{name}</Text>

          {/* Product Type Badge */}
          {type === 'cbc' && produk && (
            <View style={styles.productBadge}>
              <Text style={styles.productText}>{produk}</Text>
            </View>
          )}

          {/* CBC Products */}
          {type === 'cbc' && products.length > 0 ? (
            products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                {/* Nomor Kontrak */}
                <View style={styles.cardHeader}>
                  <Ionicons name="document-text" size={20} color="#1E3A8A" />
                  <Text style={styles.contractNumber}>{product.nomorKontrak}</Text>
                </View>

                {/* Product Info */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Piutang</Text>
                    <Text style={styles.infoValue}>{formatNumber(product.piutang)}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Angsuran</Text>
                    <Text style={[styles.infoValue, styles.angsuranValue]}>
                      {formatNumber(product.angsuran)}
                    </Text>
                  </View>

                  <View style={[styles.infoItem, styles.infoItemFull]}>
                    <Text style={styles.infoLabel}>Sisa Hak Subrogasi</Text>
                    <Text style={[styles.infoValue, styles.sisaValue]}>
                      {formatNumber(product.sisaHakSubrogasi)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : type === 'cac' ? (
            // CAC Table View
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Nama</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Alamat</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>product</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Angsu{'\n'}ran</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>SHS</Text>
                </View>
              </View>

              {cacData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>{item.nama}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>{item.alamat}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>{item.product}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>{item.angsuran}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={styles.cellText}>{item.shs}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={SCREEN_HEIGHT * 0.08} color="#9CA3AF" />
              <Text style={styles.emptyText}>Tidak ada data produk</Text>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: SCREEN_HEIGHT * 0.1 }} />
        </ScrollView>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/form-kunjungan')}>
        <Ionicons name="add" size={SCREEN_HEIGHT * 0.04} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: SCREEN_HEIGHT * 0.06,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  typeBox: {
    backgroundColor: '#3B82F6',
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.02,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: '600',
  },
  nameTitle: {
    color: '#1E3A8A',
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  productBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  productText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: '600',
    color: '#1E40AF',
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
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SCREEN_HEIGHT * 0.015,
    paddingBottom: SCREEN_HEIGHT * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contractNumber: {
    flex: 1,
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '600',
    color: '#1E3A8A',
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
  tableContainer: {
    marginBottom: SCREEN_HEIGHT * 0.1,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  headerCell: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 4,
    minHeight: SCREEN_HEIGHT * 0.06,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  cell: {
    flex: 1,
    backgroundColor: '#BFDBFE',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 4,
    minHeight: SCREEN_HEIGHT * 0.05,
  },
  cellText: {
    color: '#1E3A8A',
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '500',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.03,
    right: SCREEN_WIDTH * 0.06,
    backgroundColor: '#1E3A8A',
    width: SCREEN_HEIGHT * 0.075,
    height: SCREEN_HEIGHT * 0.075,
    borderRadius: SCREEN_HEIGHT * 0.0375,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
