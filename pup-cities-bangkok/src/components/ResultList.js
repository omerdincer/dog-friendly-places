import React from "react";

const ResultList = ({ filters }) => {
  const locations = [
    {
      id: 1,
      name: "Paws Cafe",
      neighborhood: "Ekkamai",
      type: "Cafe",
      sponsored: true,
    },
    {
      id: 2,
      name: "Bark Park",
      neighborhood: "Thonglor",
      type: "Park",
      sponsored: false,
    },
    {
      id: 3,
      name: "Dog Haven",
      neighborhood: "Sathorn",
      type: "Restaurant",
      sponsored: true,
    },
    {
      id: 4,
      name: "Puppy Playground",
      neighborhood: "Silom",
      type: "Park",
      sponsored: false,
    },
  ];

  const filteredLocations = locations
    .filter((location) => {
      return (
        (!filters.neighborhood ||
          location.neighborhood === filters.neighborhood) &&
        (!filters.type || location.type === filters.type)
      );
    })
    .sort((a, b) => b.sponsored - a.sponsored); // Sponsored items first

  return (
    <ul className="space-y-4">
      {filteredLocations.map((location) => (
        <li key={location.id} className="border p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">{location.name}</span>
              <span className="text-gray-500 ml-2">
                ({location.type} in {location.neighborhood})
              </span>
            </div>
            {location.sponsored && (
              <span className="bg-yellow-300 text-black font-bold p-1 rounded">
                Sponsored
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ResultList;
