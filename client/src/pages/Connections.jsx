import React from 'react'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following ,
  dummyPendingConnectionsData as pendingConnections

} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react';
const Connections = () => {
   const navigate = useNavigate();

   const dataArray= [
    {label:'Followers',value:followers, icon:Users},
    {label:'Following',value:following, icon:UserCheck},
    {label:'Pending',value:pendingConnections, icon:UserRoundPen},
    {label:'Connections',value:connections, icon:UserPlus},
   ]

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
  <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
  <p className='text-slate-600'>Manage Your Network And Make New Friends</p>
</div>

      </div>
    </div>
  )
}

export default Connections