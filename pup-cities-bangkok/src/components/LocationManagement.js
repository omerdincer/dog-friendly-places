import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const LocationManagement = () => {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [googleMapsLink, setGoogleMapsLink] = useState(''); // New state for Google Maps link
  const [progress, setProgress] = useState(0); // Track upload progress
  const [progressText, setProgressText] = useState(''); // Text inside progress bar

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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        alert('Only JPEG, JPG, and PNG formats are allowed.');
        return;
      }
      setImageFile(file);
    }
  };

  // Compress and upload the image to Firebase Storage
  const uploadImage = async (file) => {
    const options = {
      maxSizeMB: 1, // Limit size to 1MB
      maxWidthOrHeight: 360, // Resize to 360p
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `locations/${compressedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progressPercentage); // Update progress state
            setProgressText(progressPercentage === 100 ? 'Almost Completed!' : 'Started!');
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error compressing or uploading the image:', error);
      return null;
    }
  };

  // Add new location
  const handleAddLocation = async () => {
    if (!name || !neighborhood || !type || !googleMapsLink) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      setProgress(0); // Reset progress bar
      setProgressText('Started!'); // Show "Started!" text when button is clicked

      let imageURL = null;
      if (imageFile) {
        imageURL = await uploadImage(imageFile); // Upload and get the image URL
      }

      await addDoc(collection(db, 'locations'), {
        name,
        neighborhood,
        type,
        sponsored,
        imageURL, // Store the image URL in Firestore
        googleMapsLink, // Store the Google Maps link in Firestore
      });

      alert('Location added successfully!');
      setName('');
      setNeighborhood('');
      setType('');
      setSponsored(false);
      setImageFile(null);
      setGoogleMapsLink(''); // Reset Google Maps link
      setProgress(100); // Set progress to 100% when location is added
      setProgressText('Almost Completed!'); // Show "Completed!" text when the upload is done
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

        <input
          type="text"
          placeholder="Google Maps Link"
          value={googleMapsLink}
          onChange={(e) => setGoogleMapsLink(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        {/* Dynamic progress bar */}
        <div className="relative w-full bg-gray-300 rounded h-2.5 mb-4">
          <div
            className="bg-blue-500 h-2.5 rounded"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-white">
            {progressText}
          </span>
        </div>

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