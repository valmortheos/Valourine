import { openDB, IDBPDatabase } from 'idb';
import { Track } from '../types';

const DB_NAME = 'valourine_db';
const STORE_NAME = 'audio_cache';
const VERSION = 1;

interface AudioCacheDB {
  [STORE_NAME]: {
    key: string;
    value: {
      id: string;
      data: Blob;
      timestamp: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<AudioCacheDB>>;

export const initDB = () => {
  dbPromise = openDB<AudioCacheDB>(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const getCachedAudio = async (id: string): Promise<Blob | null> => {
  const db = await dbPromise;
  const entry = await db.get(STORE_NAME, id);
  if (entry) {
    return entry.data;
  }
  return null;
};

export const cacheAudio = async (id: string, data: Blob) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, {
    id,
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = async () => {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
};
