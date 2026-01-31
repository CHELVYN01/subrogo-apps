// Script untuk upload data CBC ke Firestore
// Jalankan dengan: node scripts/upload-cbc-data.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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

const cbcData = [
  {
    nama: "UD. DINAR OLYMPUS DYNAMIS",
    produk: "Kredit Kontra Bank Garans",
    piutang: 495000000,
    angsuran: 86539058,
    sisaHakSubrogasi: 408460942
  },
  {
    nama: "PT. SURYA ANUGERAH ABADI ENAMBELAS",
    produk: "Kredit Kontra Bank Garans",
    piutang: 3700000000,
    angsuran: 0,
    sisaHakSubrogasi: 3700000000
  },
  {
    nama: "PT. SURYA ANUGERAH ABADI ENAMBELAS",
    produk: "Kredit Kontra Bank Garans",
    piutang: 2988300000,
    angsuran: 0,
    sisaHakSubrogasi: 2988300000
  },
  {
    nama: "CV. BUMI PUSTAKA EMAS",
    produk: "Kredit Kontra Bank Garans",
    piutang: 60512200,
    angsuran: 0,
    sisaHakSubrogasi: 60512200
  },
  {
    nama: "CV. JAM KARYA",
    produk: "Kredit Kontra Bank Garans",
    piutang: 437404364,
    angsuran: 190715986,
    sisaHakSubrogasi: 246688378
  },
  {
    nama: "CV. ARKAN JAYA",
    produk: "Kredit Kontra Bank Garans",
    piutang: 186210772,
    angsuran: 100000000,
    sisaHakSubrogasi: 86210772
  },
  {
    nama: "CV. REJASA TEKNIK",
    produk: "Kredit Kontra Bank Garans",
    piutang: 314258750,
    angsuran: 0,
    sisaHakSubrogasi: 314258750
  },
  {
    nama: "CV. REJASA TEKNIK",
    produk: "Kredit Kontra Bank Garans",
    piutang: 777262879,
    angsuran: 0,
    sisaHakSubrogasi: 777262879
  },
  {
    nama: "PT. SIRARA AGUNG JAYA",
    produk: "Kredit Kontra Bank Garans",
    piutang: 304635600,
    angsuran: 30463560,
    sisaHakSubrogasi: 274172040
  },
  {
    nama: "CV. HEREND",
    produk: "Kredit Kontra Bank Garans",
    piutang: 459564928,
    angsuran: 45956493,
    sisaHakSubrogasi: 413608435
  },
  {
    nama: "CV. HEREND",
    produk: "Kredit Kontra Bank Garans",
    piutang: 2757389567,
    angsuran: 275738956,
    sisaHakSubrogasi: 2481650611
  },
  {
    nama: "CV. REYHAN CONSTRUCTION",
    produk: "Kredit Kontra Bank Garans",
    piutang: 57931600,
    angsuran: 5793100,
    sisaHakSubrogasi: 52138500
  },
  {
    nama: "UD. PANCA ARNYS",
    produk: "Payment Bond",
    piutang: 923119576,
    angsuran: 0,
    sisaHakSubrogasi: 923119576
  },
  {
    nama: "PT. SURYA ANUGERAH ABADI ENAM BELAS",
    produk: "Payment Bond",
    piutang: 568747450,
    angsuran: 0,
    sisaHakSubrogasi: 568747450
  },
  {
    nama: "UD. SUMBER LESTARI JAYA",
    produk: "Payment Bond",
    piutang: 800000000,
    angsuran: 0,
    sisaHakSubrogasi: 800000000
  },
  {
    nama: "PT. WAHYU PRATAMA SEJATI",
    produk: "Surety Bond",
    piutang: 139256900,
    angsuran: 0,
    sisaHakSubrogasi: 139256900
  },
  {
    nama: "UD. Alhamdulillah Cq Liami",
    produk: "Kredit Umum",
    piutang: 840000000,
    angsuran: 49140000,
    sisaHakSubrogasi: 790860000
  },
  {
    nama: "CV. SARI BUMI",
    produk: "Kredit Kontra Bank Garans",
    piutang: 33257951,
    angsuran: 0,
    sisaHakSubrogasi: 33257951
  }
];

async function uploadData() {
  try {
    console.log('Uploading CBC data to Firestore...');

    for (const company of cbcData) {
      const docRef = await addDoc(collection(db, 'companies'), {
        ...company,
        type: 'cbc',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✓ Uploaded: ${company.nama} (ID: ${docRef.id})`);
    }

    console.log('\n✅ All data uploaded successfully!');
    console.log(`Total: ${cbcData.length} companies`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  }
}

uploadData();
