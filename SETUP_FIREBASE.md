# Setup Firebase untuk SUBRO GO

## Langkah-langkah Setup di Firebase Console

### 1. Enable Authentication (Email/Password)
1. Buka Firebase Console: https://console.firebase.google.com/project/subrogo-4d52f
2. Klik **Authentication** di sidebar kiri
3. Klik **Get Started** (jika belum diaktifkan)
4. Pilih tab **Sign-in method**
5. Klik **Email/Password**
6. Toggle **Enable** menjadi ON
7. Klik **Save**

### 2. Create Firestore Database
1. Klik **Firestore Database** di sidebar kiri
2. Klik **Create database**
3. Pilih **Start in production mode**
4. Pilih lokasi: **asia-southeast1 (Singapore)**
5. Klik **Enable**

### 3. Update Firestore Security Rules
Setelah database dibuat:
1. Klik tab **Rules**
2. Paste kode berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - read only
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Forms collection
    match /forms/{formId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;

      // Anyone authenticated can create
      allow create: if request.auth != null;

      // Only manager or form owner can update
      allow update: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager' ||
         resource.data.userId == request.auth.uid);

      // Only form owner can delete
      allow delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Klik **Publish**

### 4. Create Demo Users

#### A. Di Authentication
1. Klik **Authentication** > tab **Users**
2. Klik **Add user**

**User 1 - Staff:**
- Email: `staff@subrogo.com`
- Password: `staff123`
- Klik **Add user**
- **COPY UID yang muncul** (contoh: `abc123def456`)

**User 2 - Manager:**
- Email: `manager@subrogo.com`
- Password: `manager123`
- Klik **Add user**
- **COPY UID yang muncul** (contoh: `xyz789ghi012`)

#### B. Di Firestore Database
1. Klik **Firestore Database**
2. Klik **Start collection**
3. Collection ID: `users`
4. Klik **Next**

**Document 1 - Staff User:**
- Document ID: [Paste UID dari Staff user yang tadi di-copy]
- Fields:
  - Field: `email`, Type: string, Value: `staff@subrogo.com`
  - Field: `name`, Type: string, Value: `Staff User`
  - Field: `role`, Type: string, Value: `staff`
- Klik **Save**

**Document 2 - Manager User:**
- Klik **Add document**
- Document ID: [Paste UID dari Manager user yang tadi di-copy]
- Fields:
  - Field: `email`, Type: string, Value: `manager@subrogo.com`
  - Field: `name`, Type: string, Value: `Manager User`
  - Field: `role`, Type: string, Value: `manager`
- Klik **Save**

## Testing

### Login sebagai Staff
1. Buka aplikasi
2. Login dengan:
   - Email: `staff@subrogo.com`
   - Password: `staff123`
3. Anda akan masuk ke Home dengan 3 tombol: CAC, CBC, Simulasi Angsuran
4. Buka CAC > Pilih Bank > Klik tombol + (tambah)
5. Isi Form Kunjungan
6. Klik **Submit Form**
7. Form akan masuk ke database dengan status "pending"

### Login sebagai Manager
1. Logout dari staff
2. Login dengan:
   - Email: `manager@subrogo.com`
   - Password: `manager123`
3. Anda akan masuk ke Home dengan tombol "Manager Dashboard"
4. Klik **Manager Dashboard**
5. Anda akan melihat semua form yang statusnya "pending"
6. Klik **Approve** atau **Reject** untuk meng-approve/reject form

## Struktur Database

### Collection: `users`
```
users/
  {userId}/
    - email: string
    - name: string
    - role: "staff" | "manager"
```

### Collection: `forms`
```
forms/
  {formId}/
    - namaUnitKerja: string
    - picUnitKerja: string
    - tanggalKunjungan: string
    - hasilKunjungan: string
    - kondisiAset: string
    - dokumentasi: string
    - userId: string (user yang membuat)
    - userName: string
    - userEmail: string
    - status: "pending" | "approved" | "rejected"
    - createdAt: timestamp
    - approvedAt: timestamp (optional)
    - approvedBy: string (optional)
    - rejectedAt: timestamp (optional)
    - rejectedBy: string (optional)
    - rejectionReason: string (optional)
```

## Troubleshooting

### Error: Permission Denied
- Pastikan Firestore Rules sudah di-publish dengan benar
- Pastikan user sudah login (check di Authentication > Users)
- Pastikan document user sudah dibuat di Firestore dengan role yang benar

### Error: User not found
- Pastikan email dan password benar
- Pastikan user sudah dibuat di Authentication
- Pastikan document user sudah dibuat di Firestore dengan UID yang sama

### Form tidak muncul di Manager Dashboard
- Pastikan form sudah di-submit oleh staff
- Pastikan status form adalah "pending"
- Pull to refresh di Manager Dashboard

## Next Steps

Setelah setup selesai, aplikasi sudah siap digunakan dengan fitur:
- ✅ Login dengan Firebase Authentication
- ✅ Role-based access (Staff & Manager)
- ✅ Staff bisa isi form kunjungan
- ✅ Manager bisa approve/reject form
- ✅ Data tersimpan di Firestore Database
- ✅ Logout functionality

Untuk build APK, gunakan:
```bash
npx eas build --platform android
```
