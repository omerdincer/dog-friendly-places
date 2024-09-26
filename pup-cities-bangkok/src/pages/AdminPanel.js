import Header from '../components/Header';
import UserManagement from '../components/UserManagement';
import LocationForm from '../components/LocationForm';
import FilterManagement from '../components/FilterManagement'; // Import the FilterManagement component

const AdminPanel = () => {
  return (
    <div>
      <Header />

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Admin Panel</h1>

        {/* Three frames side by side */}
        <div className="grid grid-cols-3 gap-4">
          {/* Add Location Form */}
          <LocationForm />

          {/* Filter Management */}
          <FilterManagement /> {/* Include the FilterManagement component */}

          {/* User Management */}
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
