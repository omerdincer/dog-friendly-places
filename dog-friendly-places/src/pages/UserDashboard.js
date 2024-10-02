import { db, auth } from '../firebase';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion from Firestore
import Header from '../components/Header'; // Assuming the Header is reused here

const UserDashboard = () => {
  const handleSaveFavorite = async (locationId) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favorites: arrayUnion(locationId), // Use arrayUnion from Firestore
      });
      alert('Location added to favorites!');
    }
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>

        {/* Two frames side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Favorite Locations */}
          <div className="p-6 bg-gray-100 shadow-lg rounded">
            <h2 className="text-2xl font-bold mb-4">Your Favorite Locations</h2>
            <div className="mb-6">
              {/* Placeholder: Display a list of favorite locations */}
              <ul>
                <li>Cafe XYZ</li>
                <li>Park ABC</li>
                {/* You can map through user favorites here if you have them */}
              </ul>
            </div>
            <button
              onClick={() => handleSaveFavorite('locationId')}
              className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 transition"
            >
              Save Location to Favorites
            </button>
          </div>

          {/* Other User Information */}
          <div className="p-6 bg-gray-100 shadow-lg rounded">
            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
            {/* Placeholder: Display user's profile information */}
            <p><strong>Email:</strong> user@example.com</p>
            <p><strong>Member Since:</strong> January 2022</p>

            {/* Add other user information or settings here */}
            <button
              className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600 transition"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
