import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Firebase configuration
import { doc, getDoc } from 'firebase/firestore';

const Filter = ({ onFilterChange }) => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Fetch filter options from Firebase
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch neighborhoods
        const neighborhoodsDoc = await getDoc(doc(db, 'filters', 'neighborhoods'));
        if (neighborhoodsDoc.exists()) {
          setNeighborhoods(neighborhoodsDoc.data().values);
        }

        // Fetch types
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

  // Update filter state when user selects an option
  const handleFilterChange = () => {
    onFilterChange({ neighborhood: selectedNeighborhood, type: selectedType });
  };

  return (
    <div className="flex space-x-4 mb-4">
      {/* Neighborhood Filter */}
      <select
        value={selectedNeighborhood}
        onChange={(e) => setSelectedNeighborhood(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">All Neighborhoods</option>
        {neighborhoods.map((neighborhood) => (
          <option key={neighborhood} value={neighborhood}>
            {neighborhood}
          </option>
        ))}
      </select>

      {/* Type Filter */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button onClick={handleFilterChange} className="bg-blue-500 text-white p-2 rounded">
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
