// Script untuk upload data produk CBC ke Firestore
// Jalankan dengan: node scripts/upload-cbc-products.js

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

// Data produk untuk setiap perusahaan CBC
// Format: { namaPerusahaan: [array of products] }
const companyProducts = {
  "UD. DINAR OLYMPUS DYNAMIS": [
    {
      nomorKontrak: "KBG 2018 01.01 1 00029290",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 495000000,
      angsuran: 86539058,
      sisaHakSubrogasi: 408460942
    }
  ],
  "PT. SURYA ANUGERAH ABADI ENAMBELAS": [
    {
      nomorKontrak: "KBG 2018 01.01 1 00039207",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 3700000000,
      angsuran: 0,
      sisaHakSubrogasi: 3700000000
    }
  ],
  "CV. BUMI PUSTAKA EMAS": [
    {
      nomorKontrak: "KBG 2022 01.01 1 00023885",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 60512200,
      angsuran: 0,
      sisaHakSubrogasi: 60512200
    }
  ],
  "CV. JAM KARYA": [
    {
      nomorKontrak: "KBG 2022 01.01 1 00025275",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 437404364,
      angsuran: 190715986,
      sisaHakSubrogasi: 246688378
    }
  ],
  "CV. ARKAN JAYA": [
    {
      nomorKontrak: "KBG 2023 01.01 1 00002392",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 186210772,
      angsuran: 100000000,
      sisaHakSubrogasi: 86210772
    }
  ],
  "CV. REJASA TEKNIK": [
    {
      nomorKontrak: "KBG 2023 01.01 1 00015043",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 314258750,
      angsuran: 0,
      sisaHakSubrogasi: 314258750
    }
  ],
  "PT. SIRARA AGUNG JAYA": [
    {
      nomorKontrak: "KBG 2022 01.01 1 00031234",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 304635600,
      angsuran: 30463560,
      sisaHakSubrogasi: 274172040
    }
  ],
  "CV. HEREND": [
    {
      nomorKontrak: "KBG 2022 01.01 1 00046988",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 459564928,
      angsuran: 45956493,
      sisaHakSubrogasi: 413608435
    }
  ],
  "CV. REYHAN CONSTRUCTION": [
    {
      nomorKontrak: "KBG 2022 01.01 1 00038601",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 57931600,
      angsuran: 5793100,
      sisaHakSubrogasi: 52138500
    }
  ],
  "UD. PANCA ARNYS": [
    {
      nomorKontrak: "PBD 2018 01.01 02 1 000002",
      jenisProduct: "Payment Bond",
      piutang: 923119576,
      angsuran: 0,
      sisaHakSubrogasi: 923119576
    }
  ],
  "PT. SURYA ANUGERAH ABADI ENAM BELAS": [
    {
      nomorKontrak: "PBD 2018 01.01 02 1 000004",
      jenisProduct: "Payment Bond",
      piutang: 568747450,
      angsuran: 0,
      sisaHakSubrogasi: 568747450
    }
  ],
  "UD. SUMBER LESTARI JAYA": [
    {
      nomorKontrak: "PBD 2018 01.01 02 1 000006",
      jenisProduct: "Payment Bond",
      piutang: 800000000,
      angsuran: 0,
      sisaHakSubrogasi: 800000000
    }
  ],
  "PT. WAHYU PRATAMA SEJATI": [
    {
      nomorKontrak: "SBD 2017 01.01 1 00117851",
      jenisProduct: "Surety Bond",
      piutang: 139256900,
      angsuran: 0,
      sisaHakSubrogasi: 139256900
    }
  ],
  "UD. Alhamdulillah Cq Liami": [
    {
      nomorKontrak: "UMI 2014 01.01 1 00861",
      jenisProduct: "Kredit Umum",
      piutang: 840000000,
      angsuran: 49140000,
      sisaHakSubrogasi: 790860000
    }
  ],
  "CV. SARI BUMI": [
    {
      nomorKontrak: "KBG 2020 01.01 1 00026421",
      jenisProduct: "Kredit Kontra Bank Garansi",
      piutang: 33257951,
      angsuran: 0,
      sisaHakSubrogasi: 33257951
    }
  ]
};

async function uploadProducts() {
  try {
    console.log('Uploading CBC products to Firestore...\n');

    // Get all CBC companies from Firestore
    const q = query(collection(db, 'companies'), where('type', '==', 'cbc'));
    const querySnapshot = await getDocs(q);

    let uploadedCount = 0;

    for (const docSnap of querySnapshot.docs) {
      const companyData = docSnap.data();
      const companyName = companyData.nama;
      const companyId = docSnap.id;

      // Check if this company has products to upload
      if (companyProducts[companyName]) {
        const products = companyProducts[companyName];

        console.log(`\n📦 ${companyName}:`);

        for (let i = 0; i < products.length; i++) {
          const product = products[i];

          // Create product document in subcollection
          const productRef = doc(db, 'companies', companyId, 'products', `product_${i + 1}`);
          await setDoc(productRef, {
            ...product,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          console.log(`  ✓ Product ${i + 1}: ${product.nomorKontrak}`);
          uploadedCount++;
        }
      } else {
        console.log(`\n⚠️  ${companyName}: No products data found`);
      }
    }

    console.log('\n\n✅ All products uploaded successfully!');
    console.log(`Total companies processed: ${querySnapshot.size}`);
    console.log(`Total products uploaded: ${uploadedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading products:', error);
    process.exit(1);
  }
}

uploadProducts();
