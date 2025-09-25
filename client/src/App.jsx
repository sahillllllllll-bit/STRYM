import { Route, Routes, useLocation } from "react-router-dom"
import './index.css';
import Feed from './pages/Feed'
import Message from './pages/Message'
import Connections from './pages/Connections'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Createpost from './pages/Createpost'
import Createminto from './pages/Createminto'
import Login from "./pages/Login"
import { useUser,useAuth } from "@clerk/clerk-react";
import  Layout  from "./pages/Layout";
import toast, {Toaster} from "react-hot-toast";  // it is used to sedn notification
import Minto from "./pages/Minto";
import { ThemeProvider } from './context/ThemeContext';
import Theme from "./pages/Theme";
import Strtym_ai from "./pages/Strtym_ai";
import Chatbox from "./pages/Chatbox";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/user/userSlice.js";
import { fetchConnections } from "../features/connections/connectionSlice.js";
import { addMessage } from "../features/messages/messageSlice.js";


function App() {
const {user}= useUser()
const {getToken}= useAuth();
const {pathname}= useLocation();

const pathnameRef =useRef(pathname)

const dispatch = useDispatch()
 
useEffect(()=>{
  const fetchData = async () => {
    
    if(user){
      const token=await getToken()
     dispatch(fetchUser(token))
     dispatch(fetchConnections(token))

    }
  }
  fetchData();
},[user,getToken,dispatch])

useEffect(()=>{
pathnameRef.current=pathname
},[pathname])

useEffect(()=>{
  if(user){
  const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id);

  eventSource.onmessage =(event) =>{
    const message =JSON.parse(event.data)

    if(pathnameRef.current===('/messages/'+message.from_user_id._id)){
      dispatch(addMessage(message))
    }else{
          toast.custom((t)=>(
<Notification t={t} message={message}/>
          ),{position :"bottom-right"})
    }
  }
  return ()=>{
    eventSource.close();
  }
}
},[user,dispatch])

  return (
    <>
    <ThemeProvider>
      <Toaster/>
      <Routes>
        <Route path='/' element={ !user ? <Login/> : <Layout/>}>

           <Route index element={<Feed />} />
          <Route path='messages' element={<Message />} />
          <Route path='messages/:userId' element={<Chatbox />} />
          <Route path='connections' element={<Connections />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
         

          <Route path='discover' element={<Discover />} />
           <Route path='minto' element={<Minto />} />
           <Route path='strym-ai' element={<Strtym_ai />} />

            <Route path='theme' element={<Theme />} />
          <Route path='create-post' element={<Createpost />} />
           <Route path='create-minto' element={<Createminto />} />

        </Route>
      </Routes>
      </ThemeProvider>
    </>
  )
}

export default App;
