import { db, auth } from '../firebase';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion from Firestore

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
      <h1>Your Dashboard</h1>
      {/* Display user-specific content here */}
      <button onClick={() => handleSaveFavorite('locationId')}>
        Save Location to Favorites
      </button>
    </div>
  );
};

export default UserDashboard;
