import React, { useState } from 'react'
import './updateform.css'
import TextField from '@mui/material/TextField';


import useUpdateUserProfile from '../../hooks/useUpdateUserProfile';
import { IoIosCloseCircle } from "react-icons/io";
const UpdateForm = ({authUser,setClick}) => {

  const [formData, setFormData] = useState({
    fullName: authUser.fullName,
    username: authUser.username,
    email: authUser.email,
    bio: authUser.bio,
    link: authUser.link,
    newPassword: "",
    currentPassword: "",
	});
  const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  

  return (
    <div className='updateform'>
       <IoIosCloseCircle size={22} onClick={()=>setClick(null)} id="cross"/>
        <div className='form'>
        <h2>Update Profile</h2>
            <div className='row'>
            <TextField id="fullName" defaultValue={formData.fullName}  onChange={handleInputChange} label="Full Name" variant="outlined" focused />
            <TextField id="username" defaultValue={formData.username}  onChange={handleInputChange} label="Outlined" variant="outlined" focused />
            </div>
            <div className='row'>
            <TextField id="email" defaultValue={formData.email} onChange={handleInputChange} label="email" variant="outlined" focused />
            <TextField id="bio" defaultValue={formData.bio}  onChange={handleInputChange} label="bio" variant="outlined" focused />
            </div>
            <div className='row'>
            <TextField id="currentPassword" onChange={handleInputChange} label="currentPassword" variant="outlined" focused />
            <TextField id="newPassword" onChange={handleInputChange} label="newPassword"  
         variant="outlined" focused />
            </div>
            <div className='row'>
            <TextField id="link" defaultValue={formData.link}  onChange={handleInputChange} label="Link" variant="outlined" focused />
            </div>
            <button onClick={()=>{
              setClick(null)
              updateProfile(formData)
            }}>{isUpdatingProfile ? "Loading.." :"Update"}</button>
        </div>
    </div>
  )
}

export default UpdateForm