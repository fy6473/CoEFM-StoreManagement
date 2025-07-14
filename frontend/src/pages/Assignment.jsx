import React, { useState, useEffect } from 'react';
import { FaPlus, FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Assignment = () => {
  const { serverURL, getAuthHeaders } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [assignRes, empRes, itemRes] = await Promise.all([
          axios.get(`${serverURL}/api/assignments`, { headers: getAuthHeaders() }),
          axios.get(`${serverURL}/api/user/users`, { headers: getAuthHeaders() }),
          axios.get(`${serverURL}/api/items/get`)
        ]);
        setAssignments(assignRes.data);
        setEmployees(empRes.data.filter(emp => emp.role === 'employee'));
        setInventoryItems(itemRes.data.items.map(item => ({
          ...item,
          id: item._id,
          status: getItemStatus(item._id, assignRes.data)
        })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchAll();
    // eslint-disable-next-line
  }, [serverURL]);

  // Helper to get item status
  const getItemStatus = (itemId, assignmentsList) => {
    const assigned = assignmentsList.find(a => a.itemId._id === itemId && a.status === 'assigned');
    return assigned ? 'assigned' : 'available';
  };

  // Assign item to employee
  const assignItem = async (itemId, employeeId) => {
    try {
      const res = await axios.post(
        `${serverURL}/api/assignments`,
        { itemId, employeeId },
        { headers: getAuthHeaders() }
      );
      setAssignments(prev => [...prev, res.data]);
      setInventoryItems(items => items.map(item => item._id === itemId ? { ...item, status: 'assigned' } : item));
    } catch (error) {
      alert('Failed to assign item');
    }
  };

  // Return item
  const returnItem = async (assignmentId) => {
    try {
      const res = await axios.put(
        `${serverURL}/api/assignments/return/${assignmentId}`,
        {},
        { headers: getAuthHeaders() }
      );
      setAssignments(prev => prev.map(a => a._id === assignmentId ? res.data : a));
      setInventoryItems(items => items.map(item => item._id === res.data.itemId ? { ...item, status: 'available' } : item));
    } catch (error) {
      alert('Failed to return item');
    }
  };

  // Filter available items
  const availableItems = inventoryItems.filter(item => item.status === 'available');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItemId && selectedEmployeeId) {
      assignItem(selectedItemId, selectedEmployeeId);
      setSelectedItemId('');
      setSelectedEmployeeId('');
      setShowForm(false);
    }
  };

  return (
    <div className='w-6xl relative left-68 top-10 bg-gray-50 min-h-screen'>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={availableItems.length === 0 || employees.length === 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${availableItems.length === 0 || employees.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Assign Item
        </button>
      </div>
      {showForm && (
        <div className="mt-5 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Assign Item to Employee
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="item"
                  className="block text-sm font-medium text-gray-700"
                >
                  Item
                </label>
                <select
                  id="item"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Item</option>
                  {availableItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.itemname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="employee"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee
                </label>
                <select
                  id="employee"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Returned Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.length > 0 ? (
              assignments.map((assignment) => {
                const item = assignment.itemId;
                const employee = assignment.employeeId;
                return (
                  <tr key={assignment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item ? `${item.itemname}` : 'Unknown Item'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee ? employee.name : 'Unknown Employee'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.returnedDate
                        ? new Date(assignment.returnedDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.status === 'assigned' && (
                        <button
                          onClick={() => returnItem(assignment._id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FaSyncAlt className="h-4 w-4 mr-1" />
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No assignments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignment;
