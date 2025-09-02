import { Plus, Upload } from 'lucide-react'
import React from 'react'

const Strtym_ai = () => {
  return (
    <div className=" bg-[#181717]">
      <div className=' border-b border-white'>
        <h1 className="text-gray-500 text-4xl px-2 pt-4">STRYM-AI</h1>
        <p className="text-indigo-500 px-3">
          Your Partner in innovation, efficiency, and growth.
        </p>
      </div>

      {/* Parent grid */}
      <div className="grid grid-cols-5 w-full ">
        {/* Left 80% */}
        <div className="col-span-4 h-162 overflow-y-scroll no-scrollbar border border-white bg-[#181717] p-4">
          <div className='absolute border rounded-4xl bottom-18 text-white left-105'>
            <button className=' p-2 rounded-full hover:bg-indigo-900 active:scale-95   ' ><Plus/></button>
            <textarea className='w-180 resize-none    p-2   mt-4 text-sm outline-none placeholder-gray-400' placeholder="Ask Anything -strym"  />
            <button className=' p-2 rounded-full hover:bg-indigo-900 active:scale-95  '><Upload/> </button>
          </div>
        </div>

        {/* Right 20% */}
        <div className="col-span-1 h-162 overflow-y-scroll no-scrollbar text-white  border border-white bg-[#181717] p-4">
           History
        </div>
        
      </div>
    </div>
  )
}

export default Strtym_ai
