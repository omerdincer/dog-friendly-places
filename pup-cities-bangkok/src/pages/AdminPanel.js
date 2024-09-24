import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

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
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Location Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Neighborhood"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type (Cafe, Park, etc.)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={sponsored}
            onChange={() => setSponsored(!sponsored)}
          />
          Sponsored
        </label>
        <button onClick={handleAddLocation}>Add Location</button>
      </form>
    </div>
  );
};

export default AdminPanel;
