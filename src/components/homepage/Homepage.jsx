import React from 'react'
import LeftSideBar from '../leftsidebar/LeftSideBar'
import Feed from '../feed/Feed'
import RightSideBar from '../rightsidebar/RightSideBar'
import "./homepage.css"
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Login from '../../pages/Login'
import Signup from '../../pages/Signup'
import Notification from '../Notification/Notification'
import Profile from '../profile/Profile'
import { useQuery } from '@tanstack/react-query'
const Homepage = () => {
  const { data } = useQuery({ queryKey: ["authUser"] });
  console.log(data)
  return (
    <div className='homepage'>
      <div className='inner'>

    
    {  data &&  <LeftSideBar />}
        <Routes>
        <Route path='/notifications' element={data ?<Notification /> :<Navigate to="/login"/>} />
            <Route path='/' element={data? <Feed />:<Navigate to="/login"/>}/>
            <Route path='/profile/:username' element={ <Profile />}/>
            <Route path='/signup' element={!data?<Signup />:<Navigate to="/"/>}/>
            <Route path='/login' element={!data?<Login />:<Navigate to="/"/>}/>
        </Routes>
     { data &&  <RightSideBar />}
     </div>
    </div>
  )
}

export default Homepage