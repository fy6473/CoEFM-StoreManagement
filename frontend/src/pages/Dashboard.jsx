import React, { useEffect, useState } from 'react';
import { FaUser, FaClipboardList } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { RiAlignItemBottomFill } from 'react-icons/ri';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Dashboard = () => {
  const { serverURL, getAuthHeaders } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, invRes, assignRes] = await Promise.all([
          axios.get(`${serverURL}/api/user/users`, { headers: getAuthHeaders() }),
          axios.get(`${serverURL}/api/items/get`),
          axios.get(`${serverURL}/api/assignments`, { headers: getAuthHeaders() }),
        ]);

        setEmployees(empRes.data.filter((emp) => emp.role === 'employee'));
        setInventory(invRes.data.items);
        setAssignments(assignRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, [serverURL, getAuthHeaders]);

  const totalEmployees = employees.length;
  const totalInventory = inventory.length;

  const availableItems = inventory.filter((item) =>
    !assignments.some((a) =>
      a?.itemId?._id === item?._id &&         // ✅ Safe chaining both levels
      a?.status === 'assigned'
    )
  ).length;

  const activeAssignments = assignments.filter((a) => a?.status === 'assigned').length;

  const recentAssignments = [...assignments]
    .sort((a, b) => new Date(b?.assignedDate) - new Date(a?.assignedDate))
    .slice(0, 5);

  return (
    <div className="left-66 relative top-10 mb-6 w-[calc(100vw-310px)]">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center gap-4 p-5">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500">
              <FaUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Total Employees</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center gap-4 p-5">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-500">
              <FiPackage className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Total Inventory</p>
              <p className="text-2xl font-semibold text-gray-900">{totalInventory}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center gap-4 p-5">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500">
              <RiAlignItemBottomFill className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Available Items</p>
              <p className="text-2xl font-semibold text-gray-900">{availableItems}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center gap-4 p-5">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500">
              <FaClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Active Assignments</p>
              <p className="text-2xl font-semibold text-gray-900">{activeAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h2>
        <div className="overflow-hidden rounded-lg shadow">
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
              {recentAssignments.length > 0 ? (
                recentAssignments.map((a) => (
                  <tr key={a?._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {a?.itemId?.itemname ?? 'Unknown Item'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {a?.employeeId?.name ?? 'Unknown Employee'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {a?.assignedDate ? new Date(a.assignedDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          a?.status === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {a?.status ?? '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No recent assignments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
