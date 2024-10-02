import React, { useState } from 'react';
import Filter from '../components/Filter';
import ResultList from '../components/ResultList';
import Header from '../components/Header';  // Import the Header

const Home = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <Header /> {/* Add Header here */}
      <div className="container mx-auto p-4">
        {/* Main Heading */}
        <div className="text-center my-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dog Friendly Prag</h1>
          <p className="text-lg text-gray-500">Find dog-friendly destinations in Prag now!</p>
        </div>

        {/* Filters Section */}
        <Filter onFilterChange={handleFilterChange} />

        {/* Result List Section */}
        <ResultList filters={filters} />
      </div>
    </div>
  );
};

export default Home;