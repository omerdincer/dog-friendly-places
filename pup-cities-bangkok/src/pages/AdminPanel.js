import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Header from '../components/Header';
import UserManagement from '../components/UserManagement'; // Import the new UserManagement component

const AdminPanel = () => {
  // Location states
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);

  // Add new location
  const handleAddLocation = async () => {
    try {
      await addDoc(collection(db, 'locations'), {
        name,
        neighborhood,
        type,
        sponsored,
      });
      alert('Location added successfully!');
      setName('');
      setNeighborhood('');
      setType('');
      setSponsored(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Admin Panel</h1>

        {/* Two frames side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Add Location Form */}
          <div className="p-6 bg-gray-100 shadow-lg rounded">
            <h2 className="text-2xl font-bold mb-4">Add New Location</h2>
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
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

          {/* User Management */}
          <UserManagement /> {/* Include the UserManagement component */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
