import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import Storiesbar from '../components/Storiesbar';
import Postcard from '../components/Postcard';
import Recentmessages from '../components/Recentmessages';

const Feed = () => {

  
 const [feeds,setFeeds]=useState([]);
 const [loading,setLoading]=useState(true);

const fetchfeeds =async ()=>{
  setFeeds(dummyPostsData)
  setLoading(false);
}

useEffect(()=>{
  fetchfeeds();
},[])


  return ! loading ? (
    <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)' }} className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 '>
       {/* posts and stories */}
       <div>
       <Storiesbar />
        <div className='p-4 space-y-6'>

          {
            feeds.map((post)=>{
             return <Postcard key={post._id} post={post}/>
            })
          }
        </div>
       </div>

       {/* messages and ads */}
       <div className='max-xl:hidden sticky top-0'>
         <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>our sponsors</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />
          <p className='text-slate-600'>Email Marketing</p>
          <p className='text-slate-400'>change your marketing with email, we provide seamless, cheap marketing </p>
          </div>
          
     <Recentmessages/>
       </div>
    </div>
  ) : <Loading />
}

export default Feed