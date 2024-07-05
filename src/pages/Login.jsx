import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import './login.css'
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Login = () => {
  const [formData,setFormData]=useState({
    username:"",
    password:""
  })
	const queryClient = useQueryClient();
  const {mutate,isError,error,isPending}=useMutation({
    mutationFn:async({username,password})=>{
      try{
        const res =await fetch(`${process.env.REACT_APP_PROXY}/api/auth/login`,{
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },body:(JSON.stringify({username,password}))
          ,credentials: 'include'})
        const data=await res.json()
        if(!res.ok) throw new Error(data.error || "Something went wrong")
          return data;
      }catch(e){
        console.log(e)
        throw e
      }
    
    },
onSuccess:()=>{
  queryClient.invalidateQueries({ queryKey: ["authUser"] });
}
  })

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
     
        <div className='login-content' onSubmit={handleSubmit}>
            <p>Welcome back</p>
            <form className='username'>
            <TextField onChange={handleChange} name="username" id="standard-basic" label="username" variant="filled" focused />
           
            <TextField id="standard-basic" onChange={handleChange} name="password"  label="password" variant="filled" focused />
            {isError&&<p className='error'>{error.message}</p>}
            <button type="submit">{isPending?"Please wait":"Login"}</button>
            <i>Dont have a account! Create a  <Link to="/signup" >New </Link> one</i>
            </form>
           
        </div>
    </div>
  )
}

export default Login