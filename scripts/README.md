# Scripts untuk Upload Data ke Firestore

## Prerequisites

Pastikan Anda sudah menginstall dependencies yang diperlukan:

```bash
npm install firebase xlsx
```

## 1. Upload Data Companies CBC

Script ini akan upload data perusahaan CBC (18 perusahaan) ke collection `companies` di Firestore.

```bash
node scripts/upload-cbc-data.js
```

**Output yang diharapkan:**
```
Uploading CBC data to Firestore...
✓ Uploaded: UD. DINAR OLYMPUS DYNAMIS (ID: xxxxx)
✓ Uploaded: PT. SURYA ANUGERAH ABADI ENAMBELAS (ID: xxxxx)
...
✅ All data uploaded successfully!
Total: 18 companies
```

## 2. Upload Data Products CBC

Script ini akan upload data produk untuk setiap perusahaan CBC ke subcollection `products` di Firestore.

**PENTING:** Jalankan script ini SETELAH upload-cbc-data.js selesai!

```bash
node scripts/upload-cbc-products.js
```

**Output yang diharapkan:**
```
Uploading CBC products to Firestore...

📦 UD. DINAR OLYMPUS DYNAMIS:
  ✓ Product 1: KBG 2018 01.01 1 00029290

📦 PT. SURYA ANUGERAH ABADI ENAMBELAS:
  ✓ Product 1: KBG 2018 01.01 1 00039207

...

✅ All products uploaded successfully!
Total companies processed: 18
Total products uploaded: 18
```

## Struktur Data di Firestore

### Collection: `companies`
```
companies/
  ├── {companyId}/
  │   ├── nama: "UD. DINAR OLYMPUS DYNAMIS"
  │   ├── produk: "Kredit Kontra Bank Garans"
  │   ├── piutang: 495000000
  │   ├── angsuran: 86539058
  │   ├── sisaHakSubrogasi: 408460942
  │   ├── type: "cbc"
  │   ├── createdAt: Timestamp
  │   ├── updatedAt: Timestamp
  │   └── products/ (subcollection)
  │       └── product_1/
  │           ├── nomorKontrak: "KBG 2018 01.01 1 00029290"
  │           ├── jenisProduct: "Kredit Kontra Bank Garansi"
  │           ├── piutang: 495000000
  │           ├── angsuran: 86539058
  │           ├── sisaHakSubrogasi: 408460942
  │           ├── createdAt: Timestamp
  │           └── updatedAt: Timestamp
```

## Cara Menggunakan di Aplikasi

1. **List CBC Companies**:
   - Buka halaman CBC dari home screen
   - Akan menampilkan daftar 18 perusahaan CBC

2. **Detail Produk**:
   - Klik salah satu perusahaan (misal: UD. DINAR OLYMPUS DYNAMIS)
   - Akan menampilkan detail produk dengan nomor kontrak
   - Menampilkan Piutang, Angsuran, dan Sisa Hak Subrogasi

## 3. Upload Data CAC (Customers) dari File Excel (RECOMMENDED!)

Script ini memudahkan Anda untuk upload data **customers/nasabah CAC** dalam jumlah banyak dari file Excel ke Firestore.

**Format Excel yang didukung:**
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

**Kolom yang harus ada di Excel:**
- `NAMA` atau `nama` - Nama customer
- `no_rekening` / `nomor_rekening` / `nomorRekening` - Nomor rekening
- `PIUTANG` atau `piutang` - Jumlah piutang
- `ANGSURAN` atau `angsuran` - Jumlah angsuran
- `SISA HAK SUBROGA` / `sisaHakSubrogasi` - Sisa hak subrogasi
- `PRODUK` / `produk` / `jenisProduct` - Jenis produk (opsional)

**Cara Menggunakan:**

```bash
node scripts/upload-from-excel.js <path-ke-file-excel> "<nama-company>"
```

**Contoh:**

```bash
# Upload data dari file di folder yang sama
node scripts/upload-from-excel.js data-nasabah.xlsx "PT. BRI CABANG MALANG KAWI"

# Upload data dari Downloads
node scripts/upload-from-excel.js ~/Downloads/data-bni.xlsx "BNI KC UNIBRAW MALANG"

# Upload data dengan path Windows
node scripts/upload-from-excel.js "C:\Users\nama\Documents\data.xlsx" "BPD JATIM BATU"
```

**Output yang diharapkan:**

```
📂 Membaca file Excel: data-nasabah.xlsx
🏢 Company: PT. BRI CABANG MALANG KAWI

📄 Sheet: Sheet1
📊 Total baris data: 150

🔍 Mencari company di Firestore...
✅ Company ditemukan!
   ID: xyz123
   Type: cac

📤 Mulai upload data ke Firestore...

  ✓ 1. WASITAH - Rek: 510105119104 - Sisa: Rp 174.997.309
  ✓ 2. SUSILO - Rek: 510105146101 - Sisa: Rp 89.801.718
  ✓ 3. RANI JULIYATI - Rek: 510105125108 - Sisa: Rp 249.799.690
  ...

✅ Upload selesai!
📊 Total berhasil diupload: 150 dari 150

💰 Summary Total di Firestore:
   Total Customers: 150
   Total Piutang: Rp 15.234.567.890
   Total Angsuran: Rp 2.345.678.901
   Total Sisa Hak Subrogasi: Rp 12.888.888.989
```

**Tips:**
1. Pastikan nama company di command line SAMA PERSIS dengan nama di Firestore
2. File Excel tidak boleh sedang dibuka saat upload
3. Script akan otomatis skip baris yang nama customer-nya kosong
4. Script support berbagai variasi nama kolom (huruf besar/kecil)

## Troubleshooting

### Error: "Missing or insufficient permissions"
Pastikan Firestore Rules sudah diset dengan benar:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId} {
      allow read: if true;
      allow write: if request.auth != null;

      match /products/{productId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

### Error: "Company not found"
Pastikan Anda sudah menjalankan `upload-cbc-data.js` terlebih dahulu sebelum menjalankan `upload-cbc-products.js`.

### Data tidak muncul di aplikasi
1. Cek apakah data sudah ter-upload di Firestore Console
2. Refresh aplikasi dengan pull-to-refresh
3. Cek console log untuk error messages
