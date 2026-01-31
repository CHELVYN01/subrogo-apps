// Script untuk upload data dari file Excel ke Firestore - SEMUA BANK SEKALIGUS
// Script ini akan otomatis detect semua bank di Excel dan upload ke masing-masing company
// Jalankan dengan: node scripts/upload-all-banks-from-excel.js <path-to-excel-file>
// Contoh: node scripts/upload-all-banks-from-excel.js data-nasabah.xlsx

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
  // Jika sudah number, return langsung
  if (typeof value === 'number') {
    return value;
  }

  // Jika undefined, null, atau empty string
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  // Konversi ke string dulu
  const strValue = String(value).trim();

  // Jika kosong setelah trim
  if (strValue === '') {
    return 0;
  }

  // Hapus semua karakter kecuali angka, titik, dan koma
  const cleanValue = strValue.replace(/[^\d.,]/g, '');

  // Jika kosong setelah cleaning
  if (cleanValue === '') {
    return 0;
  }

  // Konversi ke number (hapus koma sebagai thousand separator)
  const number = parseFloat(cleanValue.replace(/,/g, ''));

  return isNaN(number) ? 0 : number;
}

// Fungsi untuk mendapatkan semua companies dari Firestore
async function getAllCompanies() {
  const companiesSnapshot = await getDocs(collection(db, 'companies'));
  const companies = {};

  companiesSnapshot.forEach(doc => {
    const data = doc.data();
    companies[data.nama] = {
      id: doc.id,
      ...data
    };
  });

  return companies;
}

