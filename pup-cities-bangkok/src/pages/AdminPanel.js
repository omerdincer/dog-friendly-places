import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Header from '../components/Header';  // Assuming you have the Header component

const AdminPanel = () => {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);

  const handleAddLocation = async () => {
    try {
      await addDoc(collection(db, 'locations'), {
        name,
        neighborhood,
        type,
        sponsored,
      });
      alert('Location added successfully!');
      setName(''); // Clear input fields after adding
      setNeighborhood('');
      setType('');
      setSponsored(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <div>
      {/* Adding the header to match the Home page design */}
      <Header /> 

      {/* Main container */}
      <div className="container mx-auto p-4">
        {/* Admin Panel Title */}
        <h1 className="text-4xl font-bold mb-4 text-center">Admin Panel</h1>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Location Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type (Cafe, Park, etc.)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={sponsored}
              onChange={() => setSponsored(!sponsored)}
              className="mr-2"
            />
            Sponsored
          </label>
          <button
            onClick={handleAddLocation}
            className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 transition"
          >
            Add Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
