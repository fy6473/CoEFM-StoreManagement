import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';


const CreateEmployee = () => {
  const { serverURL, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    user_id: '',
    password: '',
    mobile_no: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update employee
        const res = await axios.put(
          `${serverURL}/api/user/update/${editId}`,
          {
            name: form.name,
            user_id: form.user_id,
            position: form.position,
            mobile_no: form.mobile_no
          },
          { headers: getAuthHeaders() }
        );
        
        setEmployees(prev => 
          prev.map(emp => 
            emp._id === editId 
              ? { ...emp, name: form.name, user_id: form.user_id, position: form.position, mobile_no: form.mobile_no }
              : emp
          )
        );
        alert('Employee updated successfully!');
      } else {
        // Add new employee
        const res = await axios.post(
          `${serverURL}/api/auth/register`,
          {
            name: form.name,
            user_id: form.user_id,
            password: form.password,
            position: form.position,
            mobile_no: form.mobile_no
          },
          { withCredentials: true }
        );

        setEmployees([...employees, {
          _id: res.data.user._id,
          name: form.name,
          user_id: form.user_id,
          position: form.position,
          mobile_no: form.mobile_no
        }]);
        alert('Employee added successfully!');
      }

      setShowModal(false);
      setEditId(null);
      setForm({ name: '', position: '', user_id: '', password: '', mobile_no: '' });
    } catch (error) {
      console.error('Operation failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error while processing employee');
    }
  };

  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      position: employee.position,
      user_id: employee.user_id,
      password: '',
      mobile_no: employee.mobile_no
    });
    setEditId(employee._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await axios.delete(`${serverURL}/api/user/delete/${id}`, { 
        headers: getAuthHeaders() 
      });
      setEmployees(prev => prev.filter(emp => emp._id !== id));
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Failed to delete employee:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error while deleting employee');
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/user/users`, { 
          headers: getAuthHeaders() 
        });
        // Filter for employees with role === 'employee'
        const employeesOnly = res.data.filter(emp => emp.role === 'employee');
        setEmployees(employeesOnly);
      } catch (error) {
        console.error('Failed to fetch employees:', error.response?.data || error.message);
      }
    };
    fetchEmployees();
  }, [serverURL, getAuthHeaders]);

  return (
    <div className="w-6xl relative left-68 top-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 shadow"
          onClick={() => {
            setShowModal(true);
            setEditId(null);
            setForm({ name: '', position: '', user_id: '', password: '', mobile_no: '' });
          }}
        >
          <span className="text-xl font-bold">+</span> {editId ? 'Edit Employee' : 'Add Employee'}
        </button>
      </div>

      {/* Modal */}
       {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-all">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
              onClick={() => {
                setShowModal(false);
                setEditId(null);
                setForm({ name: '', position: '', user_id: '', password: '', mobile_no: '' });
              }}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-6 text-blue-700 text-center">
              {editId ? 'Edit Employee' : 'Add Employee'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded transition-all outline-none"
                required
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={form.position}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded transition-all outline-none"
                required
              />
              <input
                type="text"
                name="user_id"
                placeholder="User ID"
                value={form.user_id}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded transition-all outline-none"
                required
              />
              {!editId && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded transition-all outline-none"
                  required
                />
              )}
              <input
                type="number"
                name="mobile_no"
                placeholder="Mobile No"
                value={form.mobile_no}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded transition-all outline-none appearance-none"
                required
                onWheel={e => e.target.blur()}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setForm({ name: '', position: '', user_id: '', password: '', mobile_no: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors"
                >
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      <div className="bg-white shadow rounded-md overflow-hidden mt-6">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 uppercase font-semibold">Name</th>
              <th className="px-6 py-3 uppercase font-semibold">User ID</th>
              <th className="px-6 py-3 uppercase font-semibold">Designation</th>
              <th className="px-6 py-3 uppercase font-semibold">Mobile No</th>
              <th className="px-6 py-3 uppercase font-semibold">Actions</th>
             
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No data yet. Click "Add Employee" to create one.
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={emp._id || index} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">{emp.name}</td>
                  <td className="px-6 py-4">{emp.user_id}</td>
                  <td className="px-6 py-4">{emp.position}</td>
                  <td className="px-6 py-4">{emp.mobile_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleEdit(emp)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(emp._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                 
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateEmployee;