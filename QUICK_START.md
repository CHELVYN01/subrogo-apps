# 🚀 Quick Start Guide - SUBRO GO

## ⚡ Super Quick Setup (5 Minutes)

### 1. Setup Firebase (One Time)

```bash
# Already installed! Just need to configure
```

Go to: https://console.firebase.google.com

1. Create Project → Name: **SUBRO-GO**
2. Enable **Authentication** (Email/Password)
3. Create **Firestore Database**
4. Get your **config** and paste in `config/firebase.ts`

**Full guide:** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

---

### 2. Create Demo Users in Firebase Console

**Authentication > Users > Add User:**

| Email | Password | Role |
|-------|----------|------|
| staff@subrogo.com | staff123 | Staff |
| manager@subrogo.com | manager123 | Manager |

Then create user documents in **Firestore > users collection**:

**Document ID = User UID from Authentication**

Staff document:
```json
{
  "email": "staff@subrogo.com",
  "name": "Staff User",
  "role": "staff"
}
```

Manager document:
```json
{
  "email": "manager@subrogo.com",
  "name": "Manager User",
  "role": "manager"
}
```

---

### 3. Run the App

```bash
npm start
```

Press:
- `a` for Android
- `i` for iOS
- `w` for Web

---

## 🎯 How to Use

### As STAFF:

1. Login: `staff@subrogo.com` / `staff123`
2. Go to CAC or CBC
3. Click on Bank/Company name
4. Click **+** button
5. Fill form kunjungan
6. Submit → Data saved to Firebase!

### As MANAGER:

1. Login: `manager@subrogo.com` / `manager123`
2. See all pending forms
3. Click **Approve** or **Reject**
4. Staff gets notified!

---

## 📊 Firebase Console - What to Check

### Authentication Tab:
✅ See all logged in users
✅ Reset passwords
✅ Delete users

### Firestore Tab:
✅ See all submitted forms
✅ Check form status (pending/approved/rejected)
✅ See who approved what

### Storage Tab:
✅ See uploaded documentation photos

---

## 🔥 Features Implemented

### ✅ Authentication:
- [x] Email/Password login
- [x] Role-based access (Staff/Manager)
- [x] Persistent login (AsyncStorage)

### ✅ Database (Firestore):
- [x] Save form kunjungan
- [x] Real-time updates
- [x] Query by status
- [x] Query by user

### ✅ Authorization:
- [x] Staff can create forms
- [x] Manager can approve/reject
- [x] Security rules enforced

### ✅ UI:
- [x] Beautiful Material Design
- [x] Responsive layout
- [x] Loading states
- [x] Error handling

---

## 📱 Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure
eas build:configure

# Build APK
eas build -p android --profile preview
```

Download link will appear in terminal after ~15 minutes.

---

## 🐛 Common Issues

### "Configuration not found"
→ Update `config/firebase.ts` with your Firebase config

### "User not found"
→ Create demo users in Firebase Authentication + Firestore

### "Permission denied"
→ Update Firestore Rules (see FIREBASE_SETUP.md)

---

## 📁 Project Structure

```
subro-go/
├── app/              # Screens
│   ├── splash.tsx    # Splash + Login
│   ├── home.tsx      # Main menu
│   ├── cac.tsx       # CAC list
│   ├── cbc.tsx       # CBC list
│   ├── detail.tsx    # Bank/Company detail
│   ├── form-kunjungan.tsx  # Form input
│   └── simulasi.tsx  # Calculator
├── config/
│   └── firebase.ts   # ⚠️ UPDATE THIS!
├── context/
│   └── AuthContext.tsx  # Auth state management
├── services/
│   └── firestore.ts  # Database operations
└── FIREBASE_SETUP.md # Full setup guide
```

---

## 🎓 Next Steps

1. ✅ Setup Firebase (5 min)
2. ✅ Create demo users (2 min)
3. ✅ Test login (1 min)
4. ✅ Submit form as staff (2 min)
5. ✅ Approve as manager (1 min)
6. 🚀 Build APK (15 min)
7. 📱 Deploy to device!

---

**Need help?** Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

**Happy coding! 🔥**
