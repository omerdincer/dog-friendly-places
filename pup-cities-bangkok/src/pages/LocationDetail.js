import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Firestore instance
import { doc, getDoc } from "firebase/firestore";
import Header from '../components/Header'; // Import Header component

const LocationDetail = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      const docRef = doc(db, "locations", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLocation(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchLocationDetails();
  }, [id]);

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Add the Header at the top */}
      <Header />

      {/* Main content container */}
      <div className="container mx-auto p-4">
        <div className="p-6 bg-gray-100 shadow-lg rounded">
          <h1 className="text-4xl font-bold mb-4">{location.name}</h1>
          <img
            src={location.imageURL || "../components/materials/default.png"}
            alt={location.name}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <p className="text-lg mb-4">Type: {location.type}</p>
          <p className="text-lg mb-4">Neighborhood: {location.neighborhood}</p>

          {/* Display the Google Maps iframe */}
          {location.googleMapsLink && (
            <div
              dangerouslySetInnerHTML={{ __html: location.googleMapsLink }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;