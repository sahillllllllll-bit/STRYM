import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react';

const ProfileEditModal = ({setShowEdits}) => {
    const user =dummyUserData;
    const [editForm, setEditForm] =useState({
        username:user.username,
        bio :user.bio,
        location: user.location,
        profile_picture:null,
        cover_photo :null,
        full_name :user.full_name,
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault();
    }

  return (
    <div className='fixed  top-0 bottom-0 left-0 right-0  z-110 h-screen bg-black/50 overflow-y-scroll'>
          <div className='max-w-2xl mx-auto sm:py-6'>
 <div className="bg-white rounded-lg shadow p-6">
   <h1 className='text-2xl font-bold text-gray-900 mb-6'>
 Edit Profile
   </h1>
   <form  className='space-y-4' onSubmit={handleSaveProfile}>

   <div className='flex flex-col items-start gap-3'>
    <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
        Profile Picture
        <input hidden type="file" accept='image/*' id='profile_picture' onChange={(e)=>setEditForm({...editForm,profile_picture:e.target.files[0]})} className='w-full p-3 border border-gray-300 rounded-lg' />
        <div className="groupprofile relative">
            <img src={editForm.profile_picture ?URL.createObjectURL(editForm.profile_picture):user.profile_picture} alt="" className='w-24 h-24 rounded-full object-cover mt-2' />
            <div className='absolute hidden group-hover/profile:flex top-0 left-0 bottom-0 right-0  bg-black/20 rounded-full items-center justify-center '>
               <Pencil className='w-5 h-5 text-white'/>
            </div>
        </div>
        
    </label>
   </div>

   {/* cover-photo  */}

   <div className="flex flex-col  items-start gap-3 ">
       <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1 '>
        Cover Photo 
          <input hidden type="file" accept='image/*' id='cover_photo' onChange={(e)=>setEditForm({...editForm,cover_photo:e.target.files[0]})} className='w-full p-3 border border-gray-300 rounded-lg' />

         <div className='group/cover relative'>
            <img src={editForm.cover_photo ?URL.createObjectURL(editForm.cover_photo):user.cover_photo} alt="" className='w-80 h-40 rounded-lg  bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2' />
            <div className='absolute hidden group-hover/profile:flex top-0 left-0 bottom-0 right-0  bg-black/20 rounded-full items-center justify-center '>
                 <Pencil className='w-5 h-5 text-white'/>
            </div>
         </div>

       </label>
   </div>

<div>
    <label className='block text-sm font-medium  text-gray-700 mb-1' >
        Name
    </label>
    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e)=> setEditForm({...editForm,full_name:e.target.value})} value={editForm.full_name}  placeholder='Please Enter Your Full Name' />
</div>
<div>
    <label className='block text-sm font-medium  text-gray-700 mb-1' >
        Username
    </label>
    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e)=> setEditForm({...editForm,username:e.target.value})} value={editForm.username}  placeholder='Please Enter Your Username' />
</div>
<div>
    <label className='block text-sm font-medium  text-gray-700 mb-1' >
        Bio.
    </label>
    <textarea rows={3} className='w-full  p-3 border border-gray-200 rounded-lg' onChange={(e)=> setEditForm({...editForm,bio:e.target.value})} value={editForm.bio}  placeholder='Please Enter Bio' />
</div>

<div>
    <label className='block text-sm font-medium  text-gray-700 mb-1' >
        Location
    </label>
    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e)=> setEditForm({...editForm,location:e.target.value})} value={editForm.location}  placeholder='Please Enter Your Location' />
</div>

<div className='flex justify-end space-x-3 pt-6'>
     <button  onClick={()=>setShowEdits(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>
   Cancel
     </button>
     <button  type='submit' className=' px-4 py-2  cursor-pointer transition  bg-gradient-to-r from-indigo-500 to-purple-600  text-white rounded-lg hover:from-indigo-600 hover:to-purple-700'>
   Save Changes
     </button>
</div>

   </form>
 </div>
          </div>
    </div>
  )
}

export default ProfileEditModal