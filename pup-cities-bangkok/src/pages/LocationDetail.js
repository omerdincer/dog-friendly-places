import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Firestore instance
import { doc, getDoc } from "firebase/firestore";
import Header from '../components/Header'; // Import Header component
import { FaInstagram, FaFacebook, FaLine } from 'react-icons/fa'; // Import social icons

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
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {/* Location Image */}
          <img
            src={location.imageURL || "../components/materials/default.png"}
            alt={location.name}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />

          {/* Location Name and Social Icons */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
            <div className="flex space-x-2 text-2xl text-gray-700">
              <FaInstagram />
              <FaFacebook />
              <FaLine />
            </div>
          </div>

          {/* Location Type and Description */}
          <p className="text-xl text-gray-500 mb-4">{location.type}</p>
          <p className="text-lg text-gray-700 mb-4">
            A spacious park with plenty of facilities for dogs to play and exercise.
          </p>

          {/* Google Maps Link */}
          {location.googleMapsLink && (
            <div className="mb-6 w-full">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{
                  __html: location.googleMapsLink.replace(
                    'height="450"',
                    'height="100%"'
                  ) // Ensure iframe height is dynamic and fits the container
                }}
              />
            </div>
          )}

          {/* Photos Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={location.imageURL}
                alt={`${location.name} 1`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <img
                src={location.imageURL}
                alt={`${location.name} 2`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <img
                src={location.imageURL}
                alt={`${location.name} 3`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <img
                src={location.imageURL}
                alt={`${location.name} 4`}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;