import React, { useState } from 'react';
import { auth, db } from '../firebase';  // Firebase setup
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';  // Import getDoc and doc

const LoginPopup = ({ closePopup, setUserRole, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's role after successful login
      const userRef = doc(db, 'users', user.uid);  // Create reference to user document
      const userSnap = await getDoc(userRef);  // Get the document snapshot

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        setUserRole(role);  // Set the role in parent state
      }

      // Pass success message to parent component
      onLoginSuccess('Login successful! Welcome back!');

      closePopup();  // Close the popup after successful login
    } catch (error) {
      console.error("Error logging in:", error);
      alert('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
            Login
          </button>
        </form>
        <button onClick={closePopup} className="mt-4 text-center text-blue-500 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
