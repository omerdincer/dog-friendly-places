import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'; // For the hamburger icon
import { FaInstagram } from 'react-icons/fa';  // For the Instagram logo
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import LoginPopup from './LoginPopup';  // Import LoginPopup component
import SignUpPopup from './SignUpPopup';  // Import SignUpPopup component
import { auth } from '../firebase';  // Firebase auth

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);  // For the Sign Up popup
  const [userRole, setUserRole] = useState(null);  // Track user role
  const [successMessage, setSuccessMessage] = useState('');  // Track success messages

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleLoginPopup = () => {
    setLoginOpen(!isLoginOpen);  // Toggle login popup
  };

  const toggleSignUpPopup = () => {
    setSignUpOpen(!isSignUpOpen);  // Toggle sign-up popup
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUserRole(null);  // Reset role on logout
  };

  // Callback for handling successful sign-up
  const handleSignUpSuccess = (message) => {
    setSuccessMessage(message);  // Set success message
  };

  // Function to dismiss the success message manually
  const dismissSuccessMessage = () => {
    setSuccessMessage('');  // Clear the success message
  };

  // Automatically dismiss success message after 8 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');  // Clear the success message after 8 seconds
      }, 8000);  // 8000 milliseconds = 8 seconds

      return () => clearTimeout(timer);  // Clear the timeout if component unmounts or message changes
    }
  }, [successMessage]);

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
            {/* Home Link */}
            <li className="mb-2">
              <Link to="/" onClick={toggleSidebar}>Home</Link>  {/* Link to home page */}
            </li>

            {/* Conditionally render links based on user role */}
            {userRole === 'admin' && <li className="mb-2"><Link to="/admin" onClick={toggleSidebar}>Admin Panel</Link></li>}
            {userRole === 'user' && <li className="mb-2"><Link to="/dashboard" onClick={toggleSidebar}>User Dashboard</Link></li>}

            {/* Show Login/Logout based on authentication status */}
            {userRole ? (
              <li className="mb-2 cursor-pointer" onClick={handleLogout}>Logout</li>
            ) : (
              <>
                <li className="mb-2 cursor-pointer" onClick={toggleLoginPopup}>Login</li>
                <li className="mb-2 cursor-pointer" onClick={toggleSignUpPopup}>Sign Up</li>  {/* New Sign-Up Button */}
              </>
            )}
          </ul>
        </div>
      )}

      {/* Success Message (after popup closes) */}
      {successMessage && (
        <div className="p-4 bg-green-500 text-white text-center relative mx-auto max-w-4xl">
          {successMessage}
          {/* Close button */}
          <button
            onClick={dismissSuccessMessage}
            className="absolute top-0 right-0 p-2 text-xl text-white"
          >
            &times; {/* X symbol for closing */}
          </button>
        </div>
      )}

      {/* Login Popup */}
      {isLoginOpen && <LoginPopup closePopup={toggleLoginPopup} setUserRole={setUserRole} />} 

      {/* Sign Up Popup */}
      {isSignUpOpen && <SignUpPopup closePopup={toggleSignUpPopup} onSignUpSuccess={handleSignUpSuccess} />}  {/* Show Sign-Up Popup */}
    </>
  );
};

export default Header;
