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
    <div className="mb-6 space-y-4">
      {/* Type Filter */}
      <div className="flex flex-wrap justify-center space-x-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`p-3 border ${
              selectedType === type ? 'bg-pink-500 text-white' : 'bg-gray-100'
            } rounded-full shadow-md hover:shadow-lg transition-all`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Neighborhood Filter */}
      <div className="flex flex-wrap justify-center space-x-4">
        {neighborhoods.map((neighborhood) => (
          <button
            key={neighborhood}
            onClick={() => setSelectedNeighborhood(neighborhood)}
            className={`p-3 border ${
              selectedNeighborhood === neighborhood ? 'bg-pink-500 text-white' : 'bg-gray-100'
            } rounded-full shadow-md hover:shadow-lg transition-all`}
          >
            {neighborhood}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleFilterChange}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;