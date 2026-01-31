// Script untuk upload data produk BPD JATIM CABANG BATU - KUR 2015 ke Firestore
// Jalankan dengan: node scripts/upload-bpd-jatim-batu-products.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, setDoc } = require('firebase/firestore');

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

// Data produk untuk BPD JATIM CABANG BATU - Kredit Usaha Rakyat 2015
const bpdJatimBatuProducts = [
  {
    nomorKontrak: "0E689645",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 60588427,
    angsuran: 0,
    sisaHakSubrogasi: 60588427
  },
  {
    nomorKontrak: "9ECA18A4",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 40431234,
    angsuran: 0,
    sisaHakSubrogasi: 40431234
  },
  {
    nomorKontrak: "82623F66",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 38450104,
    angsuran: 0,
    sisaHakSubrogasi: 38450104
  },
  {
    nomorKontrak: "8B91BA9B",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 288060823,
    angsuran: 0,
    sisaHakSubrogasi: 288060823
  }
];

async function uploadBpdJatimBatuProducts() {
  try {
    console.log('Uploading BPD JATIM CABANG BATU - KUR 2015 products to Firestore...\n');

    const companyName = "BPD JATIM CABANG BATU";

    const q = query(
      collection(db, 'companies'),
      where('nama', '==', companyName)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`⚠️  Perusahaan "${companyName}" tidak ditemukan di Firestore`);
      console.log('💡 Pastikan Anda sudah mengupload data perusahaan terlebih dahulu');
      process.exit(1);
    }

    const companyDoc = querySnapshot.docs[0];
    const companyId = companyDoc.id;
    const companyData = companyDoc.data();

    console.log(`📦 Mengupload produk untuk: ${companyName}`);
    console.log(`   Type: ${companyData.type || 'N/A'}`);
    console.log(`   Total produk: ${bpdJatimBatuProducts.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < bpdJatimBatuProducts.length; i++) {
      const product = bpdJatimBatuProducts[i];

      const productRef = doc(db, 'companies', companyId, 'products', `product_${i + 1}`);
      await setDoc(productRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`  ✓ Product ${i + 1}: ${product.nomorKontrak} - Sisa: Rp ${product.sisaHakSubrogasi.toLocaleString('id-ID')}`);
      uploadedCount++;
    }

    console.log('\n\n✅ Semua produk berhasil diupload!');
    console.log(`Total produk: ${uploadedCount}`);

    const totalPiutang = bpdJatimBatuProducts.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = bpdJatimBatuProducts.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = bpdJatimBatuProducts.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

    console.log('\n📊 Summary:');
    console.log(`   Total Piutang: Rp ${totalPiutang.toLocaleString('id-ID')}`);
    console.log(`   Total Angsuran: Rp ${totalAngsuran.toLocaleString('id-ID')}`);
    console.log(`   Total Sisa Hak Subrogasi: Rp ${totalSisa.toLocaleString('id-ID')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading products:', error);
    process.exit(1);
  }
}

uploadBpdJatimBatuProducts();
