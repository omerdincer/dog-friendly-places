import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Header from '../components/Header';

const AdminPanel = () => {
  // Location states
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState('');
  const [sponsored, setSponsored] = useState(false);

  // User management states
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;

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
      setName('');
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
        status: true,
      });
      alert('User added successfully!');
      setNewUserEmail('');
      setNewUserRole('user');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update user role
  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await updateDoc(doc(db, 'users', selectedUser.id), { role: selectedUser.role });
        alert('User updated successfully!');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  // Deactivate user
  const handleDeactivateUser = async () => {
    if (selectedUser) {
      try {
        await updateDoc(doc(db, 'users', selectedUser.id), { status: false });
        alert('User deactivated successfully!');
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteDoc(doc(db, 'users', selectedUser.id));
        alert('User deleted successfully!');
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setSelectedUser(null); // Clear selected user after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Pagination Logic
  const indexOfLastUser = (currentPage + 1) * usersPerPage;
  const indexOfFirstUser = currentPage * usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if ((currentPage + 1) * usersPerPage < users.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto p-4">
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

          {/* User List in Table */}
          <h3 className="text-xl font-bold mb-2">Current Users</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="font-bold">Email</div>
            <div className="font-bold">Role</div>
            <div className="font-bold">Status</div>
            <div className="font-bold">Action</div>

            {currentUsers.map(user => (
              <>
                <div key={user.id} className="p-2 border-b">
                  {user.email}
                </div>
                <div className="p-2 border-b">{user.role}</div>
                <div className="p-2 border-b">{user.status ? 'Active' : 'Inactive'}</div>
                <div className="p-2 border-b">
                  <button
                    onClick={() => setSelectedUser(user)}  // Set selected user on row click
                    className="bg-blue-500 text-white p-1 rounded"
                  >
                    Edit
                  </button>
                </div>
              </>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prevPage}
              className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              disabled={indexOfLastUser >= users.length}
            >
              Next
            </button>
          </div>

          {/* User Management Section */}
          {selectedUser && (
            <div className="mt-8 p-4 border-t">
              <h3 className="text-2xl font-bold mb-4">Manage User: {selectedUser.email}</h3>
              <div className="mb-4">
                <label>Role:</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full mb-4 p-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={handleUpdateUser}
                className="bg-yellow-500 text-white w-full p-2 rounded hover:bg-yellow-600 transition"
              >
                Update Role
              </button>
              <button
                onClick={handleDeactivateUser}
                className="bg-red-500 text-white w-full p-2 rounded hover:bg-red-600 transition mt-4"
              >
                Deactivate User
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-gray-500 text-white w-full p-2 rounded hover:bg-gray-600 transition mt-4"
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
