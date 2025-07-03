import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const CreateEmployee = () => {
  const { serverURL } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

      // Add the new employee to the local list
      setEmployees([...employees, {
        name: form.name,
        user_id: form.user_id,
        position: form.position
      }]);

      alert('Employee added successfully!');
      setShowModal(false);
      setForm({ name: '', position: '', user_id: '', password: '', mobile_no: '' });
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error while adding employee');
    }
  };

  // ...existing code...
  return (
    <div className="w-6xl relative left-68 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 shadow"
          onClick={() => setShowModal(true)}
        >
          <span className="text-xl font-bold">+</span> Add Employee
        </button>
      </div>

      {/* Modal */}
       {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-all">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-6 text-blue-700 text-center">Add Employee</h3>
            
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
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded transition-all outline-none"
                required
              />
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
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors"
                >
                  Add
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
              <th className="px-6 py-3 uppercase font-semibold">Email</th>
              <th className="px-6 py-3 uppercase font-semibold">Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No data yet. Click "Add Employee" to create one.
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={index} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">{emp.name}</td>
                  <td className="px-6 py-4">{emp.user_id}</td>
                  <td className="px-6 py-4">{emp.position}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
// ...existing code...
};

export default CreateEmployee;