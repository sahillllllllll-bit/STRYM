import React, { useEffect, useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import { useAuth } from '@clerk/clerk-react';
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../../features/user/userSlice'


const Discover = () => {
  const dispatch = useDispatch();
 
   const [input, setInput]= useState('') 
  const [users, setUsers] = useState([])
 const [loading, setLoading] = useState(false)
  const {getToken}= useAuth();
 const handlesearch = async (e) => {
  if(e.key ==='Enter'){
  try {
      setUsers([]);
    setLoading(true);

    const {data}= await api.post('/api/user/discover',{input},{
      headers:{Authorization:`Bearer ${await getToken()}`}
    })
    data.success? setUsers(data.users) : toast.error(data.message)
    setLoading(false)
    setInput('')
    
  } catch (error) {
    toast.error(error.message)
  }
  setLoading(false)
   }
 }

 useEffect(()=>{
  getToken().then((token)=>{
    dispatch(fetchUser(token))
  })
 },[])

  return (
    <div className='min-h-screen  bg-gradient-to-b from-slate-50 to-white'>
     <div className='max-w-6xl mx-auto p-6 '>

      {/* title  */}
   <div className='mb-8'>
  <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
  <p className='text-slate-600'>Connect With Amazing Personality From Whole Earth</p>
</div>

{/* search-tab  */}

<div className=' mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
<div className='p-6'>
<div  className='relative'>
    <Search className=' absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
    <input type="text" placeholder='Search People By Name, Username,bio or Location...' className=' pl-10 sm:pl-10 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm' onChange={(e)=>setInput(e.target.value)} value={input} onKeyUp={handlesearch} />
</div>
</div>

</div>


<div className=' flex   flex-wrap gap-6'>
 {
  users.map((user)=>(
  <UserCard  user={user} key={user._id}/>
  ))
 }
</div>
{
  loading && (<Loading height='60vh'/>)
}
  



     </div>
    </div>
  )
}

export default Discover