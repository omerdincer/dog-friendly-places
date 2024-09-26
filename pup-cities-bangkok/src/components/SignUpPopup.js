import React, { useState } from 'react';
import { auth, db } from '../firebase';  // Import Firebase authentication and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';  // For Firestore document creation

const SignUpPopup = ({ closePopup, onSignUpSuccess }) => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  
  const role = 'user';  // Default role is 'user'

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Clear previous messages

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After signing up, create a Firestore document with user's uid and set status as 'active'
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,  
        status: 'active',  // Set status as 'active' when signing up
      });

      // Notify parent component that the sign-up was successful
      onSignUpSuccess('Sign up successful! Welcome aboard!');
      
      // Close the popup
      closePopup();
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage('Error signing up. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp}>
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
            Sign Up
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-4 text-center text-red-500">{errorMessage}</p>
        )}

        <button onClick={closePopup} className="mt-4 text-center text-blue-500 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SignUpPopup;
