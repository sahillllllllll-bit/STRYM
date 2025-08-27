import { Route, Routes } from "react-router-dom"
import './index.css';
import Feed from './pages/Feed'
import Message from './pages/Message'
import Connections from './pages/Connections'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Createpost from './pages/Createpost'
import Createminto from './pages/Createminto'
import Login from "./pages/Login"
import { useUser } from "@clerk/clerk-react";
import  Layout  from "./pages/Layout";
import {Toaster} from "react-hot-toast";  // it is used to sedn notification
import Minto from "./pages/Minto";
import { ThemeProvider } from './context/ThemeContext';
import Theme from "./pages/Theme";
import Strtym_ai from "./pages/Strtym_ai";
import Chatbox from "./pages/Chatbox";


function App() {
const {user}= useUser()

  return (
    <>
    <ThemeProvider>
      <Toaster/>
      <Routes>
        <Route path='/' element={ !user ? <Login/> : <Layout/>}>

           <Route index element={<Feed />} />
          <Route path='messages' element={<Message />} />
          <Route path='messages/:userid' element={<Chatbox />} />
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
