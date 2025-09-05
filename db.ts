import { Card, PlayerCard, PlayerCurrencies } from './types';
import { INITIAL_CARDS, INITIAL_PLAYER_CARDS, INITIAL_PLAYER_CURRENCIES } from './constants';

const DB_NAME = 'FapCollectionDB';
const DB_VERSION = 2; // Incremented version due to schema changes

const STORE_GAME_CARDS = 'game_cards';
const STORE_PLAYER_CARDS = 'player_cards';
const STORE_PLAYER_CURRENCIES = 'player_currencies';
const STORE_CARD_IMAGES = 'card_images';

let db: IDBDatabase;

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Error opening DB');
            reject(new Error('Error opening DB'));
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            const tx = (event.target as IDBOpenDBRequest).transaction;
            
            if (!dbInstance.objectStoreNames.contains(STORE_GAME_CARDS)) {
                const store = dbInstance.createObjectStore(STORE_GAME_CARDS, { keyPath: 'id' });
                INITIAL_CARDS.forEach(card => store.add(card));
            }
            if (!dbInstance.objectStoreNames.contains(STORE_PLAYER_CARDS)) {
                const store = dbInstance.createObjectStore(STORE_PLAYER_CARDS, { keyPath: 'instanceId' });
                INITIAL_PLAYER_CARDS.forEach(card => store.add(card));
            }
             if (!dbInstance.objectStoreNames.contains(STORE_PLAYER_CURRENCIES)) {
                const store = dbInstance.createObjectStore(STORE_PLAYER_CURRENCIES, { keyPath: 'id' });
                store.add({ id: 1, ...INITIAL_PLAYER_CURRENCIES });
            }
            if (!dbInstance.objectStoreNames.contains(STORE_CARD_IMAGES)) {
                dbInstance.createObjectStore(STORE_CARD_IMAGES, { keyPath: 'id' });
            }

            tx.oncomplete = () => console.log("DB seeding complete.");
        };
    });
};

const getStore = (storeName: string, mode: IDBTransactionMode) => {
    const transaction = db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
}

// Generic function to get all items from a store
const getAllFromStore = <T>(storeName: string): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(storeName, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// --- Public API ---
export const initDB = openDB;

// Game Cards (the master list of all cards)
export const getGameCards = (): Promise<Card[]> => getAllFromStore<Card>(STORE_GAME_CARDS);
export const saveGameCard = (card: Card): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORE_GAME_CARDS, 'readwrite');
        const request = store.put(card);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const deleteGameCard = (cardId: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORE_GAME_CARDS, 'readwrite');
        const request = store.delete(cardId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Player Cards (the player's collection)
export const getPlayerCards = (): Promise<PlayerCard[]> => getAllFromStore<PlayerCard>(STORE_PLAYER_CARDS);
export const addPlayerCards = (cards: PlayerCard[]): Promise<void> => {
     return new Promise(async (resolve, reject) => {
        await openDB();
        const transaction = db.transaction([STORE_PLAYER_CARDS], 'readwrite');
        const store = transaction.objectStore(STORE_PLAYER_CARDS);
        cards.forEach(card => store.add(card));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}
export const removePlayerCards = (instanceIds: string[]): Promise<void> => {
     return new Promise(async (resolve, reject) => {
        await openDB();
        const transaction = db.transaction([STORE_PLAYER_CARDS], 'readwrite');
        const store = transaction.objectStore(STORE_PLAYER_CARDS);
        instanceIds.forEach(id => store.delete(id));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}


// Player Currencies
export const getPlayerCurrencies = async (): Promise<PlayerCurrencies> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORE_PLAYER_CURRENCIES, 'readonly');
        const request = store.get(1); // Always get the single currency object
        request.onsuccess = () => resolve(request.result || INITIAL_PLAYER_CURRENCIES);
        request.onerror = () => reject(request.error);
    });
};
export const updatePlayerCurrencies = (currencies: PlayerCurrencies): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORE_PLAYER_CURRENCIES, 'readwrite');
        const request = store.put({ id: 1, ...currencies });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};


// Card Images
export const setImage = (id: number, imageData: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORE_CARD_IMAGES, 'readwrite');
        const request = store.put({ id, imageData });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getAllImages = (): Promise<Map<number, string>> => {
    return new Promise(async (resolve, reject) => {
       await openDB();
       const store = getStore(STORE_CARD_IMAGES, 'readonly');
       const request = store.getAll();
       request.onsuccess = () => {
           const imageMap = new Map<number, string>();
           request.result.forEach((item: {id: number, imageData: string}) => {
               imageMap.set(item.id, item.imageData);
           });
           resolve(imageMap);
       };
       request.onerror = () => reject(request.error);
    });
};
