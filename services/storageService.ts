
import { Photo, AccessKey, AboutContent, Inquiry } from "../types";

const DB_NAME = "BlairPortfolioDB";
const STORE_NAME = "photos";
const KEY_STORE = "access_keys";
const ABOUT_STORE = "about_content";
const INQUIRY_STORE = "inquiries";
const DB_VERSION = 4; // Bumped version for new store

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject("Error opening IndexedDB");
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      if (!db.objectStoreNames.contains(KEY_STORE)) db.createObjectStore(KEY_STORE);
      if (!db.objectStoreNames.contains(ABOUT_STORE)) db.createObjectStore(ABOUT_STORE);
      if (!db.objectStoreNames.contains(INQUIRY_STORE)) db.createObjectStore(INQUIRY_STORE);
    };
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
  });
};

export const savePhotosToDB = async (photos: Photo[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(photos, "portfolio_data");
    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to save photos");
  });
};

export const loadPhotosFromDB = async (): Promise<Photo[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("portfolio_data");
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject("Failed to load photos");
  });
};

export const saveAboutContent = async (content: AboutContent): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ABOUT_STORE], "readwrite");
    const store = transaction.objectStore(ABOUT_STORE);
    const request = store.put(content, "about_data");
    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to save about content");
  });
};

export const loadAboutContent = async (): Promise<AboutContent | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ABOUT_STORE], "readonly");
    const store = transaction.objectStore(ABOUT_STORE);
    const request = store.get("about_data");
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject("Failed to load about content");
  });
};

export const saveAccessKeys = async (keys: AccessKey[]): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([KEY_STORE], "readwrite");
  transaction.objectStore(KEY_STORE).put(keys, "keys_list");
};

export const loadAccessKeys = async (): Promise<AccessKey[]> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction([KEY_STORE], "readonly");
    const request = transaction.objectStore(KEY_STORE).get("keys_list");
    request.onsuccess = () => resolve(request.result || []);
  });
};

export const saveInquiry = async (inquiry: Inquiry): Promise<void> => {
  const db = await initDB();
  const inquiries = await loadInquiries();
  const transaction = db.transaction([INQUIRY_STORE], "readwrite");
  transaction.objectStore(INQUIRY_STORE).put([inquiry, ...inquiries], "inquiry_list");
};

export const loadInquiries = async (): Promise<Inquiry[]> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction([INQUIRY_STORE], "readonly");
    const request = transaction.objectStore(INQUIRY_STORE).get("inquiry_list");
    request.onsuccess = () => resolve(request.result || []);
  });
};

export const deleteInquiry = async (id: string): Promise<void> => {
  const db = await initDB();
  const inquiries = await loadInquiries();
  const filtered = inquiries.filter(i => i.id !== id);
  const transaction = db.transaction([INQUIRY_STORE], "readwrite");
  transaction.objectStore(INQUIRY_STORE).put(filtered, "inquiry_list");
};
