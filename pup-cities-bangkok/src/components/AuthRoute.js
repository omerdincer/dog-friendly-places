import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase'; // Correct the import path

const AuthRoute = ({ children }) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = '/login'; // Redirect to login page if not authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  return children;
};

export default AuthRoute;
