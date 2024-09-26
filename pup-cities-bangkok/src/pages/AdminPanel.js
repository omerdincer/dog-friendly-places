import Header from '../components/Header';
import UserManagement from '../components/UserManagement';
import LocationForm from '../components/LocationForm'; // Import the new LocationForm component

const AdminPanel = () => {
  return (
    <div>
      <Header />

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Admin Panel</h1>

        {/* Two frames side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Add Location Form */}
          <LocationForm /> {/* Include the LocationForm component */}

          {/* User Management */}
          <UserManagement /> {/* Include the UserManagement component */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
