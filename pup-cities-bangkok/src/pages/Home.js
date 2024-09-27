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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pup Cities</h1>
          <p className="text-lg text-gray-500">Find dog-friendly destinations in Bangkok now!</p>
        </div>

        {/* Featured Section */}
        <div className="my-6 flex justify-center">
          <div className="w-full max-w-md bg-pink-100 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <img
                src="../components/materials/dogpark.png"
                alt="Featured Location"
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dog Lovers Park</h2>
                <p className="text-gray-600">A spacious park with plenty of facilities for dogs to play and exercise.</p>
              </div>
              <span className="bg-pink-500 text-white px-3 py-1 rounded-full ml-auto">Featured</span>
            </div>
          </div>
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