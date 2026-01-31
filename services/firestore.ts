import { db } from '@/config/firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const storage = getStorage();
export interface FormData {
  userId: string;
  userEmail: string;
  userName: string;
  type: 'cac' | 'cbc';
  bankName: string;
  unitName: string;
  namaUnitKerja: string;
  picUnitKerja: string;
  tanggalKunjungan: string;
  hasilKunjungan: string;
  kondisiAset: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  approvedBy: string | null;
  approvedAt: Timestamp | null;
  approverName: string | null;
  dokumentasi?: string;   // ✅ tambahkan ini
  ttdPic?: string;         // ✅ dan ini
  ttdMitra?: string;
}

// Create new form
export const createForm = async (formData: Omit<FormData, 'createdAt' | 'status' | 'approvedBy' | 'approvedAt' | 'approverName'>) => {
  try {
    const docRef = await addDoc(collection(db, 'forms'), {
      ...formData,
      status: 'pending',
      createdAt: Timestamp.now(),
      approvedBy: null,
      approvedAt: null,
      approverName: null,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

// Get all pending forms (for manager)
export const getPendingForms = async () => {
  try {
    const q = query(
      collection(db, 'forms'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (FormData & { id: string })[];
  } catch (error) {
    console.error('Error getting pending forms:', error);
    throw error;
  }
};

// Get forms by user (for staff to see their own forms)
export const getUserForms = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'forms'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (FormData & { id: string })[];
  } catch (error) {
    console.error('Error getting user forms:', error);
    throw error;
  }
};

// Approve form (manager only)
export const approveForm = async (formId: string, managerId: string, managerName: string) => {
  try {
    const formRef = doc(db, 'forms', formId);
    await updateDoc(formRef, {
      status: 'approved',
      approvedBy: managerId,
      approvedAt: Timestamp.now(),
      approverName: managerName,
    });
  } catch (error) {
    console.error('Error approving form:', error);
    throw error;
  }
};

// Reject form (manager only)
export const rejectForm = async (formId: string, managerId: string, managerName: string) => {
  try {
    const formRef = doc(db, 'forms', formId);
    await updateDoc(formRef, {
      status: 'rejected',
      approvedBy: managerId,
      approvedAt: Timestamp.now(),
      approverName: managerName,
    });
  } catch (error) {
    console.error('Error rejecting form:', error);
    throw error;
  }
};

// Get all approved forms
export const getApprovedForms = async () => {
  try {
    const q = query(
      collection(db, 'forms'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (FormData & { id: string })[];
  } catch (error) {
    console.error('Error getting approved forms:', error);
    throw error;
  }
};

export const uploadFile = async (uri: string, path: string) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get Firebase auth token
    const token = await user.getIdToken();

    // Detect file type
    let mimeType = 'image/jpeg';
    if (uri.toLowerCase().endsWith('.png') || uri.startsWith('data:image/png')) {
      mimeType = 'image/png';
    } else if (uri.toLowerCase().endsWith('.pdf')) {
      mimeType = 'application/pdf';
    }

    // Upload using Firebase Storage REST API with XMLHttpRequest
    const bucket = storage.app.options.storageBucket;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(path)}`;

    // Create XMLHttpRequest
    const xhr = new XMLHttpRequest();

    return new Promise<string>((resolve, reject) => {
      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            // Get download URL from storage reference
            const storageRef = ref(storage, path);
            const downloadURL = await getDownloadURL(storageRef);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };

      xhr.open('POST', uploadUrl);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', mimeType);

      // Handle base64 data URL vs file URI
      if (uri.startsWith('data:')) {
        // Extract base64 and convert to binary
        const base64Data = uri.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        xhr.send(bytes);
      } else {
        // For file URIs, read using FileReader
        const xhr2 = new XMLHttpRequest();
        xhr2.open('GET', uri);
        xhr2.responseType = 'arraybuffer';

        xhr2.onload = () => {
          if (xhr2.status === 200) {
            const arrayBuffer = xhr2.response;
            const uint8Array = new Uint8Array(arrayBuffer);
            xhr.send(uint8Array);
          } else {
            reject(new Error(`Failed to read file: ${xhr2.status}`));
          }
        };

        xhr2.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        xhr2.send();
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};