import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import Storiesbar from '../components/Storiesbar';

const Feed = () => {

  
 const [feeds,setfeeds]=useState([]);
 const [loading,setLoading]=useState(true);

const fetchfeeds =async ()=>{
  setfeeds(dummyPostsData)
  setLoading(false);
}

useEffect(()=>{
  fetchfeeds();
},[])


  return ! loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 '>
       {/* posts and stories */}
       <div>
       <Storiesbar/>
        <div className='p-4 space-y-6'>list of posts</div>
       </div>

       {/* messages and ads */}
       <div>
         <div><h1>our sponsors</h1></div>
       <h1>Recent messages</h1>
       </div>
    </div>
  ) : <Loading />
}

export default Feed