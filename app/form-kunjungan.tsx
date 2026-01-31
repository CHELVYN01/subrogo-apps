import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Signature from 'react-native-signature-canvas';
import { useAuth } from '../context/AuthContext';
import { createForm } from '../services/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FormScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const [formData, setFormData] = useState({
    namaNasabah: '',
    nomorKontak: '',
    alamatNasabah: '',
    tanggalKunjungan: '',
    jumlahTunggakan: '',
    hasilKunjungan: '',
    kondisiAset: '',
    tindakLanjut: '',
  });
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState('');
  const [type, setType] = useState<'cac' | 'cbc'>('cac');
  const [showTtdModal, setShowTtdModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  // const [showTtdMitraModal, setShowTtdMitraModal] = useState(false);
  const [currentTtdType, setCurrentTtdType] = useState<'pic' | 'mitra' | null>(null);
  const [companyId, setCompanyId] = useState('');
  const [customerData, setCustomerData] = useState<any[]>([]);


  // State untuk gambar
  const [ttdPicImage, setTtdPicImage] = useState<string | null>(null);
  const [ttdMitraImage, setTtdMitraImage] = useState<string | null>(null);
  const [dokumentasiImage, setDokumentasiImage] = useState<string | null>(null);
  const [dokumentasiType, setDokumentasiType] = useState<'image' | 'pdf' | null>(null);
  const [ttdPicRefreshKey, setTtdPicRefreshKey] = useState(0);
  const [ttdMitraRefreshKey, setTtdMitraRefreshKey] = useState(0);

  // Auto-fill nama bank dari parameter dan load customer data
  useEffect(() => {
    if (params.bankName) {
      const name = params.bankName as string;
      setBankName(name);

      // Auto-fill nama nasabah dengan nama bank
      setFormData(prev => ({
        ...prev,
        namaNasabah: name
      }));

      // Load company ID dan customer data
      loadCompanyAndCustomers(name);
    }
    if (params.type) {
      setType(params.type as 'cac' | 'cbc');
    }
  }, [params.bankName, params.type]);

  // Load company ID dan customer data
  const loadCompanyAndCustomers = async (companyName: string) => {
    try {
      console.log('=== LOADING COMPANY AND CUSTOMERS ===');
      console.log('Company Name:', companyName);

      const q = query(
        collection(db, 'companies'),
        where('nama', '==', companyName)
      );

      const querySnapshot = await getDocs(q);
      console.log('Company query results:', querySnapshot.size);

      if (!querySnapshot.empty) {
        const companyDoc = querySnapshot.docs[0];
        const compId = companyDoc.id;
        console.log('Company ID:', compId);
        setCompanyId(compId);

        // Load customers
        const customersRef = collection(db, 'companies', compId, 'customers');
        const customersSnapshot = await getDocs(customersRef);
        console.log('Customers found:', customersSnapshot.size);

        const customers: any[] = [];
        customersSnapshot.forEach((doc) => {
          const customerData = {
            id: doc.id,
            ...doc.data()
          };
          console.log('Customer loaded:', customerData);
          customers.push(customerData);
        });

        setCustomerData(customers);
        console.log(`Loaded ${customers.length} customers for ${companyName}`);
      } else {
        console.warn('No company found with name:', companyName);
      }
    } catch (error) {
      console.error('Error loading company and customers:', error);
    }
  };

  // Debug TTD changes
  useEffect(() => {
    console.log('TTD PIC updated:', ttdPicImage ? `${ttdPicImage.substring(0, 50)}...` : 'null');
    console.log('TTD Mitra updated:', ttdMitraImage ? `${ttdMitraImage.substring(0, 50)}...` : 'null');
    console.log('PIC Refresh key:', ttdPicRefreshKey);
    console.log('Mitra Refresh key:', ttdMitraRefreshKey);
  }, [ttdPicImage, ttdMitraImage, ttdPicRefreshKey, ttdMitraRefreshKey]);

  // Request permission untuk kamera dan galeri
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Perhatian', 'Aplikasi memerlukan izin akses kamera dan galeri untuk mengupload gambar.');
      }
    })();
  }, []);

  // Fungsi untuk memilih gambar
  const pickImage = async (type: 'ttdPic' | 'ttdMitra' | 'dokumentasi') => {
    Alert.alert(
      'Pilih Gambar',
      'Pilih sumber gambar',
      [
        {
          text: 'Kamera',
          onPress: () => openCamera(type),
        },
        {
          text: 'Galeri',
          onPress: () => openGallery(type),
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async (type: 'ttdPic' | 'ttdMitra' | 'dokumentasi') => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      if (type === 'ttdPic') {
        setTtdPicImage(imageUri);
        setTtdPicRefreshKey(prev => prev + 1);
      } else if (type === 'ttdMitra') {
        setTtdMitraImage(imageUri);
        setTtdMitraRefreshKey(prev => prev + 1);
      } else {
        setDokumentasiImage(imageUri);
      }
    }
  };

  const openGallery = async (type: 'ttdPic' | 'ttdMitra' | 'dokumentasi') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      if (type === 'ttdPic') {
        setTtdPicImage(imageUri);
        setTtdPicRefreshKey(prev => prev + 1);
      } else if (type === 'ttdMitra') {
        setTtdMitraImage(imageUri);
        setTtdMitraRefreshKey(prev => prev + 1);
      } else {
        setDokumentasiImage(imageUri);
      }
    }
  };

  const pickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'], // bisa gambar & PDF
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setDokumentasiImage(file.uri);

    // Deteksi tipe file
    if (file.mimeType?.includes('pdf')) {
      setDokumentasiType('pdf');
    } else {
      setDokumentasiType('image');
    }
  } catch (err) {
    console.log('Error picking file:', err);
  }
};

  // Generate PDF function
  const generatePDF = async () => {
    try {
      console.log('=== GENERATE PDF STARTED ===');
      console.log('Customer Data Length:', customerData.length);
      console.log('Customer Data:', JSON.stringify(customerData, null, 2));

      // Build customer table rows
      let customerRows = '';
      if (customerData.length > 0) {
        console.log('Building customer rows for', customerData.length, 'customers');
        customerRows = customerData.map((customer, index) => {
          console.log(`Row ${index + 1}:`, customer.nama, customer.nomorRekening, customer.piutang, customer.sisaHakSubrogasi);
          return `
          <tr>
            <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #000; padding: 8px;">${customer.nama || '-'}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: center;">${customer.nomorRekening || '-'}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right;">${customer.piutang ? customer.piutang.toLocaleString('id-ID') : '-'}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right;">${customer.sisaHakSubrogasi ? customer.sisaHakSubrogasi.toLocaleString('id-ID') : '-'}</td>
          </tr>
        `;
        }).join('');
        console.log('Customer rows HTML length:', customerRows.length);
      } else {
        console.log('No customer data - showing empty message');
        customerRows = `
          <tr>
            <td colspan="5" style="border: 1px solid #000; padding: 16px; text-align: center; color: #666;">
              Tidak ada data nasabah
            </td>
          </tr>
        `;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 15px;
              margin: 0;
              font-size: 12px;
            }
            h1 {
              text-align: center;
              font-size: 16px;
              margin-bottom: 15px;
              margin-top: 5px;
              text-decoration: underline;
              font-weight: bold;
            }
            h2 {
              text-align: center;
              font-size: 14px;
              margin-top: 15px;
              margin-bottom: 10px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              font-size: 11px;
            }
            .info-table td {
              padding: 5px 8px;
              border: 1px solid #000;
              line-height: 1.3;
            }
            .info-table .label {
              font-weight: bold;
              width: 38%;
              background-color: #f5f5f5;
            }
            .customer-table {
              margin-top: 10px;
              font-size: 10px;
            }
            .customer-table th {
              background-color: #1E3A8A;
              color: white;
              padding: 6px 4px;
              border: 1px solid #000;
              text-align: center;
              font-weight: bold;
            }
            .customer-table td {
              padding: 4px;
              border: 1px solid #000;
              line-height: 1.2;
            }
            .signature-section {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Form Laporan Kunjungan Nasabah Nunggak</h1>

          <table class="info-table">
            <tr>
              <td class="label">Tanggal Kunjungan</td>
              <td>${formData.tanggalKunjungan || '-'}</td>
            </tr>
            <tr>
              <td class="label">Nama Petugas</td>
              <td>${user?.name || '-'}</td>
            </tr>
            <tr>
              <td class="label">Nama Nasabah</td>
              <td>${formData.namaNasabah || '-'}</td>
            </tr>
            <tr>
              <td class="label">Nomor Kontak</td>
              <td>${formData.nomorKontak || '-'}</td>
            </tr>
            <tr>
              <td class="label">Alamat Nasabah</td>
              <td>${formData.alamatNasabah || '-'}</td>
            </tr>
            <tr>
              <td class="label">Jumlah Tunggakan (Rp)</td>
              <td>${formData.jumlahTunggakan || '-'}</td>
            </tr>
            <tr>
              <td class="label">Hasil Kunjungan</td>
              <td>${formData.hasilKunjungan || '-'}</td>
            </tr>
            <tr>
              <td class="label">Kondisi Aset</td>
              <td>${formData.kondisiAset || '-'}</td>
            </tr>
            <tr>
              <td class="label">Tindak Lanjut</td>
              <td>${formData.tindakLanjut || '-'}</td>
            </tr>
          </table>

          <h2 style="text-align: center; font-size: 16px; margin-top: 30px;">Data Nasabah ${bankName}</h2>

          <table class="customer-table">
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 30%;">Nama Nasabah</th>
                <th style="width: 20%;">Nomor Rekening</th>
                <th style="width: 22.5%;">Piutang (Rp)</th>
                <th style="width: 22.5%;">Sisa Hak Subrogasi (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${customerRows}
            </tbody>
          </table>

          <div style="margin-top: 25px; display: table; width: 100%;">
            <div style="display: table-row;">
              <div style="display: table-cell; width: 50%; text-align: center; padding: 10px; vertical-align: top;">
                <p style="margin-bottom: 5px; font-weight: bold; font-size: 11px;">Tanda Tangan Petugas:</p>
                <div style="height: 60px; margin: 5px auto; display: flex; align-items: center; justify-content: center; position: relative;">
                  ${ttdPicImage ? `
                    <img src="${ttdPicImage}" style="max-width: 180px; max-height: 55px;" />
                  ` : ''}
                </div>
                <div style="border-top: 1px solid #000; width: 180px; margin: 0 auto; padding-top: 3px; font-size: 11px;">
                  ${user?.name || '_______________'}
                </div>
              </div>
              <div style="display: table-cell; width: 50%; text-align: center; padding: 10px; vertical-align: top;">
                <p style="margin-bottom: 5px; font-weight: bold; font-size: 11px;">Tanda Tangan Nasabah (jika ada):</p>
                <div style="height: 60px; margin: 5px auto; display: flex; align-items: center; justify-content: center; position: relative;">
                  ${ttdMitraImage ? `
                    <img src="${ttdMitraImage}" style="max-width: 180px; max-height: 55px;" />
                  ` : ''}
                </div>
                <div style="border-top: 1px solid #000; width: 180px; margin: 0 auto; padding-top: 3px; font-size: 11px;">
                  _______________
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      console.log('PDF created at:', uri);

      // Share PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Form Laporan Kunjungan Nasabah',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('Sukses', 'PDF berhasil dibuat di: ' + uri);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Gagal membuat PDF');
    }
  };


  const handleSubmit = async () => {
    console.log('=== SUBMIT STARTED ===');
    console.log('Form data:', formData);
    console.log('TTD PIC:', ttdPicImage ? 'OK' : 'MISSING');
    console.log('TTD Mitra:', ttdMitraImage ? 'OK' : 'MISSING');
    console.log('User:', user?.uid);
    console.log('Bank Name:', bankName);

    // Validasi field wajib
    if (!formData.namaNasabah || !formData.nomorKontak || !formData.alamatNasabah ||
        !formData.tanggalKunjungan || !formData.jumlahTunggakan || !formData.hasilKunjungan ||
        !formData.kondisiAset || !formData.tindakLanjut) {
      console.log('Validation failed: missing required fields');
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    if (!user) {
      console.log('Validation failed: no user');
      Alert.alert('Error', 'Anda harus login terlebih dahulu');
      return;
    }

    if (!bankName) {
      console.log('Validation failed: no bank name');
      Alert.alert('Error', 'Data bank tidak ditemukan. Silakan kembali dan pilih bank terlebih dahulu.');
      return;
    }

    // Validasi gambar TTD
    if (!ttdPicImage || !ttdMitraImage) {
      console.log('Validation failed: missing TTD');
      Alert.alert('Error', 'Mohon isi Tanda Tangan Petugas dan Tanda Tangan Nasabah');
      return;
    }

    try {
      console.log('Setting loading to true...');
      setLoading(true);

      // Demo mode: Simulasi delay upload tanpa upload sebenarnya
      console.log('Simulating file upload for demo...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Gunakan URL dummy untuk demo
      const ttdPicUrl = ttdPicImage;
      const ttdMitraUrl = ttdMitraImage;
      const dokumentasiUrl = dokumentasiImage || '';

      console.log('Creating form data object...');
      const formPayload = {
        ...formData,
        userId: user.uid,
        userName: user.name,
        userEmail: user.email || '',
        type: type,
        bankName: bankName,
        unitName: bankName,
        namaUnitKerja: bankName,
        picUnitKerja: user.name,
        dokumentasi: dokumentasiUrl,
        ttdPic: ttdPicUrl,
        ttdMitra: ttdMitraUrl,
      };
      console.log('Form payload:', formPayload);

      // Simpan data form ke Firestore
      console.log('Saving form to Firestore...');
      await createForm(formPayload);

      console.log('Form saved successfully!');

      // Generate PDF setelah form disimpan
      await generatePDF();

      Alert.alert(
        'Berhasil',
        'Form kunjungan berhasil disimpan dan PDF telah digenerate',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigating back...');
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('=== ERROR SUBMITTING FORM ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error?.message || 'Gagal menyimpan form');
    } finally {
      console.log('Setting loading to false...');
      setLoading(false);
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
        {/* Form Title */}
        <Text style={styles.formTitle}>Form Kunjungan</Text>

        {/* Form Fields - 8 fields tanpa label huruf */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Nasabah</Text>
          <TextInput
            style={[styles.input, styles.inputDotted, styles.inputReadonly]}
            placeholder="Masukkan nama nasabah"
            placeholderTextColor="#999"
            value={formData.namaNasabah}
            onChangeText={(text) => setFormData({ ...formData, namaNasabah: text })}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nomor Kontak</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="Masukkan nomor kontak"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={formData.nomorKontak}
            onChangeText={(text) => setFormData({ ...formData, nomorKontak: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alamat Nasabah</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="Masukkan alamat lengkap"
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            value={formData.alamatNasabah}
            onChangeText={(text) => setFormData({ ...formData, alamatNasabah: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tanggal Kunjungan</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#999"
            value={formData.tanggalKunjungan}
            onChangeText={(text) => setFormData({ ...formData, tanggalKunjungan: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Jumlah Tunggakan (Rp)</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="Contoh: 60.512.200"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData.jumlahTunggakan}
            onChangeText={(text) => setFormData({ ...formData, jumlahTunggakan: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hasil Kunjungan</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="Deskripsi hasil kunjungan"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={formData.hasilKunjungan}
            onChangeText={(text) => setFormData({ ...formData, hasilKunjungan: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kondisi Aset</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="Deskripsi kondisi aset"
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            value={formData.kondisiAset}
            onChangeText={(text) => setFormData({ ...formData, kondisiAset: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tindak Lanjut</Text>
          <TextInput
            style={[styles.input, styles.inputDotted]}
            placeholder="Rencana tindak lanjut"
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            value={formData.tindakLanjut}
            onChangeText={(text) => setFormData({ ...formData, tindakLanjut: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dokumentasi Kunjungan (Opsional)</Text>
          {dokumentasiImage ? (
            <View style={styles.imagePreviewContainer}>
              {dokumentasiType === 'pdf' ? (
                <View style={styles.pdfPreview}>
                  <Ionicons name="document-text" size={SCREEN_HEIGHT * 0.08} color="#EF4444" />
                  <Text style={styles.pdfText}>File PDF Terpilih</Text>
                  <Text style={styles.pdfSubtext}>File akan diupload saat submit</Text>
                </View>
              ) : (
                <Image source={{ uri: dokumentasiImage }} style={styles.imagePreview} />
              )}
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickFile}
                disabled={loading}
              >
                <Ionicons name="cloud-upload-outline" size={SCREEN_HEIGHT * 0.02} color="#FFFFFF" />
                <Text style={styles.changeImageText}>Update File</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickFile}
              disabled={loading}
            >
              <Ionicons name="cloud-upload-outline" size={SCREEN_HEIGHT * 0.025} color="#FFFFFF" />
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          )}

        </View>

        {/* TTD Boxes */}
        <View style={styles.ttdContainer}>
          {/* TTD PIC */}
          <TouchableOpacity
            style={styles.ttdBox}
            onPress={() => {
              setCurrentTtdType('pic');
              setShowMethodModal(true);
            }}
            disabled={loading}
          >
            {ttdPicImage ? (
              <Image
                key={`pic-${ttdPicRefreshKey}`}
                source={{ uri: ttdPicImage }}
                style={styles.ttdImageWrapper}
                resizeMode="contain"
                onError={(e) => console.log('Error loading TTD PIC:', e.nativeEvent.error)}
                onLoad={() => console.log('TTD PIC loaded successfully')}
              />
            ) : (
              <>
                <Ionicons name="add" size={SCREEN_HEIGHT * 0.05} color="#999" />
                <Text style={styles.ttdLabel}>TTD Petugas</Text>
              </>
            )}
          </TouchableOpacity>

          {/* TTD Mitra/Nasabah */}
          <TouchableOpacity
            style={styles.ttdBox}
            onPress={() => {
              setCurrentTtdType('mitra');
              setShowMethodModal(true);
            }}
            disabled={loading}
          >
            {ttdMitraImage ? (
              <Image
                key={`mitra-${ttdMitraRefreshKey}`}
                source={{ uri: ttdMitraImage }}
                style={styles.ttdImageWrapper}
                resizeMode="contain"
                onError={(e) => console.log('Error loading TTD Mitra:', e.nativeEvent.error)}
                onLoad={() => console.log('TTD Mitra loaded successfully')}
              />
            ) : (
              <>
                <Ionicons name="add" size={SCREEN_HEIGHT * 0.05} color="#999" />
                <Text style={styles.ttdLabel}>TTD Nasabah</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Modal Pilihan Metode TTD */}
          <Modal
            visible={showMethodModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowMethodModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {currentTtdType === 'pic' ? 'Tanda Tangan Petugas' : 'Tanda Tangan Nasabah'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMethodModal(false);
                      setCurrentTtdType(null);
                    }}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={SCREEN_HEIGHT * 0.025} color="#1E3A8A" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>Pilih metode tanda tangan</Text>

                <TouchableOpacity
                  style={styles.methodButton}
                  onPress={() => {
                    setShowMethodModal(false);
                    setShowTtdModal(true);
                  }}
                >
                  <Ionicons name="create-outline" size={SCREEN_HEIGHT * 0.03} color="#1E3A8A" />
                  <Text style={styles.methodButtonText}>Tanda Tangan Langsung</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.methodButton}
                  onPress={() => {
                    setShowMethodModal(false);
                    if (currentTtdType === 'pic') {
                      openGallery('ttdPic');
                    } else {
                      openGallery('ttdMitra');
                    }
                    setCurrentTtdType(null);
                  }}
                >
                  <Ionicons name="images-outline" size={SCREEN_HEIGHT * 0.03} color="#1E3A8A" />
                  <Text style={styles.methodButtonText}>Upload dari Galeri</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.methodButton}
                  onPress={() => {
                    setShowMethodModal(false);
                    if (currentTtdType === 'pic') {
                      openCamera('ttdPic');
                    } else {
                      openCamera('ttdMitra');
                    }
                    setCurrentTtdType(null);
                  }}
                >
                  <Ionicons name="camera-outline" size={SCREEN_HEIGHT * 0.03} color="#1E3A8A" />
                  <Text style={styles.methodButtonText}>Ambil Foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Single Modal Signature */}
          <Modal visible={showTtdModal} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
              <View style={styles.signatureHeader}>
                <Text style={styles.signatureTitle}>
                  {currentTtdType === 'pic' ? 'Tanda Tangan Petugas' : 'Tanda Tangan Nasabah'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowTtdModal(false);
                    setCurrentTtdType(null);
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={SCREEN_HEIGHT * 0.03} color="#1E3A8A" />
                </TouchableOpacity>
              </View>
              <Signature
                key={currentTtdType} // penting agar webview refresh tiap tipe berubah
                onOK={(img) => {
                  if (currentTtdType === 'pic') {
                    setTtdPicImage(img);
                    setTtdPicRefreshKey(prev => prev + 1);
                  } else if (currentTtdType === 'mitra') {
                    setTtdMitraImage(img);
                    setTtdMitraRefreshKey(prev => prev + 1);
                  }
                  setShowTtdModal(false);
                  setCurrentTtdType(null);
                }}
                onEmpty={() => console.log('Kosong')}
                onClear={() => console.log('Dihapus')}
                descriptionText={
                  currentTtdType === 'pic'
                    ? 'Tanda tangan Petugas di bawah ini'
                    : 'Tanda tangan Nasabah di bawah ini'
                }
                clearText="Hapus"
                confirmText="Simpan"
                webStyle={`.m-signature-pad--footer {display: flex; justify-content: space-between;}`}
              />
            </SafeAreaView>
          </Modal>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={SCREEN_HEIGHT * 0.03} color="#FFFFFF" />
              <Text style={styles.submitText}>Submit Form</Text>
            </>
          )}
        </TouchableOpacity>

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
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  formTitle: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: SCREEN_HEIGHT * 0.03,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  formGroup: {
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  label: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#000',
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: SCREEN_HEIGHT * 0.01,
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#000',
  },
  inputReadonly: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  inputDotted: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dotted',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: SCREEN_HEIGHT * 0.014,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: SCREEN_WIDTH * 0.02,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.018,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: SCREEN_HEIGHT * 0.01,
    alignItems: 'center',
  },
  imagePreview: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: SCREEN_HEIGHT * 0.012,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    borderRadius: 8,
    marginTop: SCREEN_HEIGHT * 0.015,
    gap: SCREEN_WIDTH * 0.02,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: '600',
  },
  ttdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.03,
    marginBottom: SCREEN_HEIGHT * 0.03,
    gap: SCREEN_WIDTH * 0.04,
  },
  ttdBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    minHeight: SCREEN_HEIGHT * 0.2,
    paddingVertical: SCREEN_HEIGHT * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ttdImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ttdLabel: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#999',
    marginTop: SCREEN_HEIGHT * 0.01,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3A8A',
    paddingVertical: SCREEN_HEIGHT * 0.018,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    borderRadius: 8,
    gap: SCREEN_WIDTH * 0.02,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
  },
  signatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  signatureTitle: {
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  closeButton: {
    padding: SCREEN_WIDTH * 0.02,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    width: SCREEN_HEIGHT * 0.04,
    height: SCREEN_HEIGHT * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfPreview: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
  },
  pdfText: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  pdfSubtext: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#6B7280',
    marginTop: SCREEN_HEIGHT * 0.005,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.85,
    padding: SCREEN_WIDTH * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  modalTitle: {
    fontSize: SCREEN_HEIGHT * 0.024,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  modalSubtitle: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#6B7280',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: SCREEN_HEIGHT * 0.018,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderRadius: 12,
    marginBottom: SCREEN_HEIGHT * 0.015,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  methodButtonText: {
    fontSize: SCREEN_HEIGHT * 0.02,
    color: '#1E3A8A',
    fontWeight: '600',
    marginLeft: SCREEN_WIDTH * 0.03,
    flex: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.02,
  },
  radioCircle: {
    height: SCREEN_HEIGHT * 0.025,
    width: SCREEN_HEIGHT * 0.025,
    borderRadius: SCREEN_HEIGHT * 0.0125,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#1E3A8A',
  },
  radioInner: {
    height: SCREEN_HEIGHT * 0.013,
    width: SCREEN_HEIGHT * 0.013,
    borderRadius: SCREEN_HEIGHT * 0.0065,
    backgroundColor: '#1E3A8A',
  },
  radioText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#000',
  },
});
