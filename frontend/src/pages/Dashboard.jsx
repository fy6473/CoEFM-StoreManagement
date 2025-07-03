import React from 'react';
import { FaUser ,FaClipboardList } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { RiAlignItemBottomFill } from "react-icons/ri";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards – replace with dynamic data later */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
              <FaUser className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Employees</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
              <FiPackage className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Inventory</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-emerald-500">
              <RiAlignItemBottomFill className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Available Items</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-purple-500">
              <FaClipboardList className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Active Assignments</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Assignments</h2>
        <div className="mt-4 overflow-hidden rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Data rows to be populated dynamically */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
