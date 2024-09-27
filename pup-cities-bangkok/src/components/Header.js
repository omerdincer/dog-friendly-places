import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'; // For the hamburger and close icons
import { FaInstagram } from 'react-icons/fa';  // For the Instagram logo
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import LoginPopup from './LoginPopup';  // Import LoginPopup component
import SignUpPopup from './SignUpPopup';  // Import SignUpPopup component
import { auth, db } from '../firebase';  // Firebase auth and firestore
import { onAuthStateChanged } from 'firebase/auth';  // Listen to auth state changes
import { getDoc, doc } from 'firebase/firestore';  // Firestore functions

// Import your logo image
import Logo from '../components/materials/logo.png'; // Adjust this path based on where your logo is

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

  // Automatically check if the user is logged in on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch the user's role from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      } else {
        setUserRole(null);  // No user is signed in
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // Callback for handling successful sign-up
  const handleSignUpSuccess = (message) => {
    setSuccessMessage(message);  // Set success message for sign-up
  };

  // Callback for handling successful login
  const handleLoginSuccess = (message) => {
    setSuccessMessage(message);  // Set success message for login
  };

  // Function to dismiss the success message manually
  const dismissSuccessMessage = () => {
    setSuccessMessage('');  // Clear the success message
  };

  // Automatically dismiss success message after 6 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');  // Clear the success message after 6 seconds
      }, 6000);  // 6000 milliseconds = 6 seconds

      return () => clearTimeout(timer);  // Clear the timeout if component unmounts or message changes
    }
  }, [successMessage]);

  return (
    <>
      <header className="relative flex items-center justify-between p-4 bg-white shadow-md h-20">
        {/* Instagram Icon on the left */}
        <div className="absolute left-4 flex items-center space-x-2">
          <FaInstagram className="text-3xl" />
        </div>

        {/* Centered Logo */}
        <img
          src={Logo}
          alt="Pup Cities Bangkok Logo"
          className="absolute inset-x-0 mx-auto h-full object-contain" // Adjust the height as needed
        />

        {/* Hamburger Menu on the right */}
        <button onClick={toggleSidebar} className="absolute right-4 text-3xl">
          <AiOutlineMenu />
        </button>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } w-64 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg z-50 p-6`}
      >
        <button onClick={toggleSidebar} className="absolute top-4 right-4 text-white text-2xl">
          <AiOutlineClose />
        </button>
        <ul className="mt-12 space-y-6">
          <li className="text-white font-semibold text-lg">
            <Link to="/" onClick={toggleSidebar}>Home</Link>
          </li>

          {userRole === 'admin' && (
            <li className="text-white font-semibold text-lg">
              <Link to="/admin" onClick={toggleSidebar}>Admin Panel</Link>
            </li>
          )}
          {userRole === 'user' && (
            <li className="text-white font-semibold text-lg">
              <Link to="/dashboard" onClick={toggleSidebar}>User Dashboard</Link>
            </li>
          )}

          {userRole ? (
            <li className="text-red-500 font-semibold text-lg cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          ) : (
            <>
              <li className="text-white font-semibold text-lg cursor-pointer" onClick={toggleLoginPopup}>
                Login
              </li>
              <li className="text-white font-semibold text-lg cursor-pointer" onClick={toggleSignUpPopup}>
                Sign Up
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Success Message (after popup closes) */}
      {successMessage && (
        <div className="p-4 bg-green-500 text-white text-center relative mx-auto max-w-4xl">
          {successMessage}
          {/* Close button */}
          <button
            onClick={dismissSuccessMessage}
            className="absolute top-0 right-0 p-2 text-xl text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Login Popup */}
      {isLoginOpen && <LoginPopup closePopup={toggleLoginPopup} setUserRole={setUserRole} onLoginSuccess={handleLoginSuccess} />} 

      {/* Sign Up Popup */}
      {isSignUpOpen && <SignUpPopup closePopup={toggleSignUpPopup} onSignUpSuccess={handleSignUpSuccess} />}  
    </>
  );
};

export default Header;