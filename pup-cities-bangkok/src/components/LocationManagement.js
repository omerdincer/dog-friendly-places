import { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Import Firebase Storage
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For image upload

const LocationManagement = () => {
  // Location states
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);
  const [image, setImage] = useState(null); // State to store the selected image file
  const [imageUrl, setImageUrl] = useState(''); // State to store the uploaded image URL

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

    return () => {
      unsubscribeNeighborhoods();
      unsubscribeTypes();
    };
  }, []);

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (image) {
      const imageRef = ref(storage, `locations/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url); // Set the image URL after upload
    }
  };

  // Add new location with image
  const handleAddLocation = async () => {
    try {
      // First, upload the image if one is selected
      if (image) {
        await handleImageUpload();
      }

      // Add the location document to Firestore, including the image URL
      await addDoc(collection(db, 'locations'), {
        name,
        neighborhood,
        type,
        sponsored,
        imageUrl, // Include the image URL in the Firestore document
      });

      alert('Location added successfully!');
      // Clear the form fields
      setName('');
      setNeighborhood('');
      setType('');
      setSponsored(false);
      setImage(null); // Clear the image file input
      setImageUrl(''); // Clear the image URL
    } catch (error) {
      console.error('Error adding location:', error);
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
        <label className="block mb-4">
          <span className="text-gray-700">Upload Image</span>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded mt-2"
          />
        </label>

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