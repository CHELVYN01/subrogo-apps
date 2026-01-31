// Script untuk upload data nasabah PT. BRI CABANG MALANG KAWI ke Firestore
// Data ini akan ditambahkan sebagai sub-collection "customers" dari company
// Jalankan dengan: node scripts/upload-bri-kawi-customers.js

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

// Data nasabah PT. BRI CABANG MALANG KAWI - Kredit Usaha Rakyat 2015
const briKawiCustomers = [
  { nama: "WASITAH", nomorRekening: "510105119104", piutang: 175262839, angsuran: 265530, sisaHakSubrogasi: 174997309 },
  { nama: "SUSILO", nomorRekening: "510105146101", piutang: 103769878, angsuran: 13949160, sisaHakSubrogasi: 89801718 },
  { nama: "RANI JULIYATI", nomorRekening: "510105125108", piutang: 253199407, angsuran: 3399717, sisaHakSubrogasi: 249799690 },
  { nama: "HERWIN ROIS", nomorRekening: "510105565101", piutang: 264095819, angsuran: 0, sisaHakSubrogasi: 264059819 },
  { nama: "MUHAMMAD ARIDIAN PERDANA", nomorRekening: "510105389103", piutang: 102926209, angsuran: 47627306, sisaHakSubrogasi: 55298903 },
  { nama: "TUTUT NINGTYAS", nomorRekening: "510105649105", piutang: 93274973, angsuran: 37807893, sisaHakSubrogasi: 55464081 },
  { nama: "AGUS SUCIPTO", nomorRekening: "510105419103", piutang: 112396432, angsuran: 1328025, sisaHakSubrogasi: 110978429 },
  { nama: "SURYA ABADI INDONESIA", nomorRekening: "510105452103", piutang: 139072489, angsuran: 131457119, sisaHakSubrogasi: 7615370 },
  { nama: "SURYANTO", nomorRekening: "510105475101", piutang: 37925959, angsuran: 11077089, sisaHakSubrogasi: 26175870 },
  { nama: "DUDI SETIAWAN", nomorRekening: "510105483104", piutang: 310922630, angsuran: 0, sisaHakSubrogasi: 310922630 },
  { nama: "RETNO CANDRA ANDREA", nomorRekening: "510105685101", piutang: 76108762, angsuran: 2080159, sisaHakSubrogasi: 74028604 },
  { nama: "ELLY IDRIS", nomorRekening: "510105805106", piutang: 180379212, angsuran: 8015015, sisaHakSubrogasi: 172364197 },
  { nama: "AHMAD LUTOMO", nomorRekening: "510105825103", piutang: 170869344, angsuran: 2717773, sisaHakSubrogasi: 168151571 },
  { nama: "MUHAMAD TAMRIS", nomorRekening: "510105437109", piutang: 144545396, angsuran: 7402599, sisaHakSubrogasi: 137142797 },
  { nama: "M. ABDUL MUNTAHA", nomorRekening: "510105887102", piutang: 157537072, angsuran: 40488956, sisaHakSubrogasi: 157048117 },
  { nama: "ALI MUHSEIN BAAGIL", nomorRekening: "510105901610", piutang: 159990432, angsuran: 2809720, sisaHakSubrogasi: 157180712 },
  { nama: "URIAWATI", nomorRekening: "510105901810", piutang: 213658422, angsuran: 641259, sisaHakSubrogasi: 212997163 },
  { nama: "SUSWATI", nomorRekening: "510105914010", piutang: 25946937, angsuran: 6573875, sisaHakSubrogasi: 19373062 },
  { nama: "MUHAMAD RAMADHIAN HIDAYAT", nomorRekening: "510105938710", piutang: 24857844, angsuran: 700, sisaHakSubrogasi: 24857144 },
  { nama: "RHEZA VARIANTO YUDHISTIRA", nomorRekening: "510106012710", piutang: 211332907, angsuran: 0, sisaHakSubrogasi: 211332907 },
  { nama: "MUNIR", nomorRekening: "510106017810", piutang: 60380434, angsuran: 7620900, sisaHakSubrogasi: 52688045 },
  { nama: "RULI KUSWANTO", nomorRekening: "510106038310", piutang: 62734619, angsuran: 9548350, sisaHakSubrogasi: 53186269 },
  { nama: "SUTARJI TRI WAHYONO", nomorRekening: "510106103810", piutang: 172643601, angsuran: 107966600, sisaHakSubrogasi: 64677001 },
  { nama: "ERNI ELVIA", nomorRekening: "510106119510", piutang: 102648274, angsuran: 0, sisaHakSubrogasi: 102648274 },
  { nama: "SUHARIYONO HUSODO", nomorRekening: "510106157410", piutang: 67779351, angsuran: 0, sisaHakSubrogasi: 67779351 },
  { nama: "MUHAMMAD SYAFI'I", nomorRekening: "510106187410", piutang: 57702950, angsuran: 1705375, sisaHakSubrogasi: 55997575 },
  { nama: "SUMANTO", nomorRekening: "510106322010", piutang: 241490946, angsuran: 12401321, sisaHakSubrogasi: 229089625 },
  { nama: "HAKIMATUS MARDIYAH", nomorRekening: "510106570110", piutang: 116525395, angsuran: 195780, sisaHakSubrogasi: 116329616 },
  { nama: "ATIEK TRIWAHJUNI", nomorRekening: "510105770108", piutang: 108164832, angsuran: 58870000, sisaHakSubrogasi: 49294832 },
  { nama: "SURUR SANTOSO", nomorRekening: "510106581610", piutang: 66525188, angsuran: 0, sisaHakSubrogasi: 66525188 },
  { nama: "SRI MULYOWATI", nomorRekening: "510106624110", piutang: 185378296, angsuran: 34965000, sisaHakSubrogasi: 150413296 },
  { nama: "BAYU HANIFAH", nomorRekening: "510106625210", piutang: 42801096, angsuran: 21000000, sisaHakSubrogasi: 21801096 },
  { nama: "SUTRISNO", nomorRekening: "510106633110", piutang: 102377100, angsuran: 0, sisaHakSubrogasi: 102377100 },
  { nama: "BAMBANG SUBANDI", nomorRekening: "510106650010", piutang: 228065933, angsuran: 0, sisaHakSubrogasi: 228065933 },
  { nama: "SUGIANTORO", nomorRekening: "510106694010", piutang: 220381198, angsuran: 2100000, sisaHakSubrogasi: 218281198 },
  { nama: "M. ARISTA", nomorRekening: "510106640610", piutang: 248912878, angsuran: 26250689, sisaHakSubrogasi: 222662069 },
  { nama: "DEVI TRIEKA WATI", nomorRekening: "510106640610", piutang: 96199522, angsuran: 518701, sisaHakSubrogasi: 95681221 },
  { nama: "MUHAMAD FERDIYANTO", nomorRekening: "510106647310", piutang: 162015585, angsuran: 0, sisaHakSubrogasi: 162015585 },
  { nama: "MEI FITRI SUSANTI", nomorRekening: "510106604410", piutang: 104538917, angsuran: 383450, sisaHakSubrogasi: 104155468 },
  { nama: "SITI ROBIYANTORO", nomorRekening: "510106678107", piutang: 102368551, angsuran: 2618700, sisaHakSubrogasi: 99917851 },
  { nama: "HENDRI", nomorRekening: "510106713010", piutang: 288144511, angsuran: 4746288, sisaHakSubrogasi: 283398223 },
  { nama: "YULIARTI ADI WARSITO", nomorRekening: "510106715010", piutang: 133637634, angsuran: 0, sisaHakSubrogasi: 133637634 },
  { nama: "RIZKY ANGGARA", nomorRekening: "510106726010", piutang: 158998689, angsuran: 9834117, sisaHakSubrogasi: 149164572 },
  { nama: "AHMAD KUZAENI", nomorRekening: "510106724110", piutang: 326727868, angsuran: 4024999, sisaHakSubrogasi: 322702869 },
  { nama: "ANITA DIAN SUSANTI", nomorRekening: "510106734310", piutang: 47599696, angsuran: 0, sisaHakSubrogasi: 47599696 },
  { nama: "ARDY YULIA SYALINDHA", nomorRekening: "510106747210", piutang: 309425811, angsuran: 10118578, sisaHakSubrogasi: 299307235 },
  { nama: "ABDULLOH UMAR", nomorRekening: "510106747610", piutang: 55552285, angsuran: 0, sisaHakSubrogasi: 55552285 },
  { nama: "WILDA SETIAWAN", nomorRekening: "510106789610", piutang: 295725279, angsuran: 0, sisaHakSubrogasi: 295725279 },
  { nama: "LIK ANA", nomorRekening: "510106791310", piutang: 194805437, angsuran: 0, sisaHakSubrogasi: 194805437 },
  { nama: "PUJI IRAWAN", nomorRekening: "510106803310", piutang: 196017201, angsuran: 0, sisaHakSubrogasi: 196017201 },
  { nama: "WAHYU RESIANA", nomorRekening: "510106810010", piutang: 108442055, angsuran: 29955100, sisaHakSubrogasi: 78486955 },
  { nama: "TITIK PATIMAH", nomorRekening: "510106580010", piutang: 101073068, angsuran: 0, sisaHakSubrogasi: 101073068 },
  { nama: "SUTOTO DWI BASKORO", nomorRekening: "510105546105", piutang: 175530460, angsuran: 0, sisaHakSubrogasi: 175530460 },
  { nama: "EVI ENDANG TRISNOWATI", nomorRekening: "510106975310", piutang: 129516016, angsuran: 0, sisaHakSubrogasi: 129516016 },
  { nama: "MUHAMAD SYAHRI SANTOSO", nomorRekening: "510107038810", piutang: 113833231, angsuran: 0, sisaHakSubrogasi: 113833231 },
  { nama: "NABILA JULIANA PUTRI", nomorRekening: "510107097710", piutang: 227550436, angsuran: 0, sisaHakSubrogasi: 227550436 },
  { nama: "NISA TIARA", nomorRekening: "510107145010", piutang: 260268489, angsuran: 0, sisaHakSubrogasi: 260268489 },
  { nama: "ABDUL MAJID", nomorRekening: "510150243015", piutang: 280501924, angsuran: 167668654, sisaHakSubrogasi: 112833270 },
  { nama: "SAPARDI", nomorRekening: "510150280515", piutang: 61829712, angsuran: 46448, sisaHakSubrogasi: 61783264 },
  { nama: "YOGITRISNA SUHADA, SE", nomorRekening: "510150301815", piutang: 201662929, angsuran: 7420581, sisaHakSubrogasi: 194242348 },
  { nama: "MASUD", nomorRekening: "510150347715", piutang: 177653334, angsuran: 94838957, sisaHakSubrogasi: 82785017 },
  { nama: "AGUSTINA NURMARIFATI", nomorRekening: "510150355515", piutang: 2334882, angsuran: 0, sisaHakSubrogasi: 2334882 },
  { nama: "SUJIMAN", nomorRekening: "510150365615", piutang: 70244746, angsuran: 10449950, sisaHakSubrogasi: 59784796 },
  { nama: "SUNARJO", nomorRekening: "510150360615", piutang: 350000000, angsuran: 216965000, sisaHakSubrogasi: 133035000 },
  { nama: "MUHAMMAD BADRI", nomorRekening: "510150368315", piutang: 64265170, angsuran: 7113750, sisaHakSubrogasi: 57151420 },
  { nama: "AHMAD SYAIFUDIN", nomorRekening: "510150369015", piutang: 149115285, angsuran: 70000000, sisaHakSubrogasi: 79115285 },
  { nama: "AHMAD GHOZALI", nomorRekening: "510150369615", piutang: 145880000, angsuran: 0, sisaHakSubrogasi: 145880000 },
  { nama: "DINDA ANJELICA", nomorRekening: "510150438315", piutang: 105000000, angsuran: 0, sisaHakSubrogasi: 105000000 }
];

