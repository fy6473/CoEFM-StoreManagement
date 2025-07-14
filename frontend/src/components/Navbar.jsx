// src/components/Navbar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { logout, serverURL, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optionally notify backend (if you have a logout endpoint)
      // await fetch(`${serverURL}/api/auth/logout`, { method: 'POST', headers: getAuthHeaders() });
      logout();
      navigate('/login');
    } catch (err) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 left-64 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-1/2 flex justify-end">
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
