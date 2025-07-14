import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';

const EmployeeData = () => {
  // If employee prop is provided, use it directly
 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const { serverURL, getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${serverURL}/api/user/employee/profile`, {
          headers: { ...getAuthHeaders() },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data.employee);
        setAssignments(data.assignments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [serverURL, getAuthHeaders]);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  if (error) return <div className="text-red-600 text-center mt-8">Error: {error}</div>;
  if (!profile) return <div className="text-center mt-8">No profile data found.</div>;

  return (
    <>
    <div className="  min-h-screen  from-gray-100 to-white  px-6 sm:px-12">
      {/* Profile Section */}
      <div className="max-w-6xl mx-auto mb-10 bg-white shadow-xl rounded-2xl p-8 flex items-start gap-6 border border-gray-200">
        <div className="text-blue-600 text-6xl">
          <FaUserCircle />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            {profile.name || profile.username || profile.email}
            <span className="text-base font-medium text-gray-500">(Employee)</span>
          </h1>
          <div className="text-gray-600 space-y-1 mt-2">
            <p><span className="font-semibold">User Id:</span> {profile.user_id || 'N/A'}</p>
            <p><span className="font-semibold">Mobile:</span> {profile.mobile_no || 'N/A'}</p>
            <p><span className="font-semibold">Position:</span> {profile.position || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Assignment Section */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <MdAssignment className="text-3xl text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Assignments</h2>
        </div>

        {assignments.length === 0 ? (
          <p className="text-gray-500 text-center">No assignments found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-4">Assignment Date</th>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {assignments.map((a) => (
                  <tr key={a._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4">{new Date(a.assignedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{a.itemId?.itemname || 'N/A'}</td>
                    <td className="px-6 py-4">{a.itemId?.quantity || 'N/A'}</td>
                    <td className="px-6 py-4">₹{a.itemId?.price?.toLocaleString() || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default EmployeeData;
