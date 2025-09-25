import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import {  Link, useNavigate } from 'react-router-dom'
import Menuitems from './Menuitems';
import { CirclePlus, LogOut } from 'lucide-react';
import { UserButton,useClerk} from '@clerk/clerk-react'
import { useSelector } from 'react-redux';


const Sidebar = ({sidebaropen, setsidebaropen}) => {
  const Navigate = useNavigate();
const user =useSelector((state)=>state.user.value)
const  {signOut}= useClerk();



  return (
    <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)' }}  className={`w-60 xl:w-70 bg-white  border-r border-gray-200 flex flex-col justify-between items-center  max-sm:absolute top-0 bottom-0 z-20
    ${sidebaropen ? 'translate-x-0': 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
      <div className="w-full">
        <img onClick={()=> Navigate('/')} src={assets.logo} className='w-60 h-10 ml-7 my-2 cursor-pointor' alt="" />
        <hr className='border-gray-300 mb-8' />
     <Menuitems setsidebaropen={setsidebaropen}/>

      {/* create-post  */}

 <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600  hover:to-purple-800 active:scale-95  transition text-white cursor-pointer'>
  <CirclePlus className='h-5 w-5'/>
  Create Post / Minto
 </Link>




      </div>
<div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
  <div className=' flex gap-2 items-center cursor-pointer'>
 <UserButton/>
 <div>
  <h1 className='text-sm font-medium'>{user.full_name}</h1>
  <p className='text-xs text-gray-500'>@{user.username}</p>
 </div>
  </div>
<LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
</div>
    </div>
  )
}

export default Sidebar