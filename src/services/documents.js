// Document Storage Service using IndexedDB
import { openDB } from 'idb';

const DB_NAME = 'CAProConnect_Documents';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

// Initialize IndexedDB
const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('clientId', 'clientId');
        store.createIndex('folder', 'folder');
      }
    }
  });
};

/**
 * Save a document to IndexedDB
 */
export const saveDocument = async (document) => {
  const db = await getDB();
  const id = document.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const docData = {
    ...document,
    id,
    uploadedAt: document.uploadedAt || new Date().toISOString()
  };
  
  await db.put(STORE_NAME, docData);
  return docData;
};

/**
 * Get all documents for a client
 */
export const getDocumentsByClient = async (clientId) => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('clientId');
  return index.getAll(clientId);
};

/**
 * Get documents by folder
 */
export const getDocumentsByFolder = async (clientId, folder) => {
  const docs = await getDocumentsByClient(clientId);
  return docs.filter(d => d.folder === folder);
};

/**
 * Get a single document by ID
 */
export const getDocumentById = async (id) => {
  const db = await getDB();
  return db.get(STORE_NAME, id);
};

/**
 * Delete a document
 */
export const deleteDocument = async (id) => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};

/**
 * Get all documents
 */
export const getAllDocuments = async () => {
  const db = await getDB();
  return db.getAll(STORE_NAME);
};

/**
 * Convert File to base64 for storage
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Download a document
 */
export const downloadDocument = async (doc) => {
  // Create a link and trigger download
  const a = document.createElement('a');
  a.href = doc.data;
  a.download = doc.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Get folder statistics
 */
export const getFolderStats = async (clientId) => {
  const docs = await getDocumentsByClient(clientId);
  const stats = {};
  
  docs.forEach(doc => {
    const folder = doc.folder || 'Uncategorized';
    if (!stats[folder]) {
      stats[folder] = { count: 0, size: 0 };
    }
    stats[folder].count++;
    stats[folder].size += doc.size || 0;
  });
  
  return stats;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
