// Script untuk menghapus SEMUA customers dari SEMUA companies di Firestore
// HATI-HATI: Script ini akan menghapus SEMUA data customers!
// Jalankan dengan: node scripts/delete-all-customers.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc } = require('firebase/firestore');

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

async function deleteAllCustomers() {
  try {
    console.log('\n⚠️  WARNING: Script ini akan menghapus SEMUA customers dari SEMUA companies!');
    console.log('⏳ Tunggu 3 detik sebelum mulai...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 Mengambil daftar companies...');
    const companiesSnapshot = await getDocs(collection(db, 'companies'));
    console.log(`✅ Ditemukan ${companiesSnapshot.size} companies\n`);

    let totalDeleted = 0;
    let companiesProcessed = 0;

    for (const companyDoc of companiesSnapshot.docs) {
      const companyData = companyDoc.data();
      const companyId = companyDoc.id;

      console.log(`\n🏢 Processing: ${companyData.nama}`);
      console.log(`   Company ID: ${companyId}`);

      // Get all customers
      const customersRef = collection(db, 'companies', companyId, 'customers');
      const customersSnapshot = await getDocs(customersRef);

      console.log(`   📊 Found ${customersSnapshot.size} customers`);

      if (customersSnapshot.size === 0) {
        console.log(`   ⏭️  No customers to delete, skipping...`);
        continue;
      }

      // Delete all customers
      let deletedCount = 0;
      for (const customerDoc of customersSnapshot.docs) {
        const customerData = customerDoc.data();

        try {
          await deleteDoc(doc(db, 'companies', companyId, 'customers', customerDoc.id));
          console.log(`      ✓ Deleted: ${customerData.nama || customerDoc.id}`);
          deletedCount++;
          totalDeleted++;
        } catch (error) {
          console.error(`      ❌ Error deleting ${customerData.nama}:`, error.message);
        }
      }

      console.log(`   ✅ Deleted ${deletedCount}/${customersSnapshot.size} customers from ${companyData.nama}`);
      companiesProcessed++;
    }

    console.log('\n\n✅ Selesai menghapus customers!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Total companies processed: ${companiesProcessed}`);
    console.log(`📊 Total customers deleted: ${totalDeleted}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

deleteAllCustomers();
