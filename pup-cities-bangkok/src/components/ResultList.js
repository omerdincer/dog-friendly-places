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
        ...doc.data()
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
    <ul className="space-y-4">
      {filteredLocations.map((location) => (
        <li key={location.id} className="border p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">{location.name}</span>
              <span className="text-gray-500 ml-2">({location.type} in {location.neighborhood})</span>
            </div>
            {location.sponsored && (
              <span className="bg-yellow-300 text-black font-bold p-1 rounded">Sponsored</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ResultList;
