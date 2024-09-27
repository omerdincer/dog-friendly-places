import { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";

const ResultList = ({ filters }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, "locations"));
      const locationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocations(locationsData);
    };

    fetchLocations();
  }, []);

  const filteredLocations = locations
    .filter((location) => {
      return (
        (!filters.neighborhood || location.neighborhood === filters.neighborhood) &&
        (!filters.type || location.type === filters.type)
      );
    })
    .sort((a, b) => b.sponsored - a.sponsored); // Sort sponsored first

  return (
    <div className="flex justify-center"> {/* This will center the results */}
      <ul className="space-y-4 w-full max-w-md"> {/* Max-width ensures the content doesn't stretch too wide */}
        {filteredLocations.map((location) => (
          <li
            key={location.id}
            className={`rounded-lg p-4 shadow-lg ${
              location.sponsored ? "bg-pink-100" : "bg-[#e7e0d8]"
            }`}
          >
            <div className="flex items-center">
              {/* Placeholder for location image */}
              <img
                src="../components/materials/dogpark.png" // Replace with your dynamic image logic if needed
                alt={location.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{location.name}</h2>
                <p className="text-gray-600">
                  A {location.type} in {location.neighborhood}.
                </p>
              </div>

              {/* Sponsored Tag */}
              {location.sponsored && (
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full ml-auto">
                  Sponsored
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultList;