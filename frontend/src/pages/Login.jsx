import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user_id, setUser_id] = useState('');
  const [password, setPassword] = useState('');
  const { serverURL, login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(serverURL + '/api/auth/login', {
        user_id,
        password
      }, { withCredentials: true });
      const userData = res.data.user;
      const token = res.data.token;
      login(userData, token);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div
            className="h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
          >
            <img src="https://www.cmeri.res.in/sites/all/themes/cmerinew/logo.png" alt="logo" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
        </div>
        <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-y-6">
  <div className="space-y-4">
    <div>
      <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
        User ID
      </label>
      <input
        id="user_id"
        name="user_id"
        type="number"
        value={user_id}
        onChange={(e) => setUser_id(e.target.value)}
        required
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        placeholder="Enter your 4-digits user id "
      />
    </div>
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <div className="relative mt-1">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-gray-900"
          placeholder="Enter your password"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-2.5 text-xl cursor-pointer text-gray-500"
        >
          {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
        </span>
      </div>
    </div>
  </div>

  {/* ✅ Wrapped button in a div for margin control */}
  <div className="mt-6">
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
    >
      Login
    </button>
  </div>
</form>
      </div>
    </div>
  );
};

export default Login;
