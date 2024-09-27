import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const LocationManagement = () => {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);
  const [image, setImage] = useState(null); // State for storing selected image file
  const [imageURL, setImageURL] = useState(''); // State for storing image URL after upload

  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);

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

  // Function to handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Function to upload image and get its download URL
  const uploadImage = async () => {
    if (!image) return;

    const storageRef = ref(storage, `locations/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track the progress of the upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      () => {
        // Handle successful upload and get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at:', downloadURL);
          setImageURL(downloadURL); // Store the download URL in state
        });
      }
    );
  };

  const handleAddLocation = async () => {
    try {
      // Upload image first before adding location
      await uploadImage();

      await addDoc(collection(db, 'locations'), {
        name,
        neighborhood,
        type,
        sponsored,
        imageURL, // Save image URL in Firestore
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

        {/* Image Input */}
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-4 p-2" />

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