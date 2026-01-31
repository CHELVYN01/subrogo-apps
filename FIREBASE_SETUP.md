# 🔥 Firebase Setup Instructions - SUBRO GO

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "**Add Project**"
3. Project name: **SUBRO-GO**
4. Disable Google Analytics (optional)
5. Click "**Create Project**"

---

## Step 2: Enable Authentication

1. In Firebase Console, click "**Authentication**" in left menu
2. Click "**Get Started**"
3. Click "**Email/Password**" tab
4. **Enable** the toggle
5. Click "**Save**"

---

## Step 3: Create Firestore Database

1. Click "**Firestore Database**" in left menu
2. Click "**Create Database**"
3. Select "**Start in production mode**"
4. Choose location: **asia-southeast1** (Singapore) or closest to you
5. Click "**Enable**"

---

## Step 4: Setup Firestore Rules

In Firestore Database, click "**Rules**" tab and paste this:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only read
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin can write
    }

    // Forms collection
    match /forms/{formId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;

      // Staff can create
      allow create: if request.auth != null;

      // Only manager or form creator can update
      allow update: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager' ||
         resource.data.userId == request.auth.uid);

      // Only creator can delete
      allow delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
\`\`\`

Click "**Publish**"

---

## Step 5: Get Firebase Config

1. In Firebase Console, click ⚙️ (Settings) > "**Project settings**"
2. Scroll down to "**Your apps**"
3. Click **</>** (Web app icon)
4. App nickname: **SUBRO GO Web**
5. Click "**Register app**"
6. **Copy** the firebaseConfig object

---

## Step 6: Update Config File

Open `config/firebase.ts` and replace with your config:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

---

## Step 7: Create Demo Users (via Firebase Console)

### Method 1: Via Authentication Tab

1. Go to "**Authentication**" > "**Users**" tab
2. Click "**Add User**"

**Staff User:**
- Email: `staff@subrogo.com`
- Password: `staff123`

**Manager User:**
- Email: `manager@subrogo.com`
- Password: `manager123`

### Method 2: Via Firestore (Add User Data)

1. Go to "**Firestore Database**"
2. Click "**Start collection**"
3. Collection ID: `users`

**Add Staff Document:**
- Document ID: [Copy UID from Authentication > Users > staff@subrogo.com]
- Fields:
  ```
  email: "staff@subrogo.com"
  name: "Staff User"
  role: "staff"
  createdAt: [Current timestamp]
  ```

**Add Manager Document:**
- Document ID: [Copy UID from Authentication > Users > manager@subrogo.com]
- Fields:
  ```
  email: "manager@subrogo.com"
  name: "Manager User"
  role: "manager"
  createdAt: [Current timestamp]
  ```

---

## Step 8: Enable Storage (for Photos)

1. Click "**Storage**" in left menu
2. Click "**Get Started**"
3. Start in **production mode**
4. Choose same location as Firestore
5. Click "**Done**"

### Storage Rules:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /dokumentasi/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 5 * 1024 * 1024; // Max 5MB
    }
  }
}
\`\`\`

---

## Step 9: Test the App

1. Run the app:
   \`\`\`bash
   npm start
   \`\`\`

2. Login with:
   - **Staff**: staff@subrogo.com / staff123
   - **Manager**: manager@subrogo.com / manager123

---

## Database Structure

### Users Collection:
\`\`\`
users/
  {userId}/
    - email: string
    - name: string
    - role: "staff" | "manager"
    - createdAt: timestamp
\`\`\`

### Forms Collection:
\`\`\`
forms/
  {formId}/
    - userId: string
    - userEmail: string
    - userName: string
    - type: "cac" | "cbc"
    - bankName: string
    - unitName: string
    - namaUnitKerja: string
    - picUnitKerja: string
    - tanggalKunjungan: string
    - hasilKunjungan: string
    - kondisiAset: string
    - status: "pending" | "approved" | "rejected"
    - createdAt: timestamp
    - approvedBy: string | null
    - approvedAt: timestamp | null
    - approverName: string | null
\`\`\`

---

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you updated `config/firebase.ts` with your actual Firebase config

### "Firebase: Error (auth/user-not-found)"
- Create the demo users in Firebase Authentication

### "Firestore: Missing or insufficient permissions"
- Update Firestore Rules as shown in Step 4

---

## Next Steps

After setup is complete, you can:
1. ✅ Login with staff account
2. ✅ Fill form kunjungan
3. ✅ Submit and see data in Firestore
4. ✅ Login with manager account
5. ✅ Approve/reject pending forms

---

## Support

If you need help:
1. Check Firebase Console for errors
2. Check app logs in terminal
3. Verify Firestore Rules are correct
4. Make sure users exist in Authentication

**Happy coding! 🚀**
