import { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; // Import Link from React Router

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
    <div className="flex justify-center">
      <ul className="space-y-4 w-full max-w-md">
        {filteredLocations.map((location) => (
          <li
            key={location.id}
            className={`rounded-lg p-4 shadow-lg ${
              location.sponsored ? "bg-pink-100" : "bg-[#e7e0d8]"
            }`}
          >
            <Link
              to={`/location/${location.id}`}
              target="_blank" // Open in new tab
              className="flex items-center"
            >
              <img
                src={location.imageURL || "../components/materials/default.png"}
                alt={location.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {location.name}
                </h2>
                <p className="text-gray-600">
                  A {location.type} in {location.neighborhood}.
                </p>
              </div>

              {location.sponsored && (
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full ml-auto">
                  Sponsored
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultList;