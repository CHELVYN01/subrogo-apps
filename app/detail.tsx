import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Product {
  id: string;
  nomorKontrak: string;
  nomorRekening?: string;
  nama?: string;
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
    if (companyId) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [type, companyId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const collectionName = type === 'cac' ? 'customers' : 'products';
      const productsRef = collection(db, 'companies', companyId as string, collectionName);
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
            <Text style={styles.typeText}>{String(type || 'cac').toUpperCase()}</Text>
          </View>

          {/* Company Name */}
          <Text style={styles.nameTitle}>{name}</Text>

          {/* Product Type Badge */}
          {type === 'cbc' && produk && (
            <View style={styles.productBadge}>
              <Text style={styles.productText}>{produk}</Text>
            </View>
          )}

          {/* Products List (for both CBC and CAC) */}
          {products.length > 0 ? (
            products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                {/* Nomor Kontrak atau Nomor Rekening + Nama */}
                <View style={styles.cardHeader}>
                  <Ionicons name={type === 'cac' ? 'person' : 'document-text'} size={20} color="#1E3A8A" />
                  <Text style={styles.contractNumber}>
                    {type === 'cac' ? product.nomorRekening : product.nomorKontrak}
                    {type === 'cac' && product.nama ? ` - ${product.nama}` : ''}
                  </Text>
                </View>

                {/* Product Type (if available) */}
                {product.jenisProduct && (
                  <View style={styles.productTypeBadge}>
                    <Text style={styles.productTypeText}>{product.jenisProduct}</Text>
                  </View>
                )}

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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push({
          pathname: '/form-kunjungan',
          params: {
            bankName: name,
            type: type
          }
        })}
      >
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
    backgroundColor: '#2563EB',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.025,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: 'bold',
    letterSpacing: 2,
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
  productTypeBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  productTypeText: {
    fontSize: SCREEN_HEIGHT * 0.012,
    fontWeight: '600',
    color: '#4F46E5',
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