async function uploadBriKawiCustomers() {
  try {
    console.log('Uploading PT. BRI CABANG MALANG KAWI customer data to Firestore...\n');

    const companyName = "PT. BRI CABANG MALANG KAWI";

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

    console.log(`📦 Mengupload data nasabah untuk: ${companyName}`);
    console.log(`   Type: ${companyData.type || 'N/A'}`);
    console.log(`   Total nasabah: ${briKawiCustomers.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < briKawiCustomers.length; i++) {
      const customer = briKawiCustomers[i];

      const customerRef = doc(db, 'companies', companyId, 'customers', `customer_${i + 1}`);
      await setDoc(customerRef, {
        ...customer,
        jenisProduct: "Kredit Usaha Rakyat 2015",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`  ✓ Customer ${i + 1}: ${customer.nama} - Rek: ${customer.nomorRekening} - Sisa: Rp ${customer.sisaHakSubrogasi.toLocaleString('id-ID')}`);
      uploadedCount++;
    }

    console.log('\n\n✅ Semua data nasabah berhasil diupload!');
    console.log(`Total nasabah: ${uploadedCount}`);

    const totalPiutang = briKawiCustomers.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = briKawiCustomers.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = briKawiCustomers.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

    console.log('\n📊 Summary:');
    console.log(`   Total Piutang: Rp ${totalPiutang.toLocaleString('id-ID')}`);
    console.log(`   Total Angsuran: Rp ${totalAngsuran.toLocaleString('id-ID')}`);
    console.log(`   Total Sisa Hak Subrogasi: Rp ${totalSisa.toLocaleString('id-ID')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading customer data:', error);
    process.exit(1);
  }
}

uploadBriKawiCustomers();
