
import React, { useState } from 'react'
import Sidebar from '../components/sidebar.jsx'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import { dummyUserData } from '../assets/assets';
import Loading from '../components/Loading.jsx';
import { useSelector } from 'react-redux';
const Layout = () => {
 const [sidebaropen, setsidebaropen]= useState(false);
const user= useSelector((state)=>state.user.value);

  return user ? (
    <div  className=' w-full h-screen flex'>
      <Sidebar sidebaropen={sidebaropen} setsidebaropen={setsidebaropen} />
  <div className="flex-1 bg-slate-50">
    <Outlet/>

  </div>
  {
    sidebaropen ?
<X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow h-10 w-10 text-gray-500 sm:hidden ' onClick={()=> setsidebaropen(false)}/>
 :
 <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow h-10 w-10 text-gray-500 sm:hidden ' onClick={()=> setsidebaropen(true)} />
  }
    </div>
  )
  :
  (
    <Loading/>
  )
}

export default Layout