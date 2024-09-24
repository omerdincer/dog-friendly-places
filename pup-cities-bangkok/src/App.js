import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

/* buna dönüştürelecek
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<PrivateRoute roleRequired="admin" component={AdminPanel} />} />
        <Route path="/dashboard" element={<PrivateRoute roleRequired="user" component={UserDashboard} />} />
      </Routes>
    </Router>
  );
}

export default App;

*/