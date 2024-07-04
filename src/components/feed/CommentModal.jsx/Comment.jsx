import React, { useState } from 'react'
import './comment.css'
import TextField from '@mui/material/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userp from "../../../store/images/userp.png";
import Avatar from 'react-avatar';
import { IoIosCloseCircle } from "react-icons/io";
import { formatPostDate } from '../../../functions';
const Comment = ({id,setisCmt,item}) => {
    console.log(item)
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();
    const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
            setisCmt(null)
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
  return (
    <div className='comment'> 
    <span>
    <h2>Comments</h2>
    <IoIosCloseCircle id="cross" onClick={()=>setisCmt(null)}/>
    </span>
    
        <div className='content'>
            {!item.comments.length>0 && <p className='warning'>No comments yet.</p>}
            {item.comments.map((item)=>{
                return <div className='comm'>
                    <Avatar src={item.user.profileImg || userp} size={30} round={true}/>
                    <div className='text'>
                        <div className='username'>
                            <p>{item.user.fullName}</p>
                            <p>@{item.user.username}</p>
                       
                            </div>
                            <p>{item.text}</p>
                        </div>
                    </div>
            })}
        </div>
        <div className='form'>
        <TextField placeholder='Comment!!' name="username" id="standard-basic" value={comment} onChange={(e)=>setComment(e.target.value)}  variant="outlined" focused />
            <button onClick={()=>commentPost()}>{isCommenting?"replying":"reply"}</button>
        </div>
    </div>
  )
}

export default Comment