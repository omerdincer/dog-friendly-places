import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage'; // Import the LoginPage
import AuthRoute from './components/AuthRoute';  // Assuming you have the AuthRoute component
import LocationDetail from "./pages/LocationDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/location/:id" element={<LocationDetail />} />
        {/* Protected Routes */}
        {/* Only admins can access the AdminPanel */}
        <Route 
          path="/admin" 
          element={
            <AuthRoute requiredRole="admin">
              <AdminPanel />
            </AuthRoute>
          } 
        />

        {/* Any authenticated user can access the UserDashboard */}
        <Route 
          path="/dashboard" 
          element={
            <AuthRoute requiredRole="user">  {/* Protect the dashboard */}
              <UserDashboard />
            </AuthRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
