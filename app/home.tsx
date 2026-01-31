import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
      {/* Header with Logo and Logout */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextSubro}>SUBRO</Text>
          <Text style={styles.logoTextGo}>GO</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={SCREEN_HEIGHT * 0.03} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role === 'manager' ? 'MANAGER' : 'STAFF'}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {user?.role === 'manager' ? (
          // Manager View - Show Dashboard Button and Simulasi
          <>
            <TouchableOpacity style={styles.managerButton} onPress={() => router.push('/manager-dashboard')}>
              <Ionicons name="clipboard-outline" size={SCREEN_HEIGHT * 0.04} color="#FFFFFF" />
              <Text style={styles.managerButtonText}>Manager Dashboard</Text>
              <Text style={styles.managerButtonSubtext}>Lihat & Approve Forms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simulasiButton} onPress={() => router.push('/simulasi')}>
              <Text style={styles.simulasiButtonText}>Simulasi Angsuran</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Staff View - Show regular buttons only
          <>
            <TouchableOpacity style={styles.blueButton} onPress={() => router.push('/cac')}>
              <Text style={styles.blueButtonText}>CAC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blueButton} onPress={() => router.push('/cbc')}>
              <Text style={styles.blueButtonText}>CBC</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    gap: SCREEN_HEIGHT * 0.03,
  },
  blueButton: {
    backgroundColor: '#1E3A8A',
    width: SCREEN_WIDTH * 0.65,
    paddingVertical: SCREEN_HEIGHT * 0.04,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  blueButtonText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.032,
    fontWeight: '700',
    letterSpacing: 1,
  },
  simulasiButton: {
    backgroundColor: '#F3F4F6',
    width: SCREEN_WIDTH * 0.7,
    paddingVertical: SCREEN_HEIGHT * 0.024,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  simulasiButtonText: {
    color: '#374151',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: '600',
  },
  userInfo: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  managerButton: {
    backgroundColor: '#1E3A8A',
    width: SCREEN_WIDTH * 0.75,
    paddingVertical: SCREEN_HEIGHT * 0.04,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  managerButtonText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: '700',
    marginTop: 8,
  },
  managerButtonSubtext: {
    color: '#BFDBFE',
    fontSize: SCREEN_HEIGHT * 0.016,
    marginTop: 4,
  },
});
