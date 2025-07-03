import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Employee from './pages/Employee';
import AppLayout from './Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PrivateRoute from './Context/PrivateRoute';
import AuthContext from './Context/AuthContext';
import Assignment from './pages/Assignment';
import CreateEmployee from './pages/CreateEmployee';

const App = () => {
  return (
    <AuthContext>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Admin dashboard layout */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="createEmployee" element={<CreateEmployee />} />
          <Route path="assignments" element={<Assignment />} />
        </Route>

        {/* ✅ Employee route */}
        <Route
          path="/employee"
          element={
            <PrivateRoute allowedRoles={['employee', 'admin']}>
              <Employee />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthContext>
  );
};

export default App;
