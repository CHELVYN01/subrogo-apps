// Script untuk upload data produk PT. BRI CABANG PROBOLINGGO - KUR 2015 ke Firestore
// Jalankan dengan: node scripts/upload-bri-probolinggo-products.js

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

// Data produk untuk PT. BRI CABANG PROBOLINGGO - Kredit Usaha Rakyat 2015
const briProbolinggoProducts = [
  { nomorKontrak: "7301025369103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 45367754, angsuran: 2944996, sisaHakSubrogasi: 42422758 },
  { nomorKontrak: "7301025693104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 84265248, angsuran: 380896, sisaHakSubrogasi: 83884352 },
  { nomorKontrak: "7301025709109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 115732837, angsuran: 0, sisaHakSubrogasi: 115732837 },
  { nomorKontrak: "7301025770100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 17045885, angsuran: 2935335, sisaHakSubrogasi: 14110550 },
  { nomorKontrak: "7301025811100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 155129477, angsuran: 1030400, sisaHakSubrogasi: 154099077 },
  { nomorKontrak: "7301025830104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 101050262, angsuran: 8750000, sisaHakSubrogasi: 92300262 },
  { nomorKontrak: "7301025841105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 117536204, angsuran: 104848911, sisaHakSubrogasi: 12687293 },
  { nomorKontrak: "7301025864103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 208898273, angsuran: 1762628, sisaHakSubrogasi: 207135645 },
  { nomorKontrak: "7301025911104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 81021623, angsuran: 188784, sisaHakSubrogasi: 80832839 },
  { nomorKontrak: "7301026009104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 59500000, angsuran: 8751400, sisaHakSubrogasi: 50748600 },
  { nomorKontrak: "7301026102106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 42246297, angsuran: 826, sisaHakSubrogasi: 42245471 },
  { nomorKontrak: "7301026116105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 135451535, angsuran: 20300000, sisaHakSubrogasi: 115151535 },
  { nomorKontrak: "7301026119103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 129648615, angsuran: 0, sisaHakSubrogasi: 129648615 },
  { nomorKontrak: "7301026129108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 121764884, angsuran: 306647, sisaHakSubrogasi: 121458237 },
  { nomorKontrak: "7301026161100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 30181067, angsuran: 2268000, sisaHakSubrogasi: 27913067 },
  { nomorKontrak: "7301026189108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 101740395, angsuran: 2101400, sisaHakSubrogasi: 99638995 },
  { nomorKontrak: "7301026231109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 123093903, angsuran: 0, sisaHakSubrogasi: 123093903 },
  { nomorKontrak: "7301026257105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 208605885, angsuran: 0, sisaHakSubrogasi: 208605885 },
  { nomorKontrak: "7301026316103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 110684828, angsuran: 0, sisaHakSubrogasi: 110684828 },
  { nomorKontrak: "7301026343100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 287183979, angsuran: 237086547, sisaHakSubrogasi: 50097432 },
  { nomorKontrak: "7301026673107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 43016935, angsuran: 2762823, sisaHakSubrogasi: 40254112 },
  { nomorKontrak: "7301027408107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 48508838, angsuran: 0, sisaHakSubrogasi: 48508838 },
  { nomorKontrak: "7301027423107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 39725174, angsuran: 0, sisaHakSubrogasi: 39725174 },
  { nomorKontrak: "7301027438102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 63617115, angsuran: 0, sisaHakSubrogasi: 63617115 },
  { nomorKontrak: "7301027747103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 61496493, angsuran: 3037425, sisaHakSubrogasi: 58459068 },
  { nomorKontrak: "7301027749105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 83307560, angsuran: 20020000, sisaHakSubrogasi: 63287560 },
  { nomorKontrak: "7301027881101", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 175000000, angsuran: 0, sisaHakSubrogasi: 175000000 },
  { nomorKontrak: "7301029089103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 18116050, angsuran: 0, sisaHakSubrogasi: 18116050 },
  { nomorKontrak: "7301029194102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 43913336, angsuran: 0, sisaHakSubrogasi: 43913336 },
  { nomorKontrak: "7301029214106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 55742784, angsuran: 0, sisaHakSubrogasi: 55742784 },
  { nomorKontrak: "7301029278100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 107643103, angsuran: 0, sisaHakSubrogasi: 107643103 },
  { nomorKontrak: "7301029296108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 27843356, angsuran: 0, sisaHakSubrogasi: 27843356 },
  { nomorKontrak: "7301029349105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 79233385, angsuran: 27971626, sisaHakSubrogasi: 51261759 },
  { nomorKontrak: "7301029637100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 80559716, angsuran: 0, sisaHakSubrogasi: 80559716 },
  { nomorKontrak: "7301029658106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 132304592, angsuran: 2000260, sisaHakSubrogasi: 130304332 },
  { nomorKontrak: "7301030135109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 38199112, angsuran: 16469600, sisaHakSubrogasi: 21729512 },
  { nomorKontrak: "7301030236109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 51048899, angsuran: 9800000, sisaHakSubrogasi: 41248899 },
  { nomorKontrak: "7301030268106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 9336448, angsuran: 9031750, sisaHakSubrogasi: 304698 },
  { nomorKontrak: "7301030330107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 65792798, angsuran: 8190700, sisaHakSubrogasi: 57602098 },
  { nomorKontrak: "7301030419105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 67718991, angsuran: 9865450, sisaHakSubrogasi: 57853541 },
  { nomorKontrak: "7301030427108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 189925003, angsuran: 9193802, sisaHakSubrogasi: 180731201 },
  { nomorKontrak: "7301030441102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 49006506, angsuran: 0, sisaHakSubrogasi: 49006506 },
  { nomorKontrak: "7301030472103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 24597584, angsuran: 6672750, sisaHakSubrogasi: 17924834 },
  { nomorKontrak: "7301030629108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 13049171, angsuran: 0, sisaHakSubrogasi: 13049171 },
  { nomorKontrak: "7301030657101", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 51033483, angsuran: 24253250, sisaHakSubrogasi: 26780233 },
  { nomorKontrak: "7301030719107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 47528443, angsuran: 0, sisaHakSubrogasi: 47528443 },
  { nomorKontrak: "7301030800102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 120097289, angsuran: 0, sisaHakSubrogasi: 120097289 },
  { nomorKontrak: "7301031118100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 32188241, angsuran: 5446000, sisaHakSubrogasi: 26742241 },
  { nomorKontrak: "7301031319104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 54107640, angsuran: 1073111, sisaHakSubrogasi: 53034529 },
  { nomorKontrak: "7301031500103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 25145675, angsuran: 1811600, sisaHakSubrogasi: 23334075 },
  { nomorKontrak: "7301031510108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 79601278, angsuran: 0, sisaHakSubrogasi: 79601278 },
  { nomorKontrak: "7301031553106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 68051107, angsuran: 23660000, sisaHakSubrogasi: 44391107 },
  { nomorKontrak: "7301031554102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 30678564, angsuran: 0, sisaHakSubrogasi: 30678564 },
  { nomorKontrak: "7301031965109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 38500000, angsuran: 0, sisaHakSubrogasi: 38500000 },
  { nomorKontrak: "7301031971100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 46247964, angsuran: 0, sisaHakSubrogasi: 46247964 },
  { nomorKontrak: "7301031991100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 26575951, angsuran: 0, sisaHakSubrogasi: 26575951 },
  { nomorKontrak: "7301032103108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 42674651, angsuran: 27575100, sisaHakSubrogasi: 15099551 },
  { nomorKontrak: "7301032117107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 100702069, angsuran: 4200000, sisaHakSubrogasi: 96502069 },
  { nomorKontrak: "7301032160100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 37021643, angsuran: 0, sisaHakSubrogasi: 37021643 },
  { nomorKontrak: "7301032171101", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 39216119, angsuran: 1470350, sisaHakSubrogasi: 37745769 },
  { nomorKontrak: "7301032208102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 189726623, angsuran: 123772, sisaHakSubrogasi: 189602851 },
  { nomorKontrak: "7301032216105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 79115009, angsuran: 0, sisaHakSubrogasi: 79115009 },
  { nomorKontrak: "7301032247106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 70445136, angsuran: 2590000, sisaHakSubrogasi: 67855136 },
  { nomorKontrak: "7301032309102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 31909883, angsuran: 0, sisaHakSubrogasi: 31909883 },
  { nomorKontrak: "7301032320108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 76616961, angsuran: 0, sisaHakSubrogasi: 76616961 },
  { nomorKontrak: "7301032332105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 66148108, angsuran: 700, sisaHakSubrogasi: 66147408 },
  { nomorKontrak: "7301032484106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 54426841, angsuran: 2647225, sisaHakSubrogasi: 51779616 },
  { nomorKontrak: "7301032486108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 57012337, angsuran: 0, sisaHakSubrogasi: 57012337 },
  { nomorKontrak: "7301032498105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 113877980, angsuran: 1354500, sisaHakSubrogasi: 112523479 },
  { nomorKontrak: "7301032537103", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 91022856, angsuran: 16857400, sisaHakSubrogasi: 74165456 },
  { nomorKontrak: "7301032548104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 140520675, angsuran: 0, sisaHakSubrogasi: 140520675 },
  { nomorKontrak: "7301032611101", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 118814234, angsuran: 0, sisaHakSubrogasi: 118814234 },
  { nomorKontrak: "7301032612107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 85295856, angsuran: 17430000, sisaHakSubrogasi: 67865856 },
  { nomorKontrak: "7301032685100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 145950975, angsuran: 770000, sisaHakSubrogasi: 145180975 },
  { nomorKontrak: "7301032708102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 101202029, angsuran: 1330000, sisaHakSubrogasi: 99872029 },
  { nomorKontrak: "7301032798107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 96204755, angsuran: 2100000, sisaHakSubrogasi: 94104755 },
  { nomorKontrak: "7301032801104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 72306208, angsuran: 0, sisaHakSubrogasi: 72306208 },
  { nomorKontrak: "7301032809102", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 182927004, angsuran: 0, sisaHakSubrogasi: 182927004 },
  { nomorKontrak: "7301032827100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 93385675, angsuran: 0, sisaHakSubrogasi: 93385675 },
  { nomorKontrak: "7301032832105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 150386021, angsuran: 1217374, sisaHakSubrogasi: 149168648 },
  { nomorKontrak: "7301032836109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 132637520, angsuran: 0, sisaHakSubrogasi: 132637520 },
  { nomorKontrak: "7301032947100", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 110143211, angsuran: 9209025, sisaHakSubrogasi: 100934186 },
  { nomorKontrak: "7301032954101", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 53725030, angsuran: 3773350, sisaHakSubrogasi: 49951680 },
  { nomorKontrak: "7301033063107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 166678336, angsuran: 0, sisaHakSubrogasi: 166678336 },
  { nomorKontrak: "7301033070104", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 239492283, angsuran: 210000, sisaHakSubrogasi: 239282283 },
  { nomorKontrak: "7301033077106", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 88379599, angsuran: 0, sisaHakSubrogasi: 88379599 },
  { nomorKontrak: "7301033088107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 84122494, angsuran: 3185700, sisaHakSubrogasi: 80936794 },
  { nomorKontrak: "7301033205107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 69001133, angsuran: 0, sisaHakSubrogasi: 69001133 },
  { nomorKontrak: "7301033223105", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 168565287, angsuran: 0, sisaHakSubrogasi: 168565287 },
  { nomorKontrak: "7301033381107", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 263118830, angsuran: 0, sisaHakSubrogasi: 263118830 },
  { nomorKontrak: "7301033913108", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 111096181, angsuran: 0, sisaHakSubrogasi: 111096181 },
  { nomorKontrak: "7301034274109", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 131882134, angsuran: 0, sisaHakSubrogasi: 131882134 },
  { nomorKontrak: "7301501482152", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 23948606, angsuran: 77749, sisaHakSubrogasi: 23870857 },
  { nomorKontrak: "7301501484154", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 10818550, angsuran: 32235, sisaHakSubrogasi: 10786315 },
  { nomorKontrak: "7301502748153", jenisProduct: "Kredit Usaha Rakyat 2015", piutang: 210000000, angsuran: 0, sisaHakSubrogasi: 210000000 }
];

async function uploadBriProbolinggoProducts() {
  try {
    console.log('Uploading PT. BRI CABANG PROBOLINGGO - KUR 2015 products to Firestore...\n');

    const companyName = "PT. BRI CABANG PROBOLINGGO";

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
    console.log(`   Total produk: ${briProbolinggoProducts.length}\n`);

    let uploadedCount = 0;

    for (let i = 0; i < briProbolinggoProducts.length; i++) {
      const product = briProbolinggoProducts[i];

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

    const totalPiutang = briProbolinggoProducts.reduce((sum, p) => sum + p.piutang, 0);
    const totalAngsuran = briProbolinggoProducts.reduce((sum, p) => sum + p.angsuran, 0);
    const totalSisa = briProbolinggoProducts.reduce((sum, p) => sum + p.sisaHakSubrogasi, 0);

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

uploadBriProbolinggoProducts();