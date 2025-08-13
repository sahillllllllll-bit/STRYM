import React from 'react'

const Loading = ( {height='100vh'}) => {
  return (
    <div style={{height}} className='flex items-center justify-center h-screen'>
      <div
      className='rounded-full border-3 border-purple-500 border-t-transparent animate-spin w-10 h-10'></div>
    </div>
  )
}

export default Loading