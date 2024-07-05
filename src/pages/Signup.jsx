import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import './login.css'
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';


const Signup = () => {

  const [formData,setFormData]=useState({
    username:"",
    password:"",
    email:"",
    fullName:""
  })
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error}=useMutation({
    mutationFn: async({username,password,email,fullName})=>{
      try{
        const res= await fetch(`${process.env.REACT_APP_PROXY}/api/auth/signup`,{
          method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});
      const data = await res.json()
      console.log(data)
      if (!res.ok) throw new Error(data.error || "Failed to create account")
   
    return data
      }
      catch(e){
        console.log(e)
  throw e
      }
    },
    onSuccess:()=>{
      toast("Account Created Successfully")
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  })
console.log(isError,error)
function handleSubmit(e){
  e.preventDefault();
  mutate(formData)
}
function handleChange(e){
setFormData({...formData,[e.target.name]:e.target.value})
}
  return (
    <div className='login'>
      
            <img alt="" src="https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_400x400.jpg"/>
     
        <div className='login-content'>
            <p>Whats happening!</p>
            <h2>Join X today</h2>
            <form onSubmit={handleSubmit} className='username'>
            <TextField onChange={handleChange} name="fullName" id="standard-basic" label="Full name" variant="filled" focused />
            <TextField onChange={handleChange}  name="username" id="standard-basic" label="Username" variant="filled" focused />
            <TextField onChange={handleChange} name="email" id="standard-basic" label="Email" variant="filled" focused />
            <TextField onChange={handleChange} name="password" id="standard-basic" label="Password" variant="filled" focused />
            {isError && <p className='error'>{error.message}</p>}
            <button>{isPending?"Please wait":"Signup"}</button>
            <i>Already have a account! Please  <Link to="/login" >Login</Link> in</i>
            </form>
           
        </div>
    </div>
  )
}

export default Signup