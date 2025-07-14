import React from 'react'

const EmployeeNavbar = () => {
  return (
    <div className="pt-16 sm:pt-20  bg-gradient-to-br from-gray-100 to-white  px-6 sm:px-12">
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      {/* Logo */}
      <div className="mx- flex-shrink-0 text-xl font-bold text-blue-600">
        <span className="flex items-center  ">
        <img src="https://www.cmeri.res.in/sites/all/themes/cmerinew/logo.png" alt="logo" className="h-10 w-10 object-contain" />
          Employee Inventory
        </span>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={() => {
            localStorage.clear(); // optional: clear token/session
            window.location.href = '/'; // redirect to login or home
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>
</div>
  )
}

export default EmployeeNavbar