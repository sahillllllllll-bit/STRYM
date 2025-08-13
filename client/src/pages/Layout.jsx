
import React, { useState } from 'react'
import Sidebar from '../components/sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import { dummyUserData } from '../assets/assets';
import Loading from '../components/Loading';
const Layout = () => {
 const { sidebaropen, setsidebaropen}= useState(false);
const user= dummyUserData

  return user ? (
    <div className='w-full h-screen flex'>
      <Sidebar sidebaropen={sidebaropen} setsidebaropen={setsidebaropen} />
  <div className="flex-1 bg-slate-50">
    <Outlet/>

  </div>
  {
    sidebaropen ?
<X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow h-10 w-10 text-gray-500 sm:hidden ' onClick={()=> setsidebaropen(false)}/>
 :
 <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow h-10 w-10 text-gray-500 sm:hidden ' onClick={()=> setsidebaropen(True)} />
  }
    </div>
  )
  :
  (
    <Loading/>
  )
}

export default Layout