import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // For the hamburger icon
import { FaInstagram } from 'react-icons/fa';  // For the Instagram logo
import LoginPopup from './LoginPopup.js';  // Import LoginPopup component

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);  // For login popup

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleLoginPopup = () => {
    setLoginOpen(!isLoginOpen);  // Toggle login popup
  };

  return (
    <>
      <header className="relative flex items-center justify-between p-6 bg-white shadow-md">
        {/* Instagram Icon on the left */}
        <div className="absolute left-4 flex items-center space-x-2">
          <FaInstagram className="text-3xl" />
        </div>

        {/* Centered Title */}
        <h1 className="absolute inset-x-0 text-center text-2xl font-bold">
          Pup Cities Bangkok
        </h1>

        {/* Hamburger Menu on the right */}
        <button onClick={toggleSidebar} className="absolute right-4 text-3xl">
          <AiOutlineMenu />
        </button>
      </header>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4">
          <button onClick={toggleSidebar} className="text-right mb-4">
            Close
          </button>
          <ul>
            <li className="mb-2">Home</li>
            <li className="mb-2 cursor-pointer" onClick={toggleLoginPopup}>Login</li> {/* Open Login Popup */}
            <li className="mb-2">Sign up</li>
          </ul>
        </div>
      )}

      {/* Login Popup */}
      {isLoginOpen && <LoginPopup closePopup={toggleLoginPopup} />} {/* Show popup */}
    </>
  );
};

export default Header;
