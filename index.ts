import { Drivers, Storage } from "@ionic/storage";
import { compress, decompress } from "lz-string";
import {
  AtomGeneratorOptions,
  atomStateGenerator,
  setCustomStorage,
} from "@gaddario98/react-state";

const ionicStorage = new Storage({
  name: "@gaddario-storage",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

ionicStorage.create();

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const compressedValue = await ionicStorage.get(key);
      if (compressedValue) {
        const decompressed = decompress(compressedValue);
        return decompressed ?? null;
      }
      return null;
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const compressedValue = compress(value);
      await ionicStorage.set(key, compressedValue);
    } catch (error) {
      console.error("Error setting item:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await ionicStorage.remove(key);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  },
};

export const setIonicStorageConfig = () => {
  setCustomStorage(storage); // imposta lo storage globale per Jotai
};

export { type AtomGeneratorOptions, atomStateGenerator, storage, ionicStorage };
