// src/components/Navbar.jsx

import { NavLink, useNavigate } from 'react-router-dom';


const Navbar = () => {

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
      </div>
    </nav>
  );
};

export default Navbar;
