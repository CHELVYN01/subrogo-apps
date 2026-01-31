// Script untuk upload data produk PT. BRI CABANG MALANG KAWI - KUR 2015 ke Firestore
// Jalankan dengan: node scripts/upload-bri-kur-products.js

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

// Data produk untuk PT. BRI CABANG MALANG KAWI - Kredit Usaha Rakyat 2015
const briKurProducts = [
  {
    nomorKontrak: "5101051519104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 175262839,
    angsuran: 265530,
    sisaHakSubrogasi: 174997309
  },
  {
    nomorKontrak: "5101051546101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 103750878,
    angsuran: 13949160,
    sisaHakSubrogasi: 89801718
  },
  {
    nomorKontrak: "5101054125108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 253199407,
    angsuran: 3398717,
    sisaHakSubrogasi: 249799690
  },
  {
    nomorKontrak: "5101055165101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 264059819,
    angsuran: 0,
    sisaHakSubrogasi: 264059819
  },
  {
    nomorKontrak: "5101055389103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 102926209,
    angsuran: 47627306,
    sisaHakSubrogasi: 55298903
  },
  {
    nomorKontrak: "5101055649105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 93271973,
    angsuran: 37807893,
    sisaHakSubrogasi: 55464081
  },
  {
    nomorKontrak: "5101056114103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 112306512,
    angsuran: 1328025,
    sisaHakSubrogasi: 110978487
  },
  {
    nomorKontrak: "5101056432103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 139072489,
    angsuran: 131457119,
    sisaHakSubrogasi: 7615370
  },
  {
    nomorKontrak: "5101056475101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 37252959,
    angsuran: 11077089,
    sisaHakSubrogasi: 26175870
  },
  {
    nomorKontrak: "5101056483104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 310922630,
    angsuran: 0,
    sisaHakSubrogasi: 310922630
  },
  {
    nomorKontrak: "5101056854101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 76108762,
    angsuran: 2080159,
    sisaHakSubrogasi: 74028604
  },
  {
    nomorKontrak: "5101056869106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 180379212,
    angsuran: 8015015,
    sisaHakSubrogasi: 172364197
  },
  {
    nomorKontrak: "5101058254103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 170869344,
    angsuran: 2717773,
    sisaHakSubrogasi: 168151571
  },
  {
    nomorKontrak: "5101058437109",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 144545396,
    angsuran: 7402599,
    sisaHakSubrogasi: 137142797
  },
  {
    nomorKontrak: "5101058687102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 197537072,
    angsuran: 40488956,
    sisaHakSubrogasi: 157048117
  },
  {
    nomorKontrak: "5101059016100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 159990432,
    angsuran: 2809720,
    sisaHakSubrogasi: 157180712
  },
  {
    nomorKontrak: "5101059018102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 213638422,
    angsuran: 641259,
    sisaHakSubrogasi: 212997163
  },
  {
    nomorKontrak: "5101059140103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 25946937,
    angsuran: 6573875,
    sisaHakSubrogasi: 19373062
  },
  {
    nomorKontrak: "5101059387103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 24857844,
    angsuran: 700,
    sisaHakSubrogasi: 24857144
  },
  {
    nomorKontrak: "5101060127106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 211332907,
    angsuran: 0,
    sisaHakSubrogasi: 211332907
  },
  {
    nomorKontrak: "5101060178107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 60308945,
    angsuran: 7620900,
    sisaHakSubrogasi: 52688045
  },
  {
    nomorKontrak: "5101060383100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 62734619,
    angsuran: 9548350,
    sisaHakSubrogasi: 53186269
  },
  {
    nomorKontrak: "5101061018106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 172643601,
    angsuran: 107966600,
    sisaHakSubrogasi: 64677001
  },
  {
    nomorKontrak: "5101061195102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 102648274,
    angsuran: 0,
    sisaHakSubrogasi: 102648274
  },
  {
    nomorKontrak: "5101061574102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 67779351,
    angsuran: 0,
    sisaHakSubrogasi: 67779351
  },
  {
    nomorKontrak: "5101061674106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 57702950,
    angsuran: 1705375,
    sisaHakSubrogasi: 55997575
  },
  {
    nomorKontrak: "5101063220107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 241490946,
    angsuran: 12401321,
    sisaHakSubrogasi: 229089625
  },
  {
    nomorKontrak: "5101065730108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 116525395,
    angsuran: 195780,
    sisaHakSubrogasi: 116329616
  },
  {
    nomorKontrak: "5101065770108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 108164832,
    angsuran: 58870000,
    sisaHakSubrogasi: 49294832
  },
  {
    nomorKontrak: "5101065816108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 66525188,
    angsuran: 0,
    sisaHakSubrogasi: 66525188
  },
  {
    nomorKontrak: "5101066241102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 185378296,
    angsuran: 34965000,
    sisaHakSubrogasi: 150413296
  },
  {
    nomorKontrak: "5101066326106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 42801696,
    angsuran: 21000000,
    sisaHakSubrogasi: 21801696
  },
  {
    nomorKontrak: "5101066331101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 102377100,
    angsuran: 0,
    sisaHakSubrogasi: 102377100
  },
  {
    nomorKontrak: "5101066350105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 228065933,
    angsuran: 0,
    sisaHakSubrogasi: 228065933
  },
  {
    nomorKontrak: "5101066390105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 220381198,
    angsuran: 2100000,
    sisaHakSubrogasi: 218281198
  },
  {
    nomorKontrak: "5101066406100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 248912878,
    angsuran: 26250669,
    sisaHakSubrogasi: 222662009
  },
  {
    nomorKontrak: "5101066460104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 96199922,
    angsuran: 518701,
    sisaHakSubrogasi: 95681221
  },
  {
    nomorKontrak: "5101066473107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 162015585,
    angsuran: 0,
    sisaHakSubrogasi: 162015585
  },
  {
    nomorKontrak: "5101066604106",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 104538917,
    angsuran: 383450,
    sisaHakSubrogasi: 104155468
  },
  {
    nomorKontrak: "5101066978107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 102536551,
    angsuran: 2618700,
    sisaHakSubrogasi: 99917851
  },
  {
    nomorKontrak: "5101067130100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 288144511,
    angsuran: 4746288,
    sisaHakSubrogasi: 283398223
  },
  {
    nomorKontrak: "5101067150100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 133637634,
    angsuran: 0,
    sisaHakSubrogasi: 133637634
  },
  {
    nomorKontrak: "5101067226105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 158998689,
    angsuran: 9834117,
    sisaHakSubrogasi: 149164572
  },
  {
    nomorKontrak: "5101067241105",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 326727868,
    angsuran: 4024999,
    sisaHakSubrogasi: 322702869
  },
  {
    nomorKontrak: "5101067343101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 47599696,
    angsuran: 0,
    sisaHakSubrogasi: 47599696
  },
  {
    nomorKontrak: "5101067472104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 309425813,
    angsuran: 10118578,
    sisaHakSubrogasi: 299307235
  },
  {
    nomorKontrak: "5101067476108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 55552285,
    angsuran: 0,
    sisaHakSubrogasi: 55552285
  },
  {
    nomorKontrak: "5101067896104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 295725749,
    angsuran: 0,
    sisaHakSubrogasi: 295725749
  },
  {
    nomorKontrak: "5101067913100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 194805437,
    angsuran: 0,
    sisaHakSubrogasi: 194805437
  },
  {
    nomorKontrak: "5101068033107",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 196017201,
    angsuran: 0,
    sisaHakSubrogasi: 196017201
  },
  {
    nomorKontrak: "5101068100108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 108442055,
    angsuran: 29955100,
    sisaHakSubrogasi: 78486955
  },
  {
    nomorKontrak: "5101068580104",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 101073068,
    angsuran: 0,
    sisaHakSubrogasi: 101073068
  },
  {
    nomorKontrak: "5101069546103",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 175530460,
    angsuran: 0,
    sisaHakSubrogasi: 175530460
  },
  {
    nomorKontrak: "5101069755100",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 129516016,
    angsuran: 0,
    sisaHakSubrogasi: 129516016
  },
  {
    nomorKontrak: "5101070388108",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 113833231,
    angsuran: 0,
    sisaHakSubrogasi: 113833231
  },
  {
    nomorKontrak: "5101070937101",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 227550436,
    angsuran: 0,
    sisaHakSubrogasi: 227550436
  },
  {
    nomorKontrak: "5101071450102",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 260268489,
    angsuran: 0,
    sisaHakSubrogasi: 260268489
  },
  {
    nomorKontrak: "5101502430154",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 280501924,
    angsuran: 167668654,
    sisaHakSubrogasi: 112833270
  },
  {
    nomorKontrak: "5101502805155",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 61829712,
    angsuran: 46448,
    sisaHakSubrogasi: 61783264
  },
  {
    nomorKontrak: "5101503018159",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 201662929,
    angsuran: 7420581,
    sisaHakSubrogasi: 194242348
  },
  {
    nomorKontrak: "5101503147152",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 177623314,
    angsuran: 94838297,
    sisaHakSubrogasi: 82785017
  },
  {
    nomorKontrak: "5101503555151",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 2334882,
    angsuran: 0,
    sisaHakSubrogasi: 2334882
  },
  {
    nomorKontrak: "5101503565156",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 70234746,
    angsuran: 10449950,
    sisaHakSubrogasi: 59784796
  },
  {
    nomorKontrak: "5101503606156",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 350000000,
    angsuran: 216965000,
    sisaHakSubrogasi: 133035000
  },
  {
    nomorKontrak: "5101503683158",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 64265170,
    angsuran: 7113750,
    sisaHakSubrogasi: 57151420
  },
  {
    nomorKontrak: "5101503690155",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 149115285,
    angsuran: 70000000,
    sisaHakSubrogasi: 79115285
  },
  {
    nomorKontrak: "5101503969156",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 145880000,
    angsuran: 0,
    sisaHakSubrogasi: 145880000
  },
  {
    nomorKontrak: "5101504038152",
    jenisProduct: "Kredit Usaha Rakyat 2015",
    piutang: 105000000,
    angsuran: 0,
    sisaHakSubrogasi: 105000000
  }
];

async function uploadBriKurProducts() {
  try {
    console.log('Uploading PT. BRI CABANG MALANG KAWI - KUR 2015 products to Firestore...\n');

    // Cari perusahaan PT. BRI CABANG MALANG KAWI (type CBC atau CAC)
    // Anda perlu menentukan type-nya, defaultnya saya gunakan 'cbc'
    const companyName = "PT. BRI CABANG MALANG KAWI";

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
    console.log(`   Total produk: ${briKurProducts.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < briKurProducts.length; i++) {
      const product = briKurProducts[i];

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
    const totalPiutang = briKurProducts.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = briKurProducts.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = briKurProducts.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

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

uploadBriKurProducts();
