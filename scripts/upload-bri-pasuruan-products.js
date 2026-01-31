// Script untuk upload data produk PT. BRI CABANG PASURUAN - KUR 2015 ke Firestore
// Jalankan dengan: node scripts/upload-bri-pasuruan-products.js

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

// Data produk untuk PT. BRI CABANG PASURUAN - Kredit Usaha Rakyat 2015
const briPasuruanProducts = [
  {
    nomorKontrak: "6501038300101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 75240319,
    angsuran: 72709099,
    sisaHakSubrogasi: 2531220
  },
  {
    nomorKontrak: "6501038414104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 50826604,
    angsuran: 45813259,
    sisaHakSubrogasi: 5013345
  },
  {
    nomorKontrak: "6501040514102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 56832925,
    angsuran: 8910047,
    sisaHakSubrogasi: 47522878
  },
  {
    nomorKontrak: "6501040623105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 63711379,
    angsuran: 0,
    sisaHakSubrogasi: 63711379
  },
  {
    nomorKontrak: "6501042601109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 44627484,
    angsuran: 2969400,
    sisaHakSubrogasi: 41658084
  },
  {
    nomorKontrak: "6501042785107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 79369670,
    angsuran: 2800000,
    sisaHakSubrogasi: 76569670
  },
  {
    nomorKontrak: "6501042795102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 42270528,
    angsuran: 1464551,
    sisaHakSubrogasi: 40805977
  },
  {
    nomorKontrak: "6501042889105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 85955151,
    angsuran: 8623775,
    sisaHakSubrogasi: 77331376
  },
  {
    nomorKontrak: "6501046800103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 158019721,
    angsuran: 0,
    sisaHakSubrogasi: 158019721
  },
  {
    nomorKontrak: "6501046860103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 162536724,
    angsuran: 11917659,
    sisaHakSubrogasi: 150619065
  },
  {
    nomorKontrak: "6501047122100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 106597194,
    angsuran: 0,
    sisaHakSubrogasi: 106597194
  },
  {
    nomorKontrak: "6501047453103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 224150962,
    angsuran: 15691200,
    sisaHakSubrogasi: 208459762
  },
  {
    nomorKontrak: "6501048099106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 57330819,
    angsuran: 0,
    sisaHakSubrogasi: 57330819
  },
  {
    nomorKontrak: "6501048436104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 330923809,
    angsuran: 0,
    sisaHakSubrogasi: 330923809
  },
  {
    nomorKontrak: "6501048448101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 58387305,
    angsuran: 2065000,
    sisaHakSubrogasi: 56322305
  },
  {
    nomorKontrak: "6501048465103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 92171069,
    angsuran: 10480750,
    sisaHakSubrogasi: 81690319
  },
  {
    nomorKontrak: "6501048472100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 143563766,
    angsuran: 65764,
    sisaHakSubrogasi: 143498002
  },
  {
    nomorKontrak: "6501048482105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 166865420,
    angsuran: 2082850,
    sisaHakSubrogasi: 164782570
  },
  {
    nomorKontrak: "6501048511108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 162390034,
    angsuran: 0,
    sisaHakSubrogasi: 162390034
  },
  {
    nomorKontrak: "6501048522109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 38641099,
    angsuran: 0,
    sisaHakSubrogasi: 38641099
  },
  {
    nomorKontrak: "6501048523105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 61757111,
    angsuran: 0,
    sisaHakSubrogasi: 61757111
  },
  {
    nomorKontrak: "6501048534106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 222427244,
    angsuran: 11730250,
    sisaHakSubrogasi: 210696994
  },
  {
    nomorKontrak: "6501048756106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 110550810,
    angsuran: 16756950,
    sisaHakSubrogasi: 93793860
  },
  {
    nomorKontrak: "6501048861105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 24593587,
    angsuran: 2781625,
    sisaHakSubrogasi: 21811962
  },
  {
    nomorKontrak: "6501048875104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 324722504,
    angsuran: 2975000,
    sisaHakSubrogasi: 321747504
  },
  {
    nomorKontrak: "6501048886105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 65016519,
    angsuran: 0,
    sisaHakSubrogasi: 65016519
  },
  {
    nomorKontrak: "6501049011101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 58465856,
    angsuran: 0,
    sisaHakSubrogasi: 58465856
  },
  {
    nomorKontrak: "6501049013103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 153781207,
    angsuran: 0,
    sisaHakSubrogasi: 153781207
  },
  {
    nomorKontrak: "6501049074109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 121924637,
    angsuran: 0,
    sisaHakSubrogasi: 121924637
  },
  {
    nomorKontrak: "6501049326108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 150946282,
    angsuran: 39835250,
    sisaHakSubrogasi: 111111032
  },
  {
    nomorKontrak: "6501049342104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 284114754,
    angsuran: 0,
    sisaHakSubrogasi: 284114754
  },
  {
    nomorKontrak: "6501049367104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 105922257,
    angsuran: 78503207,
    sisaHakSubrogasi: 27419050
  },
  {
    nomorKontrak: "6501049386108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 72816266,
    angsuran: 0,
    sisaHakSubrogasi: 72816266
  },
  {
    nomorKontrak: "6501049393105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 158533824,
    angsuran: 0,
    sisaHakSubrogasi: 158533824
  },
  {
    nomorKontrak: "6501049433109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 176580516,
    angsuran: 0,
    sisaHakSubrogasi: 176580516
  },
  {
    nomorKontrak: "6501049472103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 218611134,
    angsuran: 10719100,
    sisaHakSubrogasi: 207892034
  },
  {
    nomorKontrak: "6501049656105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 202989187,
    angsuran: 0,
    sisaHakSubrogasi: 202989187
  },
  {
    nomorKontrak: "6501049677101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 97405491,
    angsuran: 2764498,
    sisaHakSubrogasi: 94640993
  },
  {
    nomorKontrak: "6501049678107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 141577544,
    angsuran: 0,
    sisaHakSubrogasi: 141577544
  },
  {
    nomorKontrak: "6501049680104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 100143890,
    angsuran: 0,
    sisaHakSubrogasi: 100143890
  },
  {
    nomorKontrak: "6501049787100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 80035799,
    angsuran: 0,
    sisaHakSubrogasi: 80035799
  },
  {
    nomorKontrak: "6501050434106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 182617799,
    angsuran: 0,
    sisaHakSubrogasi: 182617799
  },
  {
    nomorKontrak: "6501050447109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 62247600,
    angsuran: 840000,
    sisaHakSubrogasi: 61407600
  },
  {
    nomorKontrak: "6501050689109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 44637424,
    angsuran: 1666374,
    sisaHakSubrogasi: 42971050
  },
  {
    nomorKontrak: "6501050749103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 149957313,
    angsuran: 0,
    sisaHakSubrogasi: 149957313
  },
  {
    nomorKontrak: "6501050752106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 93575129,
    angsuran: 0,
    sisaHakSubrogasi: 93575129
  },
  {
    nomorKontrak: "6501051156109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 291908295,
    angsuran: 0,
    sisaHakSubrogasi: 291908295
  },
  {
    nomorKontrak: "6501051897103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 307911105,
    angsuran: 0,
    sisaHakSubrogasi: 307911105
  },
  {
    nomorKontrak: "6501501635158",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 159202182,
    angsuran: 3778521,
    sisaHakSubrogasi: 155423661
  },
  {
    nomorKontrak: "6501501641159",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 144383952,
    angsuran: 3500000,
    sisaHakSubrogasi: 140883952
  },
  {
    nomorKontrak: "6501501713150",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 19486795,
    angsuran: 0,
    sisaHakSubrogasi: 19486795
  },
  {
    nomorKontrak: "6501502637153",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 210000000,
    angsuran: 33530000,
    sisaHakSubrogasi: 176470000
  },
  {
    nomorKontrak: "6501502761156",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 172584659,
    angsuran: 0,
    sisaHakSubrogasi: 172584659
  },
  {
    nomorKontrak: "6501502771151",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 47833126,
    angsuran: 15678600,
    sisaHakSubrogasi: 32154526
  },
  {
    nomorKontrak: "6501502774159",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 140000000,
    angsuran: 1596000,
    sisaHakSubrogasi: 138404000
  }
];

async function uploadBriPasuruanProducts() {
  try {
    console.log('Uploading PT. BRI CABANG PASURUAN - KUR 2015 products to Firestore...\n');

    // Cari perusahaan PT. BRI CABANG PASURUAN
    const companyName = "PT. BRI CABANG PASURUAN";

    // Query untuk mencari perusahaan
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
    console.log(`   Total produk: ${briPasuruanProducts.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < briPasuruanProducts.length; i++) {
      const product = briPasuruanProducts[i];

      // Create product document in subcollection
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

    // Hitung total
    const totalPiutang = briPasuruanProducts.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = briPasuruanProducts.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = briPasuruanProducts.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

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

uploadBriPasuruanProducts();
