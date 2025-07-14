import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AppLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content with margin to avoid overlap */}
      <div className="flex flex-col min-h-screen w-full ml-64">
        {/* Optional fixed Navbar - give it a height if fixed */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-grow px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
