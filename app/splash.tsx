import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation values
  const logoTranslateY = useSharedValue(0);
  const bottomAccentOpacity = useSharedValue(1);
  const formOpacity = useSharedValue(0);
  const topAccentHeight = useSharedValue(0);

  useEffect(() => {
    // Start animation after 2 seconds
    setTimeout(() => {
      // Move logo up
      logoTranslateY.value = withTiming(-150, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Fade out bottom accent
      bottomAccentOpacity.value = withTiming(0, {
        duration: 600,
      });

      // Show top accent
      topAccentHeight.value = withTiming(8, {
        duration: 600,
      });

      // Fade in form with delay
      formOpacity.value = withDelay(
        400,
        withTiming(1, {
          duration: 600,
        })
      );
    }, 2000);
  }, [logoTranslateY, bottomAccentOpacity, topAccentHeight, formOpacity]);

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
      console.error('Login error:', error);
      let errorMessage = 'Terjadi kesalahan saat login';

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email atau password salah. Pastikan Anda sudah membuat user di Firebase Authentication dengan password yang benar.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User tidak ditemukan. Pastikan user sudah dibuat di Firebase Authentication.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Login Gagal',
        errorMessage + '\n\nPastikan:\n1. Email/Password Auth sudah enabled di Firebase\n2. User sudah dibuat di Authentication\n3. Password benar (staff123 atau manager123)\n4. Firestore collection "users" sudah dibuat dengan role',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const bottomAccentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bottomAccentOpacity.value,
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const topAccentAnimatedStyle = useAnimatedStyle(() => ({
    height: topAccentHeight.value,
  }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Accent (animated) */}
        <Animated.View style={[styles.topAccent, topAccentAnimatedStyle]} />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo (animated) */}
          <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoTextSubro}>SUBRO</Text>
              <Text style={styles.logoTextGo}>GO</Text>
            </View>

            {/* Tagline */}
            <Text style={styles.tagline}>Anti Ribet Antri Drama</Text>
          </Animated.View>

          {/* Form Container (animated) */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
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

            {/* Demo Info */}
         
          </Animated.View>
        </View>

        {/* Bottom Accent (animated) */}
        <Animated.View style={[styles.bottomAccent, bottomAccentAnimatedStyle]} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E3A8A',
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.1,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  logoTextSubro: {
    marginTop: SCREEN_HEIGHT * 0.2,
    fontSize: SCREEN_HEIGHT * 0.04,
    fontWeight: 'bold',
    color: '#1E3A8A',
    letterSpacing: 2,
  },
  logoTextGo: {
    marginTop: SCREEN_HEIGHT * 0.2,

    fontSize: SCREEN_HEIGHT * 0.04,
    fontWeight: 'bold',
    color: '#3B82F6',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#1E3A8A',
    marginTop: -1,
    fontWeight: '500',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.12,
    backgroundColor: '#E0F2FE',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginTop: SCREEN_HEIGHT * 0.05,
  },
  inputGroup: {
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  label: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#1E3A8A',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#1F2937',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  demoInfo: {
    marginTop: SCREEN_HEIGHT * 0.03,
    paddingTop: SCREEN_HEIGHT * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#1E3A8A',
    fontWeight: '600',
    marginBottom: 8,
  },
  demoText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: '#6B7280',
    marginBottom: 4,
  },
});
