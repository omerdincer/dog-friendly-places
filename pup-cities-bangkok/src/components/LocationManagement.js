import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const LocationManagement = () => {
  // Location states
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State to handle image file

  // Filter options states
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);

  // Real-time updates for neighborhoods and types
  useEffect(() => {
    const unsubscribeNeighborhoods = onSnapshot(doc(db, 'filters', 'neighborhoods'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setNeighborhoods(docSnapshot.data().values);
      }
    });

    const unsubscribeTypes = onSnapshot(doc(db, 'filters', 'types'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setTypes(docSnapshot.data().values);
      }
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribeNeighborhoods();
      unsubscribeTypes();
    };
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `locations/${imageFile.name}`);
      
      // Upload image to Firebase Storage
      uploadBytes(storageRef, imageFile).then((snapshot) => {
        // Get the image download URL
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          // Add location data along with the image URL
          try {
            await addDoc(collection(db, 'locations'), {
              name,
              neighborhood,
              type,
              sponsored,
              imageURL: downloadURL // Save the image URL to Firestore
            });
            alert('Location added successfully!');
            setName('');
            setNeighborhood('');
            setType('');
            setSponsored(false);
            setImageFile(null); // Reset the file input
          } catch (error) {
            console.error('Error adding location:', error);
          }
        });
      });
    } else {
      alert('Please upload an image.');
    }
  };

  return (
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

        {/* Neighborhood Dropdown */}
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Neighborhood</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={sponsored}
            onChange={() => setSponsored(!sponsored)}
            className="mr-2"
          />
          Sponsored
        </label>

        {/* Image Upload */}
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleAddLocation}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 transition"
        >
          Add Location
        </button>
      </form>
    </div>
  );
};

export default LocationManagement;