import React, { useState } from "react";

const Filter = ({ onFilterChange }) => {
  const [neighborhood, setNeighborhood] = useState("");
  const [type, setType] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ neighborhood, type });
  };

  return (
    <div className="flex space-x-4 mb-4">
      <select
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">All Neighborhoods</option>
        <option value="Ekkamai">Ekkamai</option>
        <option value="Thonglor">Thonglor</option>
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">All Types</option>
        <option value="Cafe">Cafe</option>
        <option value="Park">Park</option>
      </select>
      <button 
      onClick={handleFilterChange}
      className="bg-blue-500 text-white p-2 rounded"
      >
        Apply Filters</button>
    </div>
  );
};

export default Filter;
