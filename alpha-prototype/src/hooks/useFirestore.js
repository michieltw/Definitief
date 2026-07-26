import { useState, useEffect } from 'react';

// In-memory mock database to persist writes during the session
const mockDB = new Map();

/**
 * A mock useFirestore hook that simulates Firebase Firestore for the prototype.
 * By default, it returns null for reads unless data has been written to the mockDB.
 * This enforces the zero-mock-data policy by triggering the DataMissingIndicator.
 */
export function useFirestoreDocument(collectionPath, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = `${collectionPath}/${docId}`;

  useEffect(() => {
    // Simulate network delay
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const storedData = mockDB.get(key);
        // Strict null if not found
        setData(storedData || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [collectionPath, docId, key]);

  const updateDoc = async (newData) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = mockDB.get(key) || {};
        const updatedData = { ...currentData, ...newData };
        mockDB.set(key, updatedData);
        setData(updatedData);
        setLoading(false);
        resolve(updatedData);
      }, 300);
    });
  };

  const setDoc = async (newData) => {
      setLoading(true);
      return new Promise((resolve) => {
          setTimeout(() => {
              mockDB.set(key, newData);
              setData(newData);
              setLoading(false);
              resolve(newData);
          }, 300);
      });
  };

  // Simulate atomic array operations
  const arrayUnion = async (field, item) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = mockDB.get(key) || {};
        const currentArray = currentData[field] || [];

        // Ensure uniqueness (simple mock version)
        const itemExists = currentArray.some(existing =>
          JSON.stringify(existing) === JSON.stringify(item)
        );

        if (!itemExists) {
            const updatedData = { ...currentData, [field]: [...currentArray, item] };
            mockDB.set(key, updatedData);
            setData(updatedData);
            resolve(updatedData);
        } else {
            resolve(currentData);
        }
        setLoading(false);
      }, 300);
    });
  };

  const arrayRemove = async (field, itemPredicate) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = mockDB.get(key) || {};
        const currentArray = currentData[field] || [];

        // Remove items matching the predicate (e.g. { playerId: "123" })
        // A real Firestore arrayRemove needs exact match, but mock predicate works for our prototype
        const updatedArray = currentArray.filter(existing => {
            let match = true;
            for (let k in itemPredicate) {
                if (existing[k] !== itemPredicate[k]) match = false;
            }
            return !match;
        });

        const updatedData = { ...currentData, [field]: updatedArray };
        mockDB.set(key, updatedData);
        setData(updatedData);
        setLoading(false);
        resolve(updatedData);
      }, 300);
    });
  };

  return { data, loading, error, updateDoc, setDoc, arrayUnion, arrayRemove };
}

export function useFirestoreCollection(collectionPath) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const results = [];
            for (const [key, value] of mockDB.entries()) {
                if (key.startsWith(`${collectionPath}/`)) {
                    results.push({ id: key.split('/').pop(), ...value });
                }
            }
            // Strict null if collection is empty, not an empty array.
            setData(results.length > 0 ? results : null);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [collectionPath]);

    return { data, loading };
}