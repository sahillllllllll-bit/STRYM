import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'



const Menuitems = ({setsidebaropen}) => {
  return (
    <div className=' text-gray-600 px-6 space-y-1 font-medium'>
{
    menuItemsData.map(({to,label,Icon})=>(
        <NavLink key={to} to={to} end={to=== '/'} onClick={()=>setsidebaropen(false)} className={({isActive})=> `px-3.5 py-2 flex items-center gap-3 rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-700': 'hover:bg-gray-50'}`} >
         <Icon className='h-5 w-5'/>
            {label}
        </NavLink>
       
        
    ))
}
    </div>
  )
}

export default Menuitems 