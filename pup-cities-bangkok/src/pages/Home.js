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
        <h1 className="text-4xl font-bold mb-4 text-center">Find Dog-Friendly Places in Bangkok</h1>
        <Filter onFilterChange={handleFilterChange} />
        <ResultList filters={filters} />
      </div>
    </div>
  );
};

export default Home;
