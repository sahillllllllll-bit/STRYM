import React from 'react'

const Storyviewer = ({viewStory,setViewStory}) => {
  return (
    <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center' style={{backgroundColor:viewStory.media_type=== 'text'? viewStory.background_color :'#000000'}}></div>
  )
}

export default Storyviewer