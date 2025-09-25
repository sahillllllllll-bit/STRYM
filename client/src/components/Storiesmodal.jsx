import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Storiesmodal = ({setShowModal, fetchStories}) => {

    const bgcolors= [ "blue", "red","green","red","black","pink","grey",  "#4F46E5","#6366F1","#8B5CF6","#EC4899","#F43F5E","#F97316", "#F59E0B","#84CC16", "#22C55E", "#06B6D4","#0EA5E9","#3B82F6","#9333EA","#EAB308","#DC2626"]

    const [mode, setMode] =useState("text");
    const [background, setBackground] = useState(bgcolors[0]);
   const [text, setText] =useState("");
   const [media, setMedia] =useState(null);
   const [previewUrl, setPreviewURl] =useState(null);
   const {getToken}= useAuth();

   const handleMediaUpload =(e)=>{
    const file=e.target.files?.[0]
    if(file){
        setMedia(file);
        setPreviewURl(URL.createObjectURL(file))
    }
   }

   const max_video_duration =60;
   const max_video_size =50;
   const handleCreateStory =async ()=>{
  const media_type =mode === 'media' ?media?.type.startsWith('image')?'image':'video':'text';
  if(media_type==='text' &&!text){
    throw new Error("Please Enter Some Text")
  }

  let formdata = new FormData();
  formdata.append('content',text);
  formdata.append('media_type',media_type);
  formdata.append('media',media);
  formdata.append('background_color',background);
    const token = await getToken();
    try {
        const {data} = await api.post(`/api/story/create`,formdata,
            {headers :{Authorization:`Bearer ${ token}`}}
        )

        if(data.success){
            setShowModal(false)
            toast.success("Story Created Successfully")
            fetchStories();

        }else{
            toast.error(data.message)
        }
    } catch (error) {
            toast.error(error.message)
        
    } 

   }



  return (
    <div className='fixed inset-0  z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
  <div className='w-full max-w-wd'>
    <div className=' text-center mb-4 flex items-center justify-between'>
   <button  onClick={()=>setShowModal(false)} className='text-white p-2 cursor-pointer'>
    <ArrowLeft/>
   </button>
   <h2 className='text-lg font-semibold'>Create Story</h2>
   <span className='w-10'></span>
    </div>
   
   <div className='rounded-lg h-96 flex items-center justify-center relative' style={{backgroundColor:background}}>
    {
        mode==='text' &&(
            <textarea className='bg-transparent h-full w-full p-6 text-white text-lg resize-none focus:outline-none' placeholder="What's on your mind? " onChange={(e)=>setText(e.target.value)} value={text}/>
        )
    }
    {
        mode=== 'media'&& previewUrl &&(
            media?.type.startsWith('image')?(
                <img src={previewUrl} alt="" className='object-contain max-h-full' />
            ) :(
                <video src={previewUrl} autoPlay className='object-contain max-h-full' />
            )
        )
    }

   </div>

{/* color pallete */}
<div className='flex mt-4 gap-2'>
{
    bgcolors.map((color)=>(
        <button key={color} className='w-6 h-6 cursor-pointer rounded-full ring' style={{backgroundColor:color}} onClick={()=>setBackground(color)}/>
    ))
}
</div>

 {/* story style change  */}

<div className='flex gap-2 mt-4'>
<button onClick={()=>{setMode('text'); setMedia(null); setPreviewURl(null)}} className={` flex-1 flex items-center justify-center gap-2 p-2 rounded ${mode==='text'?"bg-white text-black" : "bg-zinc-800"} `}>
<TextIcon size={18}/> Text
</button>

<label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode==='media'? "bg-white text-black":"bg-zinc-800"}`}>
    <input onChange={(e)=>{handleMediaUpload(e); setMode('media')}} type="file" className='hidden'  accept='image/*, video/*' />
    <Upload size={18}/> Image/Video
        </label>
</div>

 {/* create story button  */}
 <button onClick={()=> toast.promise(handleCreateStory(),{
    loading:'saving...',
    success: <p>Story added</p>,
    error : e=> <p>{e.message}</p>
 })} className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer'>
    <Sparkle size={18}/> Create Story
 </button>

  </div>
    </div>
  )
}

export default Storiesmodal