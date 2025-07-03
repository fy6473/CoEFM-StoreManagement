import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaClipboardList } from 'react-icons/fa';
import { PiPackageBold } from "react-icons/pi";
import Dashboard from '../pages/Dashboard';
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FaHome },
    { name: 'Employees', path: '/admin/createEmployee', icon: FaUser },
    { name: 'Inventory', path: '/admin/inventory', icon: PiPackageBold },
    { name: 'Assignments', path: '/admin/assignments', icon: FaClipboardList },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col justify-between z-10">
      <div className="px-4 py-6">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer">
            <img
              src="https://www.cmeri.res.in/sites/all/themes/cmerinew/logo.png"
              alt="logo"
              className="h-12 w-12 object-contain"
            />
          </div>
          <h1 className="mt-3 text-xl font-bold text-blue-700 text-center">
            Store Management
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-7 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition-all  font-medium ${
                  active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                }`}
              >
                <Icon
                  className={`h-5 w-5 mr-3 ${
                    active ? 'text-blue-700' : 'text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
