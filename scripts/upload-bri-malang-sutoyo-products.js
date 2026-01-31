// Script untuk upload data produk PT. BRI CABANG MALANG SUTOYO - KUR 2015 ke Firestore
// Jalankan dengan: node scripts/upload-bri-malang-sutoyo-products.js

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

// Data produk untuk PT. BRI CABANG MALANG SUTOYO - Kredit Usaha Rakyat 2015
const briMalangSutoyoProducts = [
  {
    nomorKontrak: "42901000606157",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 21341035,
    angsuran: 8400000,
    sisaHakSubrogasi: 12941035
  },
  {
    nomorKontrak: "42901000677158",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 61985443,
    angsuran: 287794,
    sisaHakSubrogasi: 61697649
  },
  {
    nomorKontrak: "42901000716156",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 107527147,
    angsuran: 21305241,
    sisaHakSubrogasi: 86221906
  },
  {
    nomorKontrak: "42901000769159",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 73383611,
    angsuran: 34698511,
    sisaHakSubrogasi: 38685100
  },
  {
    nomorKontrak: "42901001245158",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 27338009,
    angsuran: 340232,
    sisaHakSubrogasi: 26997777
  },
  {
    nomorKontrak: "42901001282150",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 36120472,
    angsuran: 1400000,
    sisaHakSubrogasi: 34720472
  },
  {
    nomorKontrak: "42901001473159",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 157226347,
    angsuran: 0,
    sisaHakSubrogasi: 157226347
  },
  {
    nomorKontrak: "42901001861108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 19199055,
    angsuran: 14058205,
    sisaHakSubrogasi: 5140850
  },
  {
    nomorKontrak: "42901002052100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 32376091,
    angsuran: 335300,
    sisaHakSubrogasi: 32040791
  },
  {
    nomorKontrak: "42901002064107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 64032351,
    angsuran: 20703803,
    sisaHakSubrogasi: 43328548
  },
  {
    nomorKontrak: "42901002472106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 56678636,
    angsuran: 6451607,
    sisaHakSubrogasi: 50227029
  },
  {
    nomorKontrak: "42901002557100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 49955665,
    angsuran: 33634365,
    sisaHakSubrogasi: 16321300
  },
  {
    nomorKontrak: "42901002584107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 83714033,
    angsuran: 3973302,
    sisaHakSubrogasi: 79740732
  },
  {
    nomorKontrak: "42901002684101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 99765742,
    angsuran: 0,
    sisaHakSubrogasi: 99765742
  },
  {
    nomorKontrak: "42901002741107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 162514002,
    angsuran: 3326237,
    sisaHakSubrogasi: 159187765
  },
  {
    nomorKontrak: "42901002765101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 186519924,
    angsuran: 2080812,
    sisaHakSubrogasi: 184439112
  },
  {
    nomorKontrak: "42901002820105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 41989269,
    angsuran: 0,
    sisaHakSubrogasi: 41989269
  },
  {
    nomorKontrak: "42901002840105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 109061596,
    angsuran: 0,
    sisaHakSubrogasi: 109061596
  },
  {
    nomorKontrak: "42901002861101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 62272766,
    angsuran: 0,
    sisaHakSubrogasi: 62272766
  },
  {
    nomorKontrak: "42901002926105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 160395153,
    angsuran: 0,
    sisaHakSubrogasi: 160395153
  },
  {
    nomorKontrak: "42901002932106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 91150006,
    angsuran: 0,
    sisaHakSubrogasi: 91150006
  },
  {
    nomorKontrak: "42901002950104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 171803223,
    angsuran: 25410053,
    sisaHakSubrogasi: 146393171
  },
  {
    nomorKontrak: "42901002963107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 136133993,
    angsuran: 754,
    sisaHakSubrogasi: 136133239
  },
  {
    nomorKontrak: "42901003023104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 131114576,
    angsuran: 3850000,
    sisaHakSubrogasi: 127264576
  },
  {
    nomorKontrak: "42901003063104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 7163959,
    angsuran: 350000,
    sisaHakSubrogasi: 6813959
  },
  {
    nomorKontrak: "42901003096107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 186556828,
    angsuran: 2687339,
    sisaHakSubrogasi: 183869490
  },
  {
    nomorKontrak: "42901003170105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 61947856,
    angsuran: 7040250,
    sisaHakSubrogasi: 54907606
  },
  {
    nomorKontrak: "42901003172107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 97933698,
    angsuran: 24543073,
    sisaHakSubrogasi: 73390625
  },
  {
    nomorKontrak: "42901003227106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 173043664,
    angsuran: 1420920,
    sisaHakSubrogasi: 171622745
  },
  {
    nomorKontrak: "42901003525106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 74889693,
    angsuran: 14893550,
    sisaHakSubrogasi: 59996143
  },
  {
    nomorKontrak: "42901003541102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 102061792,
    angsuran: 38180780,
    sisaHakSubrogasi: 63881012
  },
  {
    nomorKontrak: "42901003758107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 31761773,
    angsuran: 3342675,
    sisaHakSubrogasi: 28419098
  },
  {
    nomorKontrak: "42901003862100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 80924161,
    angsuran: 770,
    sisaHakSubrogasi: 80923391
  },
  {
    nomorKontrak: "42901004076100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 58178540,
    angsuran: 0,
    sisaHakSubrogasi: 58178540
  },
  {
    nomorKontrak: "42901004156104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 121606074,
    angsuran: 0,
    sisaHakSubrogasi: 121606074
  },
  {
    nomorKontrak: "42901004315106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 148729690,
    angsuran: 146725,
    sisaHakSubrogasi: 148582965
  },
  {
    nomorKontrak: "42901004324105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 77000000,
    angsuran: 35000000,
    sisaHakSubrogasi: 42000000
  }
];

async function uploadBriMalangSutoyoProducts() {
  try {
    console.log('Uploading PT. BRI CABANG MALANG SUTOYO - KUR 2015 products to Firestore...\n');

    const companyName = "PT. BRI CABANG MALANG SUTOYO";

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
    console.log(`   Total produk: ${briMalangSutoyoProducts.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < briMalangSutoyoProducts.length; i++) {
      const product = briMalangSutoyoProducts[i];

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

    const totalPiutang = briMalangSutoyoProducts.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = briMalangSutoyoProducts.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = briMalangSutoyoProducts.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

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

uploadBriMalangSutoyoProducts();
