import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Firestore instance
import { doc, getDoc } from "firebase/firestore";

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
    <div className="p-6 bg-gray-100 shadow-lg rounded">
      <h1 className="text-4xl font-bold mb-4">{location.name}</h1>
      <img
        src={location.imageURL || "../components/materials/default.png"}
        alt={location.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-lg mb-4">Type: {location.type}</p>
      <p className="text-lg mb-4">Neighborhood: {location.neighborhood}</p>

      {/* Display the Google Maps link with a small visual */}
      {location.googleMapsLink && (
        <iframe
          title="Google Maps"
          src={location.googleMapsLink}
          width="100%"
          height="300"
          className="rounded"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      )}
    </div>
  );
};

export default LocationDetail;