// Script untuk upload data CAC ke Firestore
// Jalankan dengan: node scripts/upload-cac-data.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

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

// Data CAC - Bank dengan unit-unit mereka
const cacData = [
  {
    nama: "BANK SINARMAS - KC Malang",
    totalPiutang: 941957636,
    totalAngsuran: 9508108,
    totalSisaHakSubrogasi: 932449528,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 941957636,
        angsuran: 9508108,
        sisaHakSubrogasi: 932449528
      }
    ]
  },
  {
    nama: "BNI KC UNIBRAW MALANG",
    totalPiutang: 7378168560,
    totalAngsuran: 427501344,
    totalSisaHakSubrogasi: 6950667216,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 7378168560,
        angsuran: 427501344,
        sisaHakSubrogasi: 6950667216
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG BATU",
    totalPiutang: 1422020627,
    totalAngsuran: 41965921,
    totalSisaHakSubrogasi: 1380054706,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 1422020627,
        angsuran: 41965921,
        sisaHakSubrogasi: 1380054706
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG KEPANJEN",
    totalPiutang: 874328912,
    totalAngsuran: 700000,
    totalSisaHakSubrogasi: 873628912,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 874328912,
        angsuran: 700000,
        sisaHakSubrogasi: 873628912
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG KEPANJEN KCP DONOMULYO",
    totalPiutang: 1301604595,
    totalAngsuran: 38444000,
    totalSisaHakSubrogasi: 1263160595,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 1301604595,
        angsuran: 38444000,
        sisaHakSubrogasi: 1263160595
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG KEPANJEN KCP SUMBERPUCUNG",
    totalPiutang: 161050386,
    totalAngsuran: 0,
    totalSisaHakSubrogasi: 161050386,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 161050386,
        angsuran: 0,
        sisaHakSubrogasi: 161050386
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG KRAKSAAN",
    totalPiutang: 720584073,
    totalAngsuran: 4550000,
    totalSisaHakSubrogasi: 716034073,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 720584073,
        angsuran: 4550000,
        sisaHakSubrogasi: 716034073
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG MALANG",
    totalPiutang: 260356785,
    totalAngsuran: 0,
    totalSisaHakSubrogasi: 260356785,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 260356785,
        angsuran: 0,
        sisaHakSubrogasi: 260356785
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG PASURUAN",
    totalPiutang: 1849581314,
    totalAngsuran: 32445000,
    totalSisaHakSubrogasi: 1817136314,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 1849581314,
        angsuran: 32445000,
        sisaHakSubrogasi: 1817136314
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG PASURUAN KCP BANGIL",
    totalPiutang: 834660890,
    totalAngsuran: 5409850,
    totalSisaHakSubrogasi: 829251040,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 834660890,
        angsuran: 5409850,
        sisaHakSubrogasi: 829251040
      }
    ]
  },
  {
    nama: "BPD JATIM CABANG PROBOLINGGO",
    totalPiutang: 665917100,
    totalAngsuran: 0,
    totalSisaHakSubrogasi: 665917100,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 665917100,
        angsuran: 0,
        sisaHakSubrogasi: 665917100
      }
    ]
  },
  {
    nama: "PT BNI - KC Pasuruan",
    totalPiutang: 25993549609,
    totalAngsuran: 2025324965,
    totalSisaHakSubrogasi: 23968224644,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 25993549609,
        angsuran: 2025324965,
        sisaHakSubrogasi: 23968224644
      }
    ]
  },
  {
    nama: "PT BRI CABANG PASURUAN - UNIT PRIGEN",
    totalPiutang: 268347025,
    totalAngsuran: 15434553,
    totalSisaHakSubrogasi: 252912473,
    units: [
      {
        namaUnit: "Kredit Mikro",
        piutang: 214266738,
        angsuran: 9174900,
        sisaHakSubrogasi: 205091838
      },
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 54080287,
        angsuran: 6259653,
        sisaHakSubrogasi: 47820634
      }
    ]
  },
  {
    nama: "PT BRI CABANG PROBOLINGGO - UNIT SUMBERASIH",
    totalPiutang: 38131983,
    totalAngsuran: 498750,
    totalSisaHakSubrogasi: 37633233,
    units: [
      {
        namaUnit: "Kredit Mikro",
        piutang: 38131983,
        angsuran: 498750,
        sisaHakSubrogasi: 37633233
      }
    ]
  },
  {
    nama: "PT. BANK TABUNGAN NEGARA (BTN) CABANG MALANG",
    totalPiutang: 255310076,
    totalAngsuran: 0,
    totalSisaHakSubrogasi: 255310076,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 255310076,
        angsuran: 0,
        sisaHakSubrogasi: 255310076
      }
    ]
  },
  {
    nama: "PT. BNI (Persero) KC Malang",
    totalPiutang: 20481969107,
    totalAngsuran: 615754330,
    totalSisaHakSubrogasi: 19866214777,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 20481969107,
        angsuran: 615754330,
        sisaHakSubrogasi: 19866214777
      }
    ]
  },
  {
    nama: "PT. BRI CABANG KEPANJEN",
    totalPiutang: 9454035056,
    totalAngsuran: 198312473,
    totalSisaHakSubrogasi: 9255722583,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 9454035056,
        angsuran: 198312473,
        sisaHakSubrogasi: 9255722583
      }
    ]
  },
  {
    nama: "PT. BRI CABANG MALANG SUTOYO",
    totalPiutang: 4089053428,
    totalAngsuran: 319045146,
    totalSisaHakSubrogasi: 3770008282,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 4089053428,
        angsuran: 319045146,
        sisaHakSubrogasi: 3770008282
      }
    ]
  },
  {
    nama: "PT. BRI CABANG MALANG KAWI",
    totalPiutang: 10625969975,
    totalAngsuran: 1236968700,
    totalSisaHakSubrogasi: 9389001275,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 10625969975,
        angsuran: 1236968700,
        sisaHakSubrogasi: 9389001275
      }
    ]
  },
  {
    nama: "PT. BRI CABANG PASURUAN",
    totalPiutang: 7891525115,
    totalAngsuran: 426741398,
    totalSisaHakSubrogasi: 7464783717,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 7891525115,
        angsuran: 426741398,
        sisaHakSubrogasi: 7464783717
      }
    ]
  },
  {
    nama: "PT. BRI CABANG PROBOLINGGO",
    totalPiutang: 8645373960,
    totalAngsuran: 671071398,
    totalSisaHakSubrogasi: 7974302563,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 8645373960,
        angsuran: 671071398,
        sisaHakSubrogasi: 7974302563
      }
    ]
  },
  {
    nama: "PT. BRI KC Soekarno Hatta",
    totalPiutang: 7539321614,
    totalAngsuran: 386781276,
    totalSisaHakSubrogasi: 7152540338,
    units: [
      {
        namaUnit: "Kredit Usaha Rakyat 2015",
        piutang: 7539321614,
        angsuran: 386781276,
        sisaHakSubrogasi: 7152540338
      }
    ]
  }
];

async function uploadData() {
  try {
    console.log('Uploading CAC data to Firestore...\n');

    for (const bank of cacData) {
      // Upload bank data
      const bankRef = await addDoc(collection(db, 'companies'), {
        nama: bank.nama,
        produk: "Kredit Usaha Rakyat",
        piutang: bank.totalPiutang,
        angsuran: bank.totalAngsuran,
        sisaHakSubrogasi: bank.totalSisaHakSubrogasi,
        type: 'cac',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✓ Bank: ${bank.nama} (ID: ${bankRef.id})`);

      // Upload units for this bank
      for (let i = 0; i < bank.units.length; i++) {
        const unit = bank.units[i];
        const unitRef = doc(db, 'companies', bankRef.id, 'units', `unit_${i + 1}`);
        await setDoc(unitRef, {
          ...unit,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`  └─ Unit: ${unit.namaUnit}`);
      }
    }

    console.log('\n✅ All CAC data uploaded successfully!');
    console.log(`Total banks: ${cacData.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  }
}

uploadData();
