import { Route, Routes } from "react-router-dom"
import './index.css';
import Feed from './pages/Feed'
import Message from './pages/Message'
import Connections from './pages/Connections'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Createpost from './pages/Createpost'
import Login from "./pages/Login"
import { useUser } from "@clerk/clerk-react";
import  Layout  from "./pages/Layout";
import {Toaster} from "react-hot-toast";  // it is used to sedn notification


function App() {
const {user}= useUser()

  return (
    <>
  <Toaster/>
      <Routes>
        <Route path='/' element={ !user ? <Login/> : <Layout/>}>

           <Route index element={<Feed />} />
          <Route path='messages' element={<Message />} />
          <Route path='messages:userid' element={<Message />} />
          <Route path='connections' element={<Connections />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile:profileid' element={<Profile />} />
          <Route path='discover' element={<Discover />} />
          <Route path='create-post' element={<Createpost />} />

        </Route>
      </Routes>
    </>
  )
}

export default App;