async function uploadAllBanksFromExcel() {
  try {
    // Ambil arguments dari command line
    const args = process.argv.slice(2);

    if (args.length < 1) {
      console.log('\n❌ Usage: node scripts/upload-all-banks-from-excel.js <excel-file-path>');
      console.log('\n📝 Contoh:');
      console.log('   node scripts/upload-all-banks-from-excel.js data-nasabah.xlsx');
      console.log('   node scripts/upload-all-banks-from-excel.js ~/Downloads/data-semua-bank.xlsx');
      process.exit(1);
    }

    const excelFilePath = args[0];

    console.log('\n📂 Membaca file Excel:', excelFilePath);
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

    // Ambil sheet kedua (index 1)
    if (workbook.SheetNames.length < 2) {
      console.error('❌ File Excel hanya punya 1 sheet, tapi script ini butuh sheet kedua!');
      console.log('\n💡 Available sheets:');
      workbook.SheetNames.forEach((name, index) => {
        console.log(`   ${index + 1}. ${name}`);
      });
      process.exit(1);
    }

    const sheetName = workbook.SheetNames[1]; // Index 1 = sheet kedua
    console.log('📄 Menggunakan sheet kedua:', sheetName);
    console.log('   (Available sheets:', workbook.SheetNames.join(', ') + ')');

    // Konversi sheet ke JSON
    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      console.log('❌ File Excel kosong atau tidak ada data');
      process.exit(1);
    }

    console.log('📊 Total baris data:', rawData.length);
    console.log('\n📋 Preview kolom yang tersedia:');
    console.log(Object.keys(rawData[0]));
    console.log('\n🔍 Sample data baris pertama (FULL):');
    console.log(JSON.stringify(rawData[0], null, 2));

    // Group data by bank
    console.log('\n🏦 Mengelompokkan data berdasarkan bank...');
    const dataByBank = {};

    rawData.forEach((row, index) => {
      const bankName = row['NAMA BANK'] || row['nama_bank'] || row['namaBank'] || row['bank'];

      if (!bankName) {
        console.log(`  ⚠️  Baris ${index + 1}: Nama bank kosong, dilewati`);
        return;
      }

      if (!dataByBank[bankName]) {
        dataByBank[bankName] = [];
      }

      // Debug: tampilkan baris pertama SEBELUM parsing
      if (index === 0) {
        console.log('\n🔍 DEBUG - Sample row pertama (RAW):');
        console.log('Raw row:', JSON.stringify(row, null, 2));
        console.log('\n📊 Nilai kolom individual:');
        console.log('  PIUTANG:', row['PIUTANG'], typeof row['PIUTANG']);
        console.log('  ANGSURAN:', row['ANGSURAN'], typeof row['ANGSURAN']);
        console.log('  SISA HAK SUBROGA:', row['SISA HAK SUBROGA'], typeof row['SISA HAK SUBROGA']);
      }

      // Map kolom Excel ke format Firestore
      // NOTE: Excel column names may have leading/trailing spaces!
      const customerData = {
        nama: row['NAMA'] || row['nama'] || '',
        nomorRekening: row['no_rekening'] || row['nomor_rekening'] || row['nomorRekening'] || '',
        piutang: parseNumber(
          row['PIUTANG'] || row['piutang'] || row[' PIUTANG  '] || row[' PIUTANG ']
        ),
        angsuran: parseNumber(
          row['ANGSURAN'] || row['angsuran'] || row[' ANGSURAN '] || row[' ANGSURAN  ']
        ),
        sisaHakSubrogasi: parseNumber(
          row['SISA HAK SUBROGA'] || row['SISA HAK SUBROGASI'] ||
          row[' SISA HAK SUBROGASI '] || row[' SISA HAK SUBROGA '] ||
          row['sisaHakSubrogasi']
        ),
        jenisProduct: row['PRODUK'] || row['produk'] || row['jenisProduct'] || '',
      };

      // Debug: tampilkan hasil parsing
      if (index === 0) {
        console.log('\n✅ Parsed result:');
        console.log('  Piutang:', customerData.piutang);
        console.log('  Angsuran:', customerData.angsuran);
        console.log('  Sisa Hak Subrogasi:', customerData.sisaHakSubrogasi);
      }

      // Skip jika nama kosong
      if (customerData.nama) {
        dataByBank[bankName].push(customerData);
      }
    });

    // Tampilkan summary grouping
    console.log('\n📊 Summary data per bank:');
    Object.keys(dataByBank).forEach(bankName => {
      console.log(`   - ${bankName}: ${dataByBank[bankName].length} customers`);
    });

    // Load all companies from Firestore
    console.log('\n🔍 Mengambil daftar companies dari Firestore...');
    const allCompanies = await getAllCompanies();
    console.log(`✅ Ditemukan ${Object.keys(allCompanies).length} companies di Firestore`);

    // Upload data untuk setiap bank
    console.log('\n📤 Mulai upload data ke Firestore...\n');

    let totalUploaded = 0;
    let bankProcessed = 0;
    let bankNotFound = [];

    for (const [bankName, customers] of Object.entries(dataByBank)) {
      console.log(`\n🏦 Processing: ${bankName}`);
      console.log(`   Total customers: ${customers.length}`);

      // Cari company di Firestore (exact match)
      let companyId = null;
      let matchedName = null;

      if (allCompanies[bankName]) {
        companyId = allCompanies[bankName].id;
        matchedName = bankName;
      } else {
        // Coba fuzzy matching (case insensitive, trim spaces)
        const normalizedBankName = bankName.trim().toLowerCase();
        for (const [compName, compData] of Object.entries(allCompanies)) {
          if (compName.trim().toLowerCase() === normalizedBankName) {
            companyId = compData.id;
            matchedName = compName;
            console.log(`   🔍 Fuzzy match found: "${bankName}" → "${compName}"`);
            break;
          }
        }
      }

      if (!companyId) {
        console.log(`   ⚠️  Company "${bankName}" tidak ditemukan di Firestore - DILEWATI`);
        console.log(`   💡 Coba cek nama bank di Firestore, mungkin ada perbedaan penulisan`);
        bankNotFound.push(bankName);
        continue;
      }

      console.log(`   ✅ Company ID: ${companyId}`);

      // Upload customers
      let uploadedCount = 0;
      for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];

        try {
          const customerId = `customer_${Date.now()}_${i}`;
          const customerRef = doc(db, 'companies', companyId, 'customers', customerId);

          const dataToUpload = {
            ...customer,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          console.log(`      📝 Uploading: ${customer.nama}...`);
          await setDoc(customerRef, dataToUpload);
          console.log(`      ✅ SUCCESS - Uploaded to Firestore with ID: ${customerId}`);
          console.log(`         ${i + 1}. ${customer.nama} - Rek: ${customer.nomorRekening} - Sisa: Rp ${customer.sisaHakSubrogasi.toLocaleString('id-ID')}`);

          uploadedCount++;
          totalUploaded++;

        } catch (error) {
          console.error(`      ❌ FAILED - Error upload ${customer.nama}:`);
          console.error(`         Error: ${error.message}`);
          console.error(`         Full error:`, error);
        }
      }

      // Verify upload ke Firestore
      console.log(`\n   🔍 Verifying upload to Firestore...`);
      try {
        const verifyRef = collection(db, 'companies', companyId, 'customers');
        const verifySnapshot = await getDocs(verifyRef);
        console.log(`   ✅ Total customers in Firestore for ${bankName}: ${verifySnapshot.size}`);
      } catch (error) {
        console.error(`   ❌ Error verifying upload:`, error.message);
      }

      console.log(`   📊 Uploaded: ${uploadedCount}/${customers.length} customers`);
      bankProcessed++;
    }

    // Final Summary
    console.log('\n\n✅ Upload selesai!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Total bank diproses: ${bankProcessed}`);
    console.log(`📊 Total customers berhasil diupload: ${totalUploaded}`);

    if (bankNotFound.length > 0) {
      console.log('\n⚠️  Bank yang tidak ditemukan di Firestore:');
      bankNotFound.forEach(bank => {
        console.log(`   - ${bank}`);
      });
      console.log('\n💡 Silakan tambahkan company ini ke Firestore terlebih dahulu');
    }

    // Tampilkan daftar companies yang tersedia
    console.log('\n📝 Companies yang tersedia di Firestore:');
    Object.keys(allCompanies).forEach(name => {
      const company = allCompanies[name];
      console.log(`   - ${name} (Type: ${company.type || 'N/A'})`);
    });

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

uploadAllBanksFromExcel();
