import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Header from '../components/Header';  // Assuming you have the Header component

const AdminPanel = () => {
  // Location states
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);

  // User management states
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user'); // Default role is 'user'

  // Fetch users from Firestore on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = await getDocs(collection(db, 'users'));
      const userList = userCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    try {
      await addDoc(collection(db, 'locations'), {
        name,
        neighborhood,
        type,
        sponsored,
      });
      alert('Location added successfully!');
      setName(''); // Clear input fields after adding
      setNeighborhood('');
      setType('');
      setSponsored(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, 'users'), {
        email: newUserEmail,
        role: newUserRole,
        status: true  // Set the initial status as true (active)
      });
      alert('User added successfully!');
      setNewUserEmail(''); // Clear input fields
      setNewUserRole('user'); // Reset role
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update user role
  const handleUpdateUser = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Deactivate user
  const handleDeactivateUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status: false });
      alert('User deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      alert('User deleted successfully!');
      setUsers(users.filter(user => user.id !== userId)); // Remove from local state
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      {/* Adding the header to match the Home page design */}
      <Header /> 

      {/* Main container */}
      <div className="container mx-auto p-4">
        {/* Admin Panel Title */}
        <h1 className="text-4xl font-bold mb-4 text-center">Admin Panel</h1>

        {/* Add Location Form */}
        <div className="max-w-lg mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-4">Add New Location</h2>
          <form onSubmit={(e) => e.preventDefault()} className="mb-6">
            <input
              type="text"
              placeholder="Location Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Type (Cafe, Park, etc.)"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={sponsored}
                onChange={() => setSponsored(!sponsored)}
                className="mr-2"
              />
              Sponsored
            </label>
            <button
              onClick={handleAddLocation}
              className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 transition"
            >
              Add Location
            </button>
          </form>
        </div>

        {/* User Management */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>

          {/* Add New User */}
          <form onSubmit={(e) => e.preventDefault()} className="mb-6">
            <input
              type="email"
              placeholder="New User Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600 transition"
            >
              Add User
            </button>
          </form>

          {/* User List */}
          <h3 className="text-xl font-bold mb-2">Current Users</h3>
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-4 border p-4 rounded shadow">
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Status: {user.status ? 'Active' : 'Inactive'}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleUpdateUser(user.id, user.role === 'admin' ? 'user' : 'admin')}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                  >
                    Toggle Role
                  </button>
                  <button
                    onClick={() => handleDeactivateUser(user.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
