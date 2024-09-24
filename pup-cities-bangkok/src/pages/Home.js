import React, { useState } from 'react';
import Filter from '../components/Filter';
import ResultList from '../components/ResultList';

const Home = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Find Dog-Friendly Places in Bangkok</h1>
      <Filter onFilterChange={handleFilterChange} />
      <ResultList filters={filters} />
    </div>
  );
};

export default Home;


/* bununla devam edicez. mysql kurucaz
7. Next Steps
Sponsored Listings: You can implement this by adding a sponsored flag to some locations and giving them special styling or priority in the results list.
Styling: Use Tailwind CSS or regular CSS to make your site responsive and visually appealing.
Backend: If you need a backend, use Firebase for hosting and database, or set up a MySQL database with an API.

*/