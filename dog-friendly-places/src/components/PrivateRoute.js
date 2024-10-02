import { Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

// PrivateRoute component for protected routes
const PrivateRoute = ({ component: Component, roleRequired, ...rest }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setRole(userDoc.data().role);
        }
        setLoading(false);
      });
    };

    fetchUserRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        role === roleRequired ? <Component {...props} /> : <Navigate to="/" />
      }
    />
  );
};

export default PrivateRoute;
