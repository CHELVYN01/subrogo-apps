import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SimulasiScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [jumlahShs, setJumlahShs] = useState('');
  const [jangkaWaktu, setJangkaWaktu] = useState('');
  const [estimasi, setEstimasi] = useState('');
  const [checking, setChecking] = useState(true);

  // Check if user is manager
  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'manager') {
      // Not a manager, redirect back
      router.back();
      return;
    }

    setChecking(false);
  }, [user]);

  // Show loading while checking
  if (checking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Memeriksa akses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleHitung = () => {
    // Logic untuk menghitung estimasi angsuran
    // Contoh sederhana: jumlah SHS / jangka waktu
    const shs = parseFloat(jumlahShs.replace(/[^0-9]/g, ''));
    const waktu = parseFloat(jangkaWaktu);

    if (shs && waktu) {
      const result = shs / waktu;
      setEstimasi(`Rp. ${result.toLocaleString('id-ID')}`);
    }
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Jumlah SHS Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>JUMLAH SHS</Text>
          <TextInput
            style={styles.input}
            placeholder="Rp."
            placeholderTextColor="#999"
            value={jumlahShs}
            onChangeText={setJumlahShs}
            keyboardType="numeric"
          />
        </View>

        {/* Jangka Waktu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>JANGKA WAKTU</Text>
          <TextInput
            style={styles.input}
            placeholder="bulan"
            placeholderTextColor="#999"
            value={jangkaWaktu}
            onChangeText={setJangkaWaktu}
            keyboardType="numeric"
          />
        </View>

        {/* Hitung Button */}
        <TouchableOpacity style={styles.hitungButton} onPress={handleHitung}>
          <Text style={styles.hitungButtonText}>HITUNG</Text>
        </TouchableOpacity>

        {/* Estimasi Angsuran Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESTIMASI ANGSURAN PER BULAN</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{estimasi || 'Rp.'}</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: SCREEN_HEIGHT * 0.05 }} />
      </ScrollView>
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
    paddingHorizontal: SCREEN_WIDTH * 0.08,
  },
  section: {
    marginBottom: SCREEN_HEIGHT * 0.035,
  },
  sectionTitle: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    fontSize: SCREEN_HEIGHT * 0.02,
    color: '#000',
  },
  hitungButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    paddingVertical: SCREEN_HEIGHT * 0.024,
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.03,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  hitungButtonText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resultBox: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  resultText: {
    fontSize: SCREEN_HEIGHT * 0.02,
    color: '#000',
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
});
