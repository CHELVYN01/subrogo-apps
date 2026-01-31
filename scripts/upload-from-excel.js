// Script untuk upload data dari file Excel ke Firestore
// Jalankan dengan: node scripts/upload-from-excel.js <path-to-excel-file> <company-name>
// Contoh: node scripts/upload-from-excel.js data.xlsx "PT. BRI CABANG MALANG KAWI"

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, setDoc } = require('firebase/firestore');
const XLSX = require('xlsx');

const firebaseConfig = {
  apiKey: "AIzaSyBSPdJEIH7XxweWTmx5FHIRtP8NjUWJF9w",
  authDomain: "subrogo-4d52f.firebaseapp.com",
  projectId: "subrogo-4d52f",
  storageBucket: "subrogo-4d52f.firebasestorage.app",
  messagingSenderId: "604604107001",
  appId: "1:604604107001:web:b113c5f066d1df1f3a3a28",
  measurementId: "G-EQRJCTGP7V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi untuk membersihkan dan mengkonversi nilai angka
function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  // Hapus semua karakter kecuali angka dan titik/koma
  const cleanValue = String(value).replace(/[^\d.,]/g, '');

  // Konversi ke number
  const number = parseFloat(cleanValue.replace(/,/g, ''));

  return isNaN(number) ? 0 : number;
}

async function uploadFromExcel() {
  try {
    // Ambil arguments dari command line
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.log('\n❌ Usage: node scripts/upload-from-excel.js <excel-file-path> <company-name>');
      console.log('\n📝 Contoh:');
      console.log('   node scripts/upload-from-excel.js data.xlsx "PT. BRI CABANG MALANG KAWI"');
      console.log('   node scripts/upload-from-excel.js ~/Downloads/data.xlsx "BNI KC UNIBRAW MALANG"');
      process.exit(1);
    }

    const excelFilePath = args[0];
    const companyName = args[1];

    console.log('\n📂 Membaca file Excel:', excelFilePath);
    console.log('🏢 Company:', companyName);
    console.log('');

    // Baca file Excel
    let workbook;
    try {
      workbook = XLSX.readFile(excelFilePath);
    } catch (error) {
      console.error('❌ Error membaca file Excel:', error.message);
      console.log('\n💡 Pastikan:');
      console.log('   1. Path file sudah benar');
      console.log('   2. File Excel tidak sedang dibuka');
      console.log('   3. Anda sudah install xlsx: npm install xlsx');
      process.exit(1);
    }

    // Ambil sheet pertama
    const sheetName = workbook.SheetNames[0];
    console.log('📄 Sheet:', sheetName);

    // Konversi sheet ke JSON
    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      console.log('❌ File Excel kosong atau tidak ada data');
      process.exit(1);
    }

    console.log('📊 Total baris data:', rawData.length);
    console.log('\n📋 Preview kolom yang tersedia:');
    console.log(Object.keys(rawData[0]));

    // Cari company di Firestore
    console.log('\n🔍 Mencari company di Firestore...');
    const q = query(
      collection(db, 'companies'),
      where('nama', '==', companyName)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`\n⚠️  Perusahaan "${companyName}" tidak ditemukan di Firestore`);
      console.log('💡 Pastikan Anda sudah mengupload data perusahaan terlebih dahulu');

      // Tampilkan companies yang tersedia
      console.log('\n📝 Companies yang tersedia:');
      const allCompanies = await getDocs(collection(db, 'companies'));
      allCompanies.forEach(doc => {
        console.log(`   - ${doc.data().nama}`);
      });

      process.exit(1);
    }

    const companyDoc = querySnapshot.docs[0];
    const companyId = companyDoc.id;
    const companyData = companyDoc.data();

    console.log(`✅ Company ditemukan!`);
    console.log(`   ID: ${companyId}`);
    console.log(`   Type: ${companyData.type || 'N/A'}`);

    // Proses dan upload data
    console.log('\n📤 Mulai upload data ke Firestore...\n');

    let uploadedCount = 0;
    let errors = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];

      try {
        // Map kolom Excel ke format Firestore
        // Sesuaikan dengan nama kolom di Excel Anda
        const customerData = {
          nama: row['NAMA'] || row['nama'] || '',
          nomorRekening: row['no_rekening'] || row['nomor_rekening'] || row['nomorRekening'] || '',
          piutang: parseNumber(row['PIUTANG'] || row['piutang'] || 0),
          angsuran: parseNumber(row['ANGSURAN'] || row['angsuran'] || 0),
          sisaHakSubrogasi: parseNumber(row['SISA HAK SUBROGA'] || row['sisaHakSubrogasi'] || 0),
          jenisProduct: row['PRODUK'] || row['produk'] || row['jenisProduct'] || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Skip jika nama kosong
        if (!customerData.nama) {
          console.log(`  ⚠️  Baris ${i + 1}: Nama kosong, dilewati`);
          continue;
        }

        // Upload ke Firestore
        const customerRef = doc(db, 'companies', companyId, 'customers', `customer_${i + 1}`);
        await setDoc(customerRef, customerData);

        console.log(`  ✓ ${i + 1}. ${customerData.nama} - Rek: ${customerData.nomorRekening} - Sisa: Rp ${customerData.sisaHakSubrogasi.toLocaleString('id-ID')}`);
        uploadedCount++;

      } catch (error) {
        console.error(`  ❌ Error pada baris ${i + 1}:`, error.message);
        errors.push({ row: i + 1, error: error.message });
      }
    }

    // Summary
    console.log('\n\n✅ Upload selesai!');
    console.log(`📊 Total berhasil diupload: ${uploadedCount} dari ${rawData.length}`);

    if (errors.length > 0) {
      console.log(`\n⚠️  ${errors.length} baris gagal diupload:`);
      errors.forEach(err => {
        console.log(`   - Baris ${err.row}: ${err.error}`);
      });
    }

    // Hitung total
    const allCustomers = await getDocs(collection(db, 'companies', companyId, 'customers'));
    let totalPiutang = 0;
    let totalAngsuran = 0;
    let totalSisa = 0;

    allCustomers.forEach(doc => {
      const data = doc.data();
      totalPiutang += data.piutang || 0;
      totalAngsuran += data.angsuran || 0;
      totalSisa += data.sisaHakSubrogasi || 0;
    });

    console.log('\n💰 Summary Total di Firestore:');
    console.log(`   Total Customers: ${allCustomers.size}`);
    console.log(`   Total Piutang: Rp ${totalPiutang.toLocaleString('id-ID')}`);
    console.log(`   Total Angsuran: Rp ${totalAngsuran.toLocaleString('id-ID')}`);
    console.log(`   Total Sisa Hak Subrogasi: Rp ${totalSisa.toLocaleString('id-ID')}`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

uploadFromExcel();
