import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const AppLayout = () => {
  return (
    <>
     <div className="flex">
      {/* Sidebar stays fixed, width is w-64 (16rem) */}
      <Sidebar />

      {/* Main content is always pushed right by ml-64 (16rem) to avoid being hidden */}
      <div className="flex flex-col ml-64 min-h-screen min-w-0 relative">
        <Navbar />
        <div className="flex-grow pt-20 p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
    </>
  )
}

export default AppLayout
