import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const FilterManagement = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newType, setNewType] = useState('');

  // Fetch the current neighborhoods and types from Firestore
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const neighborhoodsDoc = await getDoc(doc(db, 'filters', 'neighborhoods'));
        if (neighborhoodsDoc.exists()) {
          setNeighborhoods(neighborhoodsDoc.data().values);
        }

        const typesDoc = await getDoc(doc(db, 'filters', 'types'));
        if (typesDoc.exists()) {
          setTypes(typesDoc.data().values);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilters();
  }, []);

  // Add a new neighborhood
  const handleAddNeighborhood = async () => {
    try {
      await updateDoc(doc(db, 'filters', 'neighborhoods'), {
        values: arrayUnion(newNeighborhood),
      });
      setNeighborhoods([...neighborhoods, newNeighborhood]);
      setNewNeighborhood('');
    } catch (error) {
      console.error('Error adding neighborhood:', error);
    }
  };

  // Delete a neighborhood
  const handleDeleteNeighborhood = async (neighborhood) => {
    try {
      await updateDoc(doc(db, 'filters', 'neighborhoods'), {
        values: arrayRemove(neighborhood),
      });
      setNeighborhoods(neighborhoods.filter((n) => n !== neighborhood));
    } catch (error) {
      console.error('Error deleting neighborhood:', error);
    }
  };

  // Add a new type
  const handleAddType = async () => {
    try {
      await updateDoc(doc(db, 'filters', 'types'), {
        values: arrayUnion(newType),
      });
      setTypes([...types, newType]);
      setNewType('');
    } catch (error) {
      console.error('Error adding type:', error);
    }
  };

  // Delete a type
  const handleDeleteType = async (type) => {
    try {
      await updateDoc(doc(db, 'filters', 'types'), {
        values: arrayRemove(type),
      });
      setTypes(types.filter((t) => t !== type));
    } catch (error) {
      console.error('Error deleting type:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Manage Filters (Neighborhoods & Types)</h2>

      {/* Neighborhoods Management */}
      <h3 className="text-xl font-bold mb-2">Manage Neighborhoods</h3>
      <ul className="mb-4">
        {neighborhoods.map((neighborhood) => (
          <li key={neighborhood} className="flex justify-between items-center mb-2">
            <span>{neighborhood}</span>
            <button
              onClick={() => handleDeleteNeighborhood(neighborhood)}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New Neighborhood"
        value={newNeighborhood}
        onChange={(e) => setNewNeighborhood(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleAddNeighborhood}
        className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600 transition"
      >
        Add Neighborhood
      </button>

      {/* Types Management */}
      <h3 className="text-xl font-bold mb-2 mt-6">Manage Types</h3>
      <ul className="mb-4">
        {types.map((type) => (
          <li key={type} className="flex justify-between items-center mb-2">
            <span>{type}</span>
            <button
              onClick={() => handleDeleteType(type)}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New Type"
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleAddType}
        className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600 transition"
      >
        Add Type
      </button>
    </div>
  );
};

export default FilterManagement;
