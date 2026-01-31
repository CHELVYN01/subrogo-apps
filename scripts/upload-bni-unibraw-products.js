// Script untuk upload data produk BNI KC UNIBRAW MALANG - KUR 2015 ke Firestore
// Jalankan dengan: node scripts/upload-bni-unibraw-products.js

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

// Data produk untuk BNI KC UNIBRAW MALANG - Kredit Usaha Rakyat 2015
const bniUnibrawProducts = [
  {
    nomorKontrak: "1238214494",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 188487399,
    angsuran: 1967534,
    sisaHakSubrogasi: 186519865
  },
  {
    nomorKontrak: "1450516252",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 10377963,
    angsuran: 105525,
    sisaHakSubrogasi: 10272438
  }
];

async function uploadBniUnibrawProducts() {
  try {
    console.log('Uploading BNI KC UNIBRAW MALANG - KUR 2015 products to Firestore...\n');

    const companyName = "BNI KC UNIBRAW MALANG";

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
    console.log(`   Total produk: ${bniUnibrawProducts.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < bniUnibrawProducts.length; i++) {
      const product = bniUnibrawProducts[i];

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

    const totalPiutang = bniUnibrawProducts.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = bniUnibrawProducts.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = bniUnibrawProducts.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

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

uploadBniUnibrawProducts();
