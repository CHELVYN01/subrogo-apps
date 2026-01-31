import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon isi email dan password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Login berhasil, navigasi ke home
      router.replace('/home');
    } catch (error: any) {
      // Login gagal, tampilkan alert
      let errorMessage = 'Terjadi kesalahan saat login';

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email atau password salah';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User tidak ditemukan';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Login Gagal',
        errorMessage + '\n\nDemo Users:\nStaff: staff@subrogo.com / staff123\nManager: manager@subrogo.com / manager123',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Accent */}
      <View style={styles.topAccent} />

      {/* Logo at top */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoTextSubro}>SUBRO</Text>
        <Text style={styles.logoTextGo}>GO</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>Anti Ribet Antri Drama</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email :</Text>
          <TextInput
            style={styles.input}
            placeholder="staff@subrogo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password :</Text>
          <TextInput
            style={styles.input}
            placeholder="staff123"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>MASUK</Text>
          )}
        </TouchableOpacity>

        {/* Demo Users Info */}
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#1E3A8A',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 4,
  },
  logoTextSubro: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
    letterSpacing: 2,
  },
  logoTextGo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 12,
    color: '#1E3A8A',
    marginBottom: 10,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#1E3A8A',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loginButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  demoInfo: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
});
