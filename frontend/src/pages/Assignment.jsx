// src/pages/Assignment.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlus, FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

// ✅ Plain‐JS debounce hook (no TS generics)
function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const handlerRef = useRef(null);

  useEffect(() => {
    if (handlerRef.current) {
      clearTimeout(handlerRef.current);
    }
    handlerRef.current = window.setTimeout(() => {
      setDebounced(value);
      handlerRef.current = null;
    }, delay);

    return () => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }
    };
  }, [value, delay]);

  return debounced;
}

const Assignment = () => {
  const { serverURL, getAuthHeaders } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedItemSearch = useDebounced(itemSearchTerm, 300);
  const debouncedEmployeeSearch = useDebounced(employeeSearchTerm, 300);

  const getItemStatus = useCallback((itemId, assignList) => {
    return assignList.some(a => a?.itemId?._id === itemId && a.status === 'assigned')
      ? 'assigned'
      : 'available';
  }, []);

  useEffect(() => {
    let alive = true;
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [
          assignRes,
          empRes,
          itemRes
        ] = await Promise.all([
          axios.get(`${serverURL}/api/assignments`, { headers: getAuthHeaders() }),
          axios.get(`${serverURL}/api/user/users`, { headers: getAuthHeaders() }),
          axios.get(`${serverURL}/api/items/get`)
        ]);
        if (!alive) return;

        const assign = assignRes.data || [];
        const emps = (empRes.data || []).filter(emp => emp.role === 'employee');
        const items = itemRes.data?.items || [];

        setAssignments(assign);
        setEmployees(emps);
        setInventoryItems(items.map(it => ({
          _id: it._id,
          itemname: it.itemname || '',
          status: getItemStatus(it._id, assign)
        })));
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchAll();
    return () => { alive = false; };
  }, [serverURL, getAuthHeaders, getItemStatus]);

  useEffect(() => {
    setInventoryItems(cur =>
      cur.map(it => ({
        ...it,
        status: getItemStatus(it._id, assignments)
      }))
    );
  }, [assignments, getItemStatus]);

  const availableItems = inventoryItems.filter(it => it.status === 'available');

  const filteredItems = availableItems.filter(it =>
    it.itemname.toLowerCase().includes(debouncedItemSearch.toLowerCase())
  );
  const filteredEmployees = employees.filter(emp =>
    (emp.name || '').toLowerCase().includes(debouncedEmployeeSearch.toLowerCase())
  );

  const assignItem = async (itemId, employeeId) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${serverURL}/api/assignments`,
        { itemId, employeeId },
        { headers: getAuthHeaders() }
      );
      setAssignments(prev => [...prev, res.data]);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to assign');
    } finally {
      setLoading(false);
    }
  };

  const returnItem = async (assignmentId) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(
        `${serverURL}/api/assignments/return/${assignmentId}`,
        {},
        { headers: getAuthHeaders() }
      );
      setAssignments(prev =>
        prev.map(a => (a._id === res.data._id ? res.data : a))
      );
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to return');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (selectedItemId && selectedEmployeeId) {
      assignItem(selectedItemId, selectedEmployeeId);
      setSelectedItemId('');
      setSelectedEmployeeId('');
      setShowForm(false);
    }
  };

  return (
    <div className='left-66 relative top-10 mb-6 w-[calc(100vw-310px)] '>
    <div className="p-6 bg-gray-50  min-h-screen">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <button
          disabled={!filteredItems.length || !filteredEmployees.length || loading}
          onClick={() => setShowForm(s => !s)}
          className={`
            inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow
            ${(!filteredItems.length || !filteredEmployees.length || loading)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Assign Item
        </button>
      </header>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium">Assign Item to Employee</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="itemSearch" className="block text-sm font-medium">Search Items</label>
              <input
                id="itemSearch"
                type="text"
                value={itemSearchTerm}
                onChange={e => setItemSearchTerm(e.target.value)}
                placeholder="Filter items…"
                className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <label htmlFor="itemSelect" className="block text-sm font-medium mt-3">Item</label>
              <select
                id="itemSelect"
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                required
                className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Item</option>
                {filteredItems.map(it => (
                  <option key={it._id} value={it._id}>
                    {it.itemname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="empSearch" className="block text-sm font-medium">Search Employees</label>
              <input
                id="empSearch"
                type="text"
                value={employeeSearchTerm}
                onChange={e => setEmployeeSearchTerm(e.target.value)}
                placeholder="Filter employees…"
                className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <label htmlFor="empSelect" className="block text-sm font-medium mt-3">Employee</label>
              <select
                id="empSelect"
                value={selectedEmployeeId}
                onChange={e => setSelectedEmployeeId(e.target.value)}
                required
                className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Employee</option>
                {filteredEmployees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.position})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-700 border rounded-md bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedItemId || !selectedEmployeeId || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th>Item</th>
              <th>Employee</th>
              <th>Assigned</th>
              <th>Returned</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0
              ? assignments.map(a => {
                  const item = a.itemId;
                  const emp = a.employeeId;
                  return (
                    <tr key={a._id}>
                      <td className="px-4 py-2">{item?.itemname ?? 'Unknown Item'}</td>
                      <td className="px-4 py-2">{emp?.name ?? 'Unknown Employee'}</td>
                      <td className="px-4 py-2">
                        {a.assignedDate ? new Date(a.assignedDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-2">
                        {a.returnedDate ? new Date(a.returnedDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                            a.status === 'assigned'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {a.status === 'assigned' && (
                          <button
                            onClick={() => returnItem(a._id)}
                            disabled={loading}
                            className="flex items-center text-blue-600 hover:text-blue-900"
                          >
                            <FaSyncAlt className="h-4 w-4 mr-1" />
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              : (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-6 text-gray-500">
                    No assignments yet
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div></div>
  );
};

export default Assignment;
