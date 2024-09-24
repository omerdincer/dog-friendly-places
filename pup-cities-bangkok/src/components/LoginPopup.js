import React, { useState } from 'react';

const LoginPopup = ({ closePopup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault();
      console.log('Logging in with', email, password);
      closePopup();  // Close the popup after login
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
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
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
  