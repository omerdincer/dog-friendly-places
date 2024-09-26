import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage'; // Import the newly created LoginPage
import AuthRoute from './components/AuthRoute.js';  // Assuming you have the AuthRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Use LoginPage here */}
        <Route 
          path="/admin" 
          element={
            <AuthRoute requiredRole="admin">
              <AdminPanel />
            </AuthRoute>
          } 
        />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
